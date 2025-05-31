
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageSquare, Send, ArrowLeft, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

interface Post {
  id: string;
  image_url: string;
  caption: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
      checkIfLiked();
    }
  }, [postId, user]);

  const fetchPost = async () => {
    try {
      // First get the post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (postError) {
        console.error('Error fetching post:', postError);
        toast({
          title: "Error",
          description: "Failed to load post",
          variant: "destructive"
        });
        return;
      }

      // Then get the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', postData.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      setPost({
        ...postData,
        profiles: profileData || { username: 'Unknown User', avatar_url: null }
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "Error",
        description: "Failed to load post",
        variant: "destructive"
      });
    }
  };

  const fetchComments = async () => {
    try {
      // Get comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        return;
      }

      if (commentsData && commentsData.length > 0) {
        // Get unique user IDs
        const userIds = [...new Set(commentsData.map(comment => comment.user_id))];
        
        // Fetch profiles for these users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          setComments([]);
        } else {
          // Create a map of user_id to profile
          const profileMap = new Map();
          profilesData?.forEach(profile => {
            profileMap.set(profile.id, profile);
          });

          // Combine comments with profiles
          const commentsWithProfiles = commentsData.map(comment => ({
            ...comment,
            profiles: profileMap.get(comment.user_id) || { username: 'Unknown User', avatar_url: null }
          }));

          setComments(commentsWithProfiles);
        }
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const checkIfLiked = async () => {
    if (!user || !postId) return;

    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    setLiked(!!data);
  };

  const handleLike = async () => {
    if (!user || !postId) return;

    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: user.id });
    }

    setLiked(!liked);
    fetchPost(); // Refresh to update like count
  };

  const handleComment = async () => {
    if (!user || !postId || !newComment.trim()) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim()
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } else {
      setNewComment('');
      fetchComments();
      fetchPost(); // Refresh to update comment count
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navigation />
        <div className="pt-16 flex items-center justify-center h-64">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation />
      <div className="pt-16 pb-20 md:pb-8">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold ml-2">Post</h1>
          </div>

          <Card className="mb-4">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-0.5">
                  <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
                    {post.profiles?.avatar_url ? (
                      <img src={post.profiles.avatar_url} alt={post.profiles.username} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm">{post.profiles?.username}</p>
                  <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Post Image */}
            <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={post.image_url}
                alt="Post"
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLike}
                    className={`hover:scale-110 transition-all duration-200 ${
                      liked ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <p className="font-semibold text-sm mb-2">{post.likes_count} likes</p>

              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-semibold mr-2">{post.profiles?.username}</span>
                  {post.caption}
                </p>
              </div>
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Comments ({post.comments_count})</h2>
            
            {/* Add Comment */}
            {user && (
              <div className="flex space-x-2 mb-4">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <Button onClick={handleComment} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-0.5 flex-shrink-0">
                    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
                      {comment.profiles?.avatar_url ? (
                        <img src={comment.profiles.avatar_url} alt={comment.profiles.username} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold mr-2">{comment.profiles?.username}</span>
                      {comment.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;

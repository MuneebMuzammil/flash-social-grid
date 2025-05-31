
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';
import Stories from './Stories';
import { supabase } from '@/integrations/supabase/client';

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

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fallback dummy data for when there are no real posts
  const dummyPosts = [
    {
      id: 'dummy-1',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      caption: 'Beautiful sunset in Santorini! 🌅 #travel #sunset #greece',
      likes_count: 2847,
      comments_count: 156,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user_id: 'dummy-user-1',
      profiles: {
        username: 'travel_diary',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      }
    },
    {
      id: 'dummy-2',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
      caption: 'Homemade pizza night! 🍕 Recipe in bio #cooking #foodie',
      likes_count: 1203,
      comments_count: 89,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      user_id: 'dummy-user-2',
      profiles: {
        username: 'food_lover',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c8?w=150&h=150&fit=crop&crop=face'
      }
    },
    {
      id: 'dummy-3',
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
      caption: 'Morning hike through the forest 🌲 #nature #hiking #peaceful',
      likes_count: 892,
      comments_count: 67,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      user_id: 'dummy-user-3',
      profiles: {
        username: 'nature_shots',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    },
    {
      id: 'dummy-4',
      image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=400&fit=crop',
      caption: 'Perfect latte art to start the day ☕ #coffee #latteart #morning',
      likes_count: 1567,
      comments_count: 123,
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      user_id: 'dummy-user-4',
      profiles: {
        username: 'coffee_culture',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        // Use dummy data if there's an error or no posts
        setPosts(dummyPosts);
      } else {
        // If no real posts exist, use dummy data
        setPosts(data && data.length > 0 ? data : dummyPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts(dummyPosts);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="pt-16 pb-20 md:pb-8">
          <Stories />
          <div className="max-w-md mx-auto px-4 py-6 flex items-center justify-center">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="pt-16 pb-20 md:pb-8">
        <Stories />
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {posts.map((post) => (
            <div key={post.id} onClick={() => handlePostClick(post.id)} className="cursor-pointer">
              <PostCard
                username={post.profiles?.username || 'Unknown User'}
                userAvatar={post.profiles?.avatar_url}
                postImage={post.image_url}
                caption={post.caption}
                likes={post.likes_count}
                timeAgo={getTimeAgo(post.created_at)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
};

export default Feed;

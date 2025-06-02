
import React, { useEffect, useState } from 'react';
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
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
      }
    },
    {
      id: 'dummy-2',
      image_url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=2020&auto=format&fit=crop',
      caption: 'Homemade pizza night! 🍕 Recipe in bio #cooking #foodie',
      likes_count: 1203,
      comments_count: 89,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      user_id: 'dummy-user-2',
      profiles: {
        username: 'food_lover',
        avatar_url: 'https://images.unsplash.com/photo-1619524537696-3309f8843e92?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
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
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        setPosts(dummyPosts);
        setLoading(false);
        return;
      }

      if (postsData && postsData.length > 0) {
        const userIds = [...new Set(postsData.map(post => post.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          setPosts(dummyPosts);
        } else {
          const profileMap = new Map();
          profilesData?.forEach(profile => {
            profileMap.set(profile.id, profile);
          });

          const postsWithProfiles = postsData.map(post => ({
            ...post,
            profiles: profileMap.get(post.user_id) || { username: 'Unknown User', avatar_url: null }
          }));

          setPosts(postsWithProfiles);
        }
      } else {
        setPosts(dummyPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts(dummyPosts);
    } finally {
      setLoading(false);
    }
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
            <PostCard
              key={post.id}
              id={post.id}
              username={post.profiles?.username || 'Unknown User'}
              userAvatar={post.profiles?.avatar_url}
              postImage={post.image_url}
              caption={post.caption}
              likes={post.likes_count}
              timeAgo={getTimeAgo(post.created_at)}
            />
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


import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Story {
  id: string;
  username: string;
  avatar?: string;
  hasStory: boolean;
  isViewed?: boolean;
}

const fallbackAvatar = 'https://ui-avatars.com/api/?name=User&background=333&color=fff';

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);

  const dummyStories: Story[] = [
    { id: 'your-story', username: 'Your Story', hasStory: false, avatar: fallbackAvatar },
    { id: '2', username: 'john_doe', hasStory: true, isViewed: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: '3', username: 'jane_smith', hasStory: true, isViewed: true, avatar: 'https://images.unsplash.com/photo-1656338997878-279d71d48f6e?q=80&w=1964&auto=format&fit=crop' },
    { id: '4', username: 'travel_diary', hasStory: true, isViewed: false, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
    { id: '5', username: 'food_lover', hasStory: true, isViewed: true, avatar: 'https://images.unsplash.com/photo-1619524537696-3309f8843e92?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: '6', username: 'tech_news', hasStory: true, isViewed: false, avatar: fallbackAvatar },
  ];

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (storiesError || !storiesData?.length) {
        setStories(dummyStories);
        return;
      }

      const userIds = [...new Set(storiesData.map((story) => story.user_id))];

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      if (profilesError || !profilesData) {
        setStories(dummyStories);
        return;
      }

      const profileMap = new Map();
      profilesData.forEach((profile) => {
        profileMap.set(profile.id, profile);
      });

      const formattedStories = storiesData.map((story) => {
        const profile = profileMap.get(story.user_id);
        return {
          id: story.id,
          username: profile?.username || 'Unknown',
          avatar: profile?.avatar_url || fallbackAvatar,
          hasStory: true,
          isViewed: Math.random() > 0.5,
        };
      });

      setStories([
        { id: 'your-story', username: 'Your Story', hasStory: false, avatar: fallbackAvatar },
        ...formattedStories,
      ]);
    } catch (error) {
      console.error('Unexpected error:', error);
      setStories(dummyStories);
    }
  };

  return (
    <div className="w-full bg-black text-white border-b border-gray-800 py-4">
      <div className="max-w-md mx-auto px-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-1 min-w-[70px]">
              <div
                className={`w-16 h-16 rounded-full p-[2px] ${
                  story.id === 'your-story'
                    ? 'bg-gray-700'
                    : 'bg-gradient-to-tr from-pink-500 to-yellow-500 animate-spin-slow'
                } hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                  {story.avatar ? (
                    <img
                      src={story.avatar}
                      alt={story.username}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>
              <p className="text-xs text-center max-w-[70px] truncate">
                {story.username}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stories;

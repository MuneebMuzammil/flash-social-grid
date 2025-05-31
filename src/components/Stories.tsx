
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

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);

  // Fallback dummy data
  const dummyStories: Story[] = [
    { id: '1', username: 'Your Story', hasStory: false },
    { id: '2', username: 'john_doe', hasStory: true, isViewed: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: '3', username: 'jane_smith', hasStory: true, isViewed: true, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c8?w=150&h=150&fit=crop&crop=face' },
    { id: '4', username: 'travel_diary', hasStory: true, isViewed: false, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
    { id: '5', username: 'food_lover', hasStory: true, isViewed: true, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
    { id: '6', username: 'tech_news', hasStory: true, isViewed: false },
  ];

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data: storiesData, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stories:', error);
        setStories(dummyStories);
        return;
      }

      if (storiesData && storiesData.length > 0) {
        const formattedStories = storiesData.map(story => ({
          id: story.id,
          username: story.profiles?.username || 'Unknown',
          avatar: story.profiles?.avatar_url,
          hasStory: true,
          isViewed: Math.random() > 0.5 // Random for demo
        }));
        
        // Add "Your Story" at the beginning
        setStories([
          { id: 'your-story', username: 'Your Story', hasStory: false },
          ...formattedStories
        ]);
      } else {
        setStories(dummyStories);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      setStories(dummyStories);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4">
      <div className="max-w-md mx-auto px-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-1 min-w-[70px]">
              <div
                className={`w-16 h-16 rounded-full p-0.5 ${
                  story.hasStory
                    ? story.isViewed
                      ? 'bg-gray-300 dark:bg-gray-600'
                      : 'bg-story-gradient'
                    : 'bg-gray-200 dark:bg-gray-700'
                } hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
                  {story.avatar ? (
                    <img src={story.avatar} alt={story.username} className="w-full h-full object-cover" />
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

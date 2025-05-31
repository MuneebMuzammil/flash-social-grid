
import React from 'react';
import { User } from 'lucide-react';

interface Story {
  id: string;
  username: string;
  avatar?: string;
  hasStory: boolean;
  isViewed?: boolean;
}

const Stories = () => {
  const stories: Story[] = [
    { id: '1', username: 'Your Story', hasStory: false },
    { id: '2', username: 'john_doe', hasStory: true, isViewed: false },
    { id: '3', username: 'jane_smith', hasStory: true, isViewed: true },
    { id: '4', username: 'travel_diary', hasStory: true, isViewed: false },
    { id: '5', username: 'food_lover', hasStory: true, isViewed: true },
    { id: '6', username: 'tech_news', hasStory: true, isViewed: false },
  ];

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

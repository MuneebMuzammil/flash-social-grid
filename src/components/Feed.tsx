
import React from 'react';
import PostCard from './PostCard';
import Stories from './Stories';

const Feed = () => {
  const posts = [
    {
      id: '1',
      username: 'travel_diary',
      postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      caption: 'Beautiful sunset in Santorini! 🌅 #travel #sunset #greece',
      likes: 2847,
      timeAgo: '2h'
    },
    {
      id: '2',
      username: 'food_lover',
      postImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
      caption: 'Homemade pizza night! 🍕 Recipe in bio #cooking #foodie',
      likes: 1203,
      timeAgo: '4h'
    },
    {
      id: '3',
      username: 'nature_shots',
      postImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
      caption: 'Morning hike through the forest 🌲 #nature #hiking #peaceful',
      likes: 892,
      timeAgo: '6h'
    },
    {
      id: '4',
      username: 'coffee_culture',
      postImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=400&fit=crop',
      caption: 'Perfect latte art to start the day ☕ #coffee #latteart #morning',
      likes: 1567,
      timeAgo: '8h'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="pt-16 pb-20 md:pb-8">
        <Stories />
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              username={post.username}
              postImage={post.postImage}
              caption={post.caption}
              likes={post.likes}
              timeAgo={post.timeAgo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;

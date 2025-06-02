import React, { useState } from 'react';
import { Heart, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PostCardProps {
  id: string;
  username: string;
  userAvatar?: string;
  postImage: string;
  caption: string;
  likes: number;
  timeAgo: string;
  isLiked?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  username,
  userAvatar,
  postImage,
  caption,
  likes,
  timeAgo,
  isLiked = false
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments(prev => [...prev, comment.trim()]);
      setComment('');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-0.5">
            <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
              {userAvatar ? (
                <img src={userAvatar} alt={username} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm">{username}</p>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
      </div>

      {/* Post Image */}
      <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={postImage}
          alt="Post"
          className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500"
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
            <Button
              variant="ghost"
              size="icon"
              className="hover:scale-110 transition-transform"
            >
              <MessageSquare className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-2">{likeCount.toLocaleString()} likes</p>

        {/* Caption */}
        <div className="space-y-1 mb-4">
          <p className="text-sm">
            <span className="font-semibold mr-2">{username}</span>
            {caption}
          </p>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-4 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        </form>

        {/* Comments */}
        <div className="space-y-2">
          {comments.map((cmt, index) => (
            <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold mr-1">You</span>{cmt}
            </p>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PostCard;










// import React, { useState } from 'react';
// import { Heart, MessageSquare, User } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';

// interface PostCardProps {
//   username: string;
//   userAvatar?: string;
//   postImage: string;
//   caption: string;
//   likes: number;
//   timeAgo: string;
//   isLiked?: boolean;
// }

// const PostCard: React.FC<PostCardProps> = ({
//   username,
//   userAvatar,
//   postImage,
//   caption,
//   likes,
//   timeAgo,
//   isLiked = false
// }) => {
//   const [liked, setLiked] = useState(isLiked);
//   const [likeCount, setLikeCount] = useState(likes);
//   const [comment, setComment] = useState('');
//   const [comments, setComments] = useState<string[]>([]);

//   const handleLike = () => {
//     setLiked(!liked);
//     setLikeCount(prev => liked ? prev - 1 : prev + 1);
//   };

//   const handleCommentSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (comment.trim()) {
//       setComments(prev => [...prev, comment.trim()]);
//       setComment('');
//     }
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
//       {/* Post Header */}
//       <div className="flex items-center justify-between p-4">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-0.5">
//             <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
//               {userAvatar ? (
//                 <img src={userAvatar} alt={username} className="w-full h-full object-cover" />
//               ) : (
//                 <User className="w-5 h-5 text-gray-400" />
//               )}
//             </div>
//           </div>
//           <div>
//             <p className="font-semibold text-sm">{username}</p>
//             <p className="text-xs text-gray-500">{timeAgo}</p>
//           </div>
//         </div>
//       </div>

//       {/* Post Image */}
//       <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
//         <img
//           src={postImage}
//           alt="Post"
//           className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500"
//         />
//       </div>

//       {/* Post Actions */}
//       <div className="p-4">
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center space-x-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={handleLike}
//               className={`hover:scale-110 transition-all duration-200 ${
//                 liked ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
//               }`}
//             >
//               <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="hover:scale-110 transition-transform"
//             >
//               <MessageSquare className="w-6 h-6" />
//             </Button>
//           </div>
//         </div>

//         {/* Likes */}
//         <p className="font-semibold text-sm mb-2">{likeCount.toLocaleString()} likes</p>

//         {/* Caption */}
//         <div className="space-y-1 mb-4">
//           <p className="text-sm">
//             <span className="font-semibold mr-2">{username}</span>
//             {caption}
//           </p>
//         </div>

//         {/* Comment Form */}
//         <form onSubmit={handleCommentSubmit} className="mb-4">
//           <input
//             type="text"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             placeholder="Add a comment..."
//             className="w-full px-4 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none"
//           />
//         </form>

//         {/* Comments */}
//         <div className="space-y-2">
//           {comments.map((cmt, index) => (
//             <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
//               <span className="font-semibold mr-1">You</span>{cmt}
//             </p>
//           ))}
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default PostCard;

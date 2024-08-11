import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, BookmarkPlus, Share2 } from 'lucide-react';

interface NewsCardProps {
  title: string;
  description: string;
  url: string;
  onLike: () => void;
  onBookmark: () => void;
  onShare: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  url,
  onLike,
  onBookmark,
  onShare
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="news-card bg-gray-800 text-white border border-gray-700 rounded-lg overflow-hidden shadow-lg"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300"
          >
            Read more
          </a>
          <div className="flex space-x-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onLike}
              className="text-green-400 hover:text-green-300"
            >
              <Heart size={20} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onBookmark}
              className="text-green-400 hover:text-green-300"
            >
              <BookmarkPlus size={20} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onShare}
              className="text-green-400 hover:text-green-300"
            >
              <Share2 size={20} />
            </motion.button>
          </div>
        </div>
      </div>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
          onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
        >
          <p className="text-white text-center p-4">Click to read full article</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NewsCard;

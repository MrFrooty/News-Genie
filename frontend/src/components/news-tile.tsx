import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2 } from 'lucide-react';

export interface Article {
  id: number;
  title: string;
  briefPreview: string;
  fullPreview: string;
  url: string;
  source: string;
  isLiked: boolean;
}

interface NewsTileProps {
  article: Article;
  articleNumber: number;
  onClick: () => void;
  isSelected: boolean;
  onLike: (id: number) => void;
  onShare: (article: Article) => void;
}

const NewsTile: React.FC<NewsTileProps> = ({ article, onClick, isSelected, onLike, onShare }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={`flex-shrink-0 w-64 p-4 bg-gray-800 rounded-xl cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <h3 className="font-bold text-lg mb-2">{article.title}</h3>
      <p className="text-sm mb-4">{article.briefPreview}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">{article.source}</span>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(article.id);
            }}
            className={`p-1 rounded-full ${
              article.isLiked ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            <Heart size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(article);
            }}
            className="p-1 rounded-full bg-gray-700 text-gray-300"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
      <a
        href={`https://www.google.com/search?q=${encodeURIComponent(`${article.title} ${article.source}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
      >
        Learn More
      </a>
    </motion.div>
  );
};

export default NewsTile;

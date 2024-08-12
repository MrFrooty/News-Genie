import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article } from './news-tile';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, article }) => {
  if (!article) return null;

  const shareOptions = [
    {
      name: 'Twitter',
      icon: 'twitter.svg',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.url)}`
    },
    {
      name: 'Facebook',
      icon: 'facebook.svg',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin.svg',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(article.url)}&title=${encodeURIComponent(article.title)}`
    },
    {
      name: 'WhatsApp',
      icon: 'whatsapp.svg',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + article.url)}`
    }
    // { name: 'Email', icon: 'email.svg', url: `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(article.briefPreview + '\n\nRead more: ' + article.url)}` },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 p-6 rounded-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Share this article</h2>
            <div className="grid grid-cols-3 gap-4">
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <img src={`/icons/${option.icon}`} alt={option.name} className="w-8 h-8 mb-2" />
                  <span className="text-sm">{option.name}</span>
                </a>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">{article.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{article.briefPreview}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/button';
import { generatePDF } from '@/utils/pdf-generator';

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

const NewsTile: React.FC<NewsTileProps> = ({
  article,
  articleNumber,
  onClick,
  isSelected,
  onLike,
  onShare
}) => {
  const contentBullets = article.briefPreview.split('\n');
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(article);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(article.id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    generatePDF(article);
  };

  const handleVisitArticle = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className={`bg-gray-800/50 p-4 rounded-xl cursor-pointer flex-shrink-0 w-96 h-64 flex flex-col justify-between m-2 ${
        isSelected ? 'ring-2 ring-green-500' : ''
      }`}
      style={{ boxShadow: isSelected ? '0 0 0 2px rgb(34 197 94)' : 'none' }}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start mb-2">
          <span className="text-sm font-bold mr-2">{articleNumber}.</span>
          <h3 className="font-bold text-sm line-clamp-2">{article.title}</h3>
        </div>
        <p className="text-xs text-gray-400 mb-2 flex-grow overflow-y-auto">
          {article.briefPreview}
        </p>
        {article.source && (
          <div className="text-xs text-gray-500 mt-2">
            Source:{' '}
            {article.url ? (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {article.source}
              </a>
            ) : (
              article.source
            )}
          </div>
        )}
      </div>
      <div className="flex justify-between mt-2">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onShare(article);
          }}
          variant="ghost"
          size="sm"
          className="p-1"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onLike(article.id);
          }}
          variant="ghost"
          size="sm"
          className="p-1"
        >
          <Heart className={`w-4 h-4 ${article.isLiked ? 'fill-current text-red-500' : ''}`} />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation(); /* handle download */
          }}
          variant="ghost"
          size="sm"
          className="p-1"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            window.open(article.url, '_blank', 'noopener,noreferrer');
          }}
          variant="ghost"
          size="sm"
          className="p-1"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default NewsTile;

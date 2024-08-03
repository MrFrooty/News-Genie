import React from 'react';

interface NewsCardProps {
  title: string;
  description: string;
  url: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, description, url }) => {
  return (
    <div className="news-card">
      <h2>{title}</h2>
      <p>{description}</p>
      <a href={url} target="_blank" rel="noopener noreferrer">Read more</a>
    </div>
  );
};

export default NewsCard;
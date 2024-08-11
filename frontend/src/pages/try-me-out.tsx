import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Dock, DockIcon } from '@/components/dock';
import {
  Home,
  Settings,
  Send,
  Share2,
  Heart,
  Download,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { jsPDF } from 'jspdf';

import { fetchNews } from '@/services/api';

const url = (name: string, wrap = false) =>
  `${wrap ? 'url(' : ''}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ')' : ''}`;

interface Article {
  id: number;
  title: string;
  briefPreview: string;
  fullPreview: string;
  url: string;
  isLiked: boolean;
}

const ChatMessage: React.FC<{ message: string; isUser: boolean }> = ({ message, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
  >
    <div
      className={`max-w-[80%] p-2 rounded-3xl ${
        isUser ? 'bg-green-500 text-white' : 'bg-gray-800/70 text-white'
      }`}
    >
      {message}
    </div>
  </motion.div>
);

const NewsTile: React.FC<{
  article: Article;
  onClick: () => void;
  isSelected: boolean;
  onLike: (id: number) => void;
}> = ({ article, onClick, isSelected, onLike }) => {
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: article.title,
      text: article.briefPreview,
      url: article.url
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Article shared successfully');
      } catch (err) {
        console.error('Error sharing article:', err);
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      const shareWindow = window.open('', '_blank', 'width=600,height=400');
      if (shareWindow) {
        shareWindow.document.write(`
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Share Article - News Genie</title>
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
              <style>
                body {
                  font-family: 'Inter', sans-serif;
                  background-color: #1a202c;
                  color: #e2e8f0;
                  margin: 0;
                  padding: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  min-height: 100vh;
                }
                .container {
                  background-color: #2d3748;
                  border-radius: 8px;
                  padding: 24px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  max-width: 400px;
                  width: 100%;
                }
                h1 {
                  font-size: 24px;
                  font-weight: 600;
                  margin-bottom: 16px;
                  text-align: center;
                }
                .share-options {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 16px;
                }
                .share-option {
                  background-color: #4a5568;
                  border-radius: 8px;
                  padding: 12px;
                  text-align: center;
                  transition: background-color 0.3s ease;
                }
                .share-option:hover {
                  background-color: #718096;
                }
                .share-option svg {
                  width: 24px;
                  height: 24px;
                  margin-bottom: 8px;
                }
                a {
                  color: #e2e8f0;
                  text-decoration: none;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                }
                .article-info {
                  margin-top: 24px;
                  text-align: center;
                }
                .article-title {
                  font-size: 18px;
                  font-weight: 500;
                  margin-bottom: 8px;
                }
                .article-preview {
                  font-size: 14px;
                  color: #a0aec0;
                  margin-bottom: 16px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Share this article</h1>
                <div class="share-options">
                  <div class="share-option">
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.url)}" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                      Twitter
                    </a>
                  </div>
                  <div class="share-option">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                      Facebook
                    </a>
                  </div>
                  <div class="share-option">
                    <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(article.url)}&title=${encodeURIComponent(article.title)}" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                      LinkedIn
                    </a>
                  </div>
                  <div class="share-option">
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + article.url)}" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                      WhatsApp
                    </a>
                  </div>
                  <div class="share-option">
                    <a href="https://telegram.me/share/url?url=${encodeURIComponent(article.url)}&text=${encodeURIComponent(article.title)}" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.372-12 12 0 6.627 5.374 12 12 12 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm3.224 17.871c.188.133.43.166.646.085.215-.082.374-.258.428-.477.24-1.555.76-4.9.779-5.027.017-.117-.059-.219-.173-.247s-.245.027-.302.125l-1.057 1.8c-.848 1.468-1.595 2.77-2.333 4.055-.143.245-.333.498-.596.607-.262.11-.556.086-.795-.058-1.189-.721-2.379-1.442-3.568-2.163-.286-.172-.311-.571-.047-.784l.967-.759.561-.441c.613-.483 1.227-.966 1.836-1.455.242-.195.373-.465.371-.751-.002-.285-.136-.553-.38-.747-1.307-1.042-2.617-2.081-3.925-3.121-.227-.18-.526-.241-.807-.157-.28.084-.507.29-.606.564l-.837 2.033c-.669 1.624-1.338 3.249-2.007 4.873-.107.261-.033.557.186.751.219.194.523.242.784.124.813-.366 1.626-.733 2.439-1.1l.847-.382c.364-.164.728-.328 1.092-.492.442-.198.893-.393 1.34-.59l3.854-1.716c.378-.167.769-.312 1.158-.46l1.456-.581c.397-.16.849-.053 1.125.266.13.149.201.339.201.534v.82c0 .33-.178.63-.465.788l-1.836 1.007c-.314.172-.617.36-.932.536-.62.346-1.241.691-1.862 1.038z"/></svg>
                      Telegram
                    </a>
                  </div>
                  <div class="share-option">
                    <a href="https://reddit.com/submit?url=${encodeURIComponent(article.url)}&title=${encodeURIComponent(article.title)}" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.799-.712-1.465 0-2.656 1.187-2.656 2.646 0 .97.533 1.811 1.317 2.271-.052.282-.086.567-.086.857 0 3.911 4.808 7.093 10.719 7.093s10.72-3.182 10.72-7.093c0-.274-.029-.544-.075-.81.832-.447 1.405-1.312 1.405-2.318zm-17.224 1.816c0-.868.71-1.575 1.582-1.575.872 0 1.581.707 1.581 1.575s-.709 1.574-1.581 1.574-1.582-.706-1.582-1.574zm9.061 4.669c-.797.793-2.048 1.179-3.824 1.179l-.013-.1.582-.706-1.582-1.574zm9.061 4.669c-.797.793-2.048 1.179-3.824 1.179l-.013-.003-.013.003c-1.777 0-3.028-.386-3.824-1.179-.145-.144-.145-.379 0-.523.145-.145.381-.145.526 0 .65.647 1.729.961 3.298.961l.013.003.013-.003c1.569 0 2.648-.315 3.298-.962.145-.145.381-.144.526 0 .145.145.145.379 0 .524zm-.189-3.095c-.872 0-1.581-.706-1.581-1.574 0-.868.709-1.575 1.581-1.575s1.581.707 1.581 1.575-.709 1.574-1.581 1.574z"/></svg>
                      Reddit
                    </a>
                  </div>
                  <div class="share-option">
                    <a href="mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(article.briefPreview + '\n\nRead more: ' + article.url)}" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"/></svg>
                      Email
                    </a>
                  </div>
                  <div class="share-option">
                    <a href="https://pinterest.com/pin/create/button/?url=${encodeURIComponent(article.url)}&media=&description=${encodeURIComponent(article.title)}" target="_blank" rel="noopener noreferrer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
                      Pinterest
                    </a>
                  </div>
                </div>
                <div class="article-info">
                  <div class="article-title">${article.title}</div>
                  <div class="article-preview">${article.briefPreview}</div>
                </div>
              </div>
            </body>
          </html>
        `);
      }
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(article.id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(article.title, 20, 20);
    doc.setFontSize(12);
    doc.text(article.fullPreview, 20, 30, { maxWidth: 170 });
    doc.text(`Source: ${article.url}`, 20, doc.internal.pageSize.height - 20);
    doc.save(`${article.title.slice(0, 20)}.pdf`);
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
      className={`bg-gray-800/50 p-4 rounded-lg cursor-pointer flex-shrink-0 w-80 h-48 flex flex-col justify-between m-2 ${
        isSelected ? 'ring-2 ring-green-500' : ''
      }`}
      style={{ boxShadow: isSelected ? '0 0 0 2px rgb(34 197 94)' : 'none' }}
      onClick={onClick}
    >
      <h3 className="font-bold text-sm mb-2 line-clamp-2">{article.title}</h3>
      <p className="text-xs line-clamp-3">{article.briefPreview}</p>
      <div className="flex justify-between mt-2">
        <Button onClick={handleShare} variant="ghost" size="sm" className="p-1">
          <Share2 className="w-4 h-4" />
        </Button>
        <Button onClick={handleLike} variant="ghost" size="sm" className="p-1">
          <Heart className={`w-4 h-4 ${article.isLiked ? 'fill-current text-red-500' : ''}`} />
        </Button>
        <Button onClick={handleDownload} variant="ghost" size="sm" className="p-1">
          <Download className="w-4 h-4" />
        </Button>
        <Button onClick={handleVisitArticle} variant="ghost" size="sm" className="p-1">
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

const TryMeOut: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI news assistant. What kind of news are you interested in today?",
      isUser: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [newsRecommendations, setNewsRecommendations] = useState<Article[]>([]);
  const [expandedArticle, setExpandedArticle] = useState<Article | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const newsRecommendationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage('');

      try {
        console.log('Fetching news for:', inputMessage);
        const response = await fetchNews(inputMessage);
        console.log('API response:', response);
        
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: 'Based on your interest, here are some news recommendations:',
            isUser: false
          }
        ]);

        if (response && response.news_summaries) {
          const parsedRecommendations = parseNewsRecommendations(response.news_summaries);
          setNewsRecommendations(parsedRecommendations);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        let errorMessage = 'Sorry, I encountered an error while fetching news. ';
        if (error instanceof Error) {
          errorMessage += `Error details: ${error.message}`;
        } else {
          errorMessage += 'Please try again later.';
        }
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: errorMessage,
            isUser: false
          }
        ]);
      }
    }
  };

  const parseNewsRecommendations = (aiResponse: string): Article[] => {
    const articles: Article[] = [];
    
    const newsItems = aiResponse.split('\n\n');
    
    newsItems.forEach((item, index) => {
      const lines = item.split('\n');
      if (lines.length >= 3) {
        articles.push({
          id: index + 1, title: lines[0].replace(/^\d+\.\s*/, ''),
          briefPreview: lines[1],
          fullPreview: lines.slice(1, -1).join(' '),
          url: lines[lines.length - 1].replace(/^Source:\s*/, ''),
          isLiked: false
        });
      }
    });

    return articles;
  };

  const handleTileClick = (article: Article) => {
    setExpandedArticle(expandedArticle?.id === article.id ? null : article);
    setTimeout(() => {
      if (newsRecommendationsRef.current) {
        const yOffset = -100;
        const y =
          newsRecommendationsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLike = (articleId: number) => {
    setNewsRecommendations((prevRecommendations) =>
      prevRecommendations.map((article) =>
        article.id === articleId ? { ...article, isLiked: !article.isLiked } : article
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#253237] text-white overflow-hidden relative flex flex-col">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: url('stars', true),
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}
      />

<header className="relative z-10 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-end items-center">
          <nav>
            <Dock className="bg-white/5 backdrop-blur-sm border-gray-700/30 p-2 rounded-full flex space-x-4">
              <DockIcon className="w-8 h-8 flex items-center justify-center">
                <Link href="/">
                  <Home className="text-white h-4 w-4" />
                </Link>
              </DockIcon>
              <DockIcon className="w-8 h-8 flex items-center justify-center">
                <Link href="/settings">
                  <Settings className="text-white h-4 w-4" />
                </Link>
              </DockIcon>
            </Dock>
          </nav>
        </div>
      </header>

      <div className="relative z-10 flex-grow flex flex-col px-8 md:px-16 lg:px-24 xl:px-32 overflow-y-auto mt-12 mb-12">
        <div className="text-center mb-12">
          <TypeAnimation
            sequence={['News Genie Chat', 1000]}
            wrapper="h2"
            cursor={false}
            repeat={0}
            className="text-3xl font-bold"
          />
        </div>

        <div className="flex-grow mb-8 pr-4" ref={chatContainerRef}>
          <AnimatePresence>
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {newsRecommendations.length > 0 && (
          <div className="mb-8 bg-gray-800/30 p-6 rounded-lg" ref={newsRecommendationsRef}>
            <h3 className="text-lg font-bold mb-4">News Recommendations</h3>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-2">
              <AnimatePresence>
                {newsRecommendations.map((article) => (
                  <NewsTile
                    key={article.id}
                    article={article}
                    onClick={() => handleTileClick(article)}
                    isSelected={expandedArticle?.id === article.id}
                    onLike={handleLike}
                  />
                ))}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {expandedArticle && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 bg-gray-700/50 p-6 rounded-lg"
                >
                  <h3 className="font-bold text-lg mb-4">{expandedArticle.title}</h3>
                  <p className="text-sm mb-4">{expandedArticle.fullPreview}</p>
                  <a
                    href={expandedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Read full article
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

<div className="flex items-center space-x-4 mb-8">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow bg-gray-800/30 border-gray-700 rounded-full text-white placeholder-gray-400 px-6 py-4"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-4"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TryMeOut;
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Dock, DockIcon } from '@/components/dock';
import { Home, Settings, Send } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import TypingAnimation from '@/components/typing-animation';
import { fetchNews } from '@/services/api';
import NewsTile, { Article } from '@/components/news-tile';
import ShareModal from '@/components/share-modal';

const url = (name: string, wrap = false) =>
  `${wrap ? 'url(' : ''}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ')' : ''}`;

const LoadingAnimation = dynamic(() => import('@/components/loading-animation'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

const ChatMessage: React.FC<{
  message: string;
  isUser: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}> = ({ message, isUser, isLoading, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    onClick={onClick}
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2 ${isUser ? 'cursor-pointer' : ''}`}
  >
    {isLoading ? (
      <LoadingAnimation />
    ) : (
      <div
        className={`max-w-[80%] p-4 rounded-3xl ${
          isUser ? 'bg-green-500 text-white' : 'bg-gray-800/70 text-white'
        }`}
      >
        {message}
      </div>
    )}
  </motion.div>
);

const TryMeOut: React.FC = () => {
  const [messages, setMessages] = useState<
    Array<{
      text: string;
      isUser: boolean;
      isLoading?: boolean;
      associatedNews?: Article[];
    }>
  >([]);
  const [inputMessage, setInputMessage] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<Article | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const newsRecommendationsRef = useRef<HTMLDivElement>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedArticleForShare, setSelectedArticleForShare] = useState<Article | null>(null);
  const [activeNewsState, setActiveNewsState] = useState<{
    messageIndex: number | null;
    articles: Article[];
  }>({
    messageIndex: null,
    articles: []
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      setMessages([
        {
          text: "Hello! I'm your AI news assistant. What kind of news are you interested in today?",
          isUser: false
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const parseNewsRecommendations = (aiResponse: string): Article[] => {
    const articles: Article[] = [];
    const newsItems = aiResponse.split(/\n\d+\.\s*/).filter((item) => item.trim() !== '');

    newsItems.forEach((item, index) => {
      const titleMatch = item.match(/\*\*(.*?):?\*\*/);
      const title = titleMatch ? titleMatch[1].trim() + ':' : '';
      let content = item.replace(/^\*\*.*?\*\*:?\s*/, '').trim();

      const sourceMatch = content.match(/\(Source:\s*\[(.*?)\]\((.*?)\)\)$/);
      let source = '';
      let url = '';
      if (sourceMatch) {
        source = sourceMatch[1];
        url = sourceMatch[2];
        content = content.replace(/\s*\(Source:.*?\)$/, '').trim();
      }

      articles.push({
        id: index + 1,
        title: title,
        briefPreview: content.length > 150 ? content.substring(0, 150) + '...' : content,
        fullPreview: content,
        url: url,
        source: source,
        isLiked: false
      });
    });

    return articles;
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newUserMessage = {
        text: inputMessage,
        isUser: true
      };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setInputMessage('');
      setExpandedArticle(null);
      setActiveNewsState({ messageIndex: null, articles: [] });

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: '', isUser: false, isLoading: true }
      ]);

      try {
        console.log('Fetching news for:', inputMessage);
        const response = await fetchNews(inputMessage);
        console.log('API response:', response);

        if (response && response.news_summaries) {
          const parsedRecommendations = parseNewsRecommendations(response.news_summaries);

          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            const aiResponseIndex = newMessages.length - 1;
            newMessages[aiResponseIndex] = {
              text: 'Based on your interest, here are some news recommendations:',
              isUser: false,
              isLoading: false,
              associatedNews: parsedRecommendations
            };
            return newMessages;
          });

          setActiveNewsState({
            messageIndex: messages.length + 1,
            articles: parsedRecommendations
          });
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
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = {
            text: errorMessage,
            isUser: false,
            isLoading: false
          };
          return newMessages;
        });
      }
    }
  };

  const handleMessageClick = (index: number) => {
    const clickedMessage = messages[index];
    if (clickedMessage.isUser) {
      const nextMessage = messages[index + 1];
      if (nextMessage && nextMessage.associatedNews) {
        setActiveNewsState((prevState) => {
          if (prevState.messageIndex === index + 1) {
            return { messageIndex: null, articles: [] };
          } else {
            return {
              messageIndex: index + 1,
              articles: nextMessage.associatedNews || []
            };
          }
        });
        setExpandedArticle(null);
      }
    }
  };

  const handleTileClick = (article: Article) => {
    setExpandedArticle(expandedArticle?.id === article.id ? null : article);
  };

  const handleLike = (articleId: number) => {
    setActiveNewsState((prevState) => ({
      ...prevState,
      articles: prevState.articles.map((article) =>
        article.id === articleId ? { ...article, isLiked: !article.isLiked } : article
      )
    }));
  };

  const handleShare = (article: Article) => {
    setSelectedArticleForShare(article);
    setIsShareModalOpen(true);
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

      <div className="relative z-10 flex-grow flex flex-col px-4 md:px-8 lg:px-16 xl:px-32 overflow-y-auto mt-8 mb-6">
        <div className="text-center mb-8">
          <TypingAnimation text="News Genie Chat" duration={100} className="text-3xl font-bold" />
        </div>

        <div className="flex-grow mb-4 pr-2" ref={chatContainerRef}>
          <AnimatePresence>
            {isInitialLoading ? (
              <ChatMessage message="" isUser={false} isLoading={true} />
            ) : (
              messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.text}
                  isUser={msg.isUser}
                  isLoading={msg.isLoading}
                  onClick={msg.isUser ? () => handleMessageClick(index) : undefined}
                />
              ))
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {activeNewsState.messageIndex !== null && activeNewsState.articles.length > 0 && (
          <div className="mb-4 bg-gray-800/30 p-4 rounded-3xl" ref={newsRecommendationsRef}>
            <h3 className="text-lg font-bold mb-4">News Recommendations</h3>
            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2">
              <AnimatePresence>
                {activeNewsState.articles.map((article, index) => (
                  <NewsTile
                    key={article.id}
                    article={article}
                    articleNumber={index + 1}
                    onClick={() => handleTileClick(article)}
                    isSelected={expandedArticle?.id === article.id}
                    onLike={handleLike}
                    onShare={handleShare}
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
                  className="mt-4 bg-gray-700/50 p-4 rounded-3xl"
                >
                  <h3 className="font-bold text-lg mb-2">{expandedArticle.title}</h3>
                  <p className="text-sm mb-2">{expandedArticle.fullPreview}</p>
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

        <div className="flex items-center space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow bg-gray-800/30 border-gray-700 rounded-full text-white placeholder-gray-400"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        article={selectedArticleForShare}
      />
    </div>
  );
};

export default TryMeOut;

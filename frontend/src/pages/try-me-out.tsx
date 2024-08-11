import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Dock, DockIcon } from '@/components/dock';
import {
  Telescope,
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
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div
      className={`max-w-[80%] p-4 rounded-3xl ${
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
      const shareOptions = [
        {
          name: 'Twitter',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>',
          url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.url)}`
        },
        {
          name: 'Facebook',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>',
          url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`
        },
        {
          name: 'LinkedIn',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>',
          url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(article.url)}&title=${encodeURIComponent(article.title)}`
        },
        {
          name: 'Email',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
          url: `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(article.url)}`
        },
        {
          name: 'WhatsApp',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>',
          url: `https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + article.url)}`
        },
        {
          name: 'Reddit',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.799-.712-1.465 0-2.656 1.187-2.656 2.646 0 .97.533 1.811 1.317 2.271-.052.282-.086.567-.086.857 0 3.911 4.808 7.093 10.719 7.093s10.72-3.182 10.72-7.093c0-.274-.029-.544-.075-.81.832-.447 1.405-1.312 1.405-2.318zm-17.224 1.816c0-.868.71-1.575 1.582-1.575.872 0 1.581.707 1.581 1.575s-.709 1.574-1.581 1.574-1.582-.706-1.582-1.574zm9.061 4.669c-.797.793-2.048 1.179-3.824 1.179l-.013-.003-.013.003c-1.777 0-3.028-.386-3.824-1.179-.145-.144-.145-.379 0-.523.145-.145.381-.145.526 0 .65.647 1.729.961 3.298.961l.013.003.013-.003c1.569 0 2.648-.315 3.298-.962.145-.145.381-.144.526 0 .145.145.145.379 0 .524zm-.189-3.095c-.872 0-1.581-.706-1.581-1.574 0-.868.709-1.575 1.581-1.575s1.581.707 1.581 1.575-.709 1.574-1.581 1.574z"/></svg>',
          url: `https://reddit.com/submit?url=${encodeURIComponent(article.url)}&title=${encodeURIComponent(article.title)}`
        },
        {
          name: 'Pinterest',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" fill-rule="evenodd" clip-rule="evenodd"/></svg>',
          url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(article.url)}&media=&description=${encodeURIComponent(article.title)}`
        },
        {
          name: 'Telegram',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.415 11.196l5.869 2.925c.227.112.495.104.712-.023l5.224-3.037-3.162 2.802c-.161.143-.253.347-.253.562v6.825c0 .72.919 1.023 1.35.451l2.537-3.373 6.274 3.573c.44.253 1.004-.001 1.106-.504l3.913-19.5c.117-.586-.466-1.064-1.008-.846l-22.5 8.775c-.604.236-.643 1.081-.062 1.37zm21.83-8.249l-3.439 17.137-5.945-3.386c-.324-.185-.741-.103-.971.201l-1.585 2.107v-4.244l8.551-7.576c.677-.599-.101-1.664-.874-1.21l-11.39 6.622-3.992-1.989 19.645-7.662z"/></svg>',
          url: `https://t.me/share/url?url=${encodeURIComponent(article.url)}&text=${encodeURIComponent(article.title)}`
        },
        {
          name: 'Tumblr',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.512 17.489l-.096-.068h-3.274c-.153 0-.16-.467-.163-.622v-5.714c0-.056.045-.101.101-.101h3.82c.056 0 .101-.045.101-.101v-3.148c0-.056-.045-.101-.101-.101h-3.803c-.056 0-.101-.045-.101-.101v-4.01c0-.056-.045-.101-.101-.101h-3.21c-.056 0-.101.045-.101.101 0 .046-.012.922-.023 1.841-.007.515-.014 1.037-.021 1.554-.007.213-.015.424-.023.627-.127 2.15-1.238 3.22-3.002 3.974-.078.033-.155.065-.233.096h-1.004c-.056 0-.101.045-.101.101v3.037c0 .056.045.101.101.101h1.003c.019 0 .037-.005.052-.014.958-.425 1.79-.601 2.426-.601.474 0 .89.104 1.239.312.332.197.602.48.795.878.181.376.274.827.274 1.342v6.18c0 .056.045.101.101.101h3.803c.056 0 .101-.045.101-.101v-6.18c0-.718.233-1.312.701-1.774.461-.455 1.067-.686 1.807-.686.721 0 1.351.26 1.875.783.52.52.786 1.145.786 1.87v5.887c0 .056.045.101.101.101h3.803c.056 0 .101-.045.101-.101v-6.805c0-1.417-.49-2.615-1.461-3.574-.952-.94-2.12-1.417-3.474-1.417-1.276 0-2.407.409-3.35 1.215-.761.652-1.314 1.49-1.619 2.494v-2.422c0-.056-.045-.101-.101-.101h-3.21c-.056 0-.101.045-.101.101v3.037c0 .056.045.101.101.101h1.004c.019 0 .037-.005.052-.014.958-.425 1.79-.601 2.426-.601.474 0 .89.104 1.239.312.332.197.602.48.795.878.181.376.274.827.274 1.342v6.18c0 .056.045.101.101.101h3.803c.056 0 .101-.045.101-.101v-6.18c0-.718.233-1.312.701-1.774.461-.455 1.067-.686 1.807-.686.721 0 1.351.26 1.875.783.52.52.786 1.145.786 1.87v5.887c0 .056.045.101.101.101h3.803c.056 0 .101-.045.101-.101v-6.805c0-1.417-.49-2.615-1.461-3.574-.952-.94-2.12-1.417-3.474-1.417-1.276 0-2.407.409-3.35 1.215-.761.652-1.314 1.49-1.619 2.494v-2.422c0-.056-.045-.101-.101-.101h-3.21c-.056 0-.101.045-.101.101v3.037c0 .056.045.101.101.101h1.004c.019 0 .037-.005.052-.014.958-.425 1.79-.601 2.426-.601.474 0 .89.104 1.239.312.332.197.602.48.795.878.181.376.274.827.274 1.342v6.18c0 .056.045.101.101.101h3.803c.056 0 .101-.045.101-.101v-6.18c0-.718.233-1.312.701-1.774.461-.455 1.067-.686 1.807-.686.721 0 1.351.26 1.875.783.52.52.786 1.145.786 1.87v5.887c0 .056.045.101.101.101h3.803c.056 0 .101-.045.101-.101v-6.805c0-1.417-.49-2.615-1.461-3.574-.952-.94-2.12-1.417-3.474-1.417z"/></svg>',
          url: `https://www.tumblr.com/widgets/share/tool?posttype=link&title=${encodeURIComponent(article.title)}&caption=${encodeURIComponent(article.briefPreview)}&content=${encodeURIComponent(article.url)}&canonicalUrl=${encodeURIComponent(article.url)}&shareSource=tumblr_share_button`
        }
      ];

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
              ${shareOptions
                .map(
                  (option) => `
                <div class="share-option">
                  <a href="${option.url}" target="_blank" rel="noopener noreferrer">
                    ${option.icon}
                    ${option.name}
                  </a>
                </div>
              `
                )
                .join('')}
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

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage('');
      // Simulate AI response and news recommendations
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: 'Based on your interest, here are some news recommendations:',
            isUser: false
          }
        ]);
        setNewsRecommendations([
          {
            id: 1,
            title: "Harris Shielding Trump's Federal Jan. 6 Case",
            briefPreview:
              'Kamala Harris defends legal actions against Trump related to January 6th.',
            fullPreview:
              'Vice President Kamala Harris is defending the legal actions taken against former President Donald Trump in relation to the January 6th Capitol riot. This comes amidst ongoing investigations and legal proceedings surrounding the events of that day.',
            url: 'https://www.nbcnews.com/politics/2024-election/harris-shutting-lock-chants-shields-trumps-federal-jan-6-case-even-del-rcna165837',
            isLiked: false
          },
          {
            id: 2,
            title: "Trump's Plane Landed Safely in Montana",
            briefPreview: "Trump's plane made a safe landing in Montana after a mechanical issue.",
            fullPreview:
              "Former President Donald Trump's plane successfully landed in Montana after experiencing a mechanical issue mid-flight. The Secret Service confirmed that all passengers, including Trump, are safe and unharmed.",
            url: 'https://www.nbcnews.com/politics/2024-election/trumps-plane-landed-safely-montana-mechanical-issue-secret-service-say-rcna166053',
            isLiked: false
          },
          {
            id: 3,
            title: 'Harris Talks Immigration in Arizona',
            briefPreview: 'Harris discussed immigration plans at a rally in Arizona.',
            fullPreview:
              'Vice President Kamala Harris addressed immigration reform plans during a packed rally in the battleground state of Arizona. The discussion focused on proposed policies and their potential impact on border security and immigration processes.',
            url: 'https://www.nbcnews.com/politics/immigration/harris-talks-immigration-plans-packed-rally-battleground-arizona-rcna165949',
            isLiked: false
          },
          {
            id: 4,
            title: 'Tim Walz Misspoke About Weapons of War',
            briefPreview:
              "Minnesota Governor Tim Walz misspoke about 'weapons of war' during his campaign.",
            fullPreview:
              "Minnesota Governor Tim Walz's campaign has clarified that he misspoke when discussing the use of 'weapons of war' during a recent event. The statement aims to address any confusion or misinterpretation of the governor's stance on the issue.",
            url: 'https://www.nbcnews.com/politics/2024-election/tim-walz-misspoke-discussed-using-weapons-war-campaign-says-rcna166038',
            isLiked: false
          }
        ]);
      }, 1000);
    }
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
      {/* Starry Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: url('stars', true),
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Header */}
      <header className="relative z-10 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-end items-center">
          <nav>
            <Dock className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-full flex space-x-2">
              <DockIcon className="w-10 h-10 flex items-center justify-center">
                <Link href="/">
                  <Home className="text-white h-5 w-5" />
                </Link>
              </DockIcon>
              <DockIcon className="w-10 h-10 flex items-center justify-center">
                <Telescope className="text-white h-5 w-5" />
              </DockIcon>
              <DockIcon className="w-10 h-10 flex items-center justify-center">
                <Link href="/settings">
                  <Settings className="text-white h-5 w-5" />
                </Link>
              </DockIcon>
            </Dock>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-grow flex flex-col px-4 md:px-8 lg:px-16 xl:px-32 overflow-y-auto mt-8 mb-6">
        {/* Title with Typing Animation */}
        <div className="text-center mb-8">
          <TypeAnimation
            sequence={['News Genie Chat', 1000]}
            wrapper="h2"
            cursor={false}
            repeat={0}
            className="text-3xl font-bold"
          />
        </div>

        {/* Chat Area */}
        <div className="flex-grow mb-4 pr-2" ref={chatContainerRef}>
          <AnimatePresence>
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* News Recommendations */}
        {newsRecommendations.length > 0 && (
          <div className="mb-4 bg-gray-800/30 p-4 rounded-lg" ref={newsRecommendationsRef}>
            <h3 className="text-lg font-bold mb-4">News Recommendations</h3>
            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2">
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
                  className="mt-4 bg-gray-700/50 p-4 rounded-lg"
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

        {/* Input Area */}
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
    </div>
  );
};

export default TryMeOut;

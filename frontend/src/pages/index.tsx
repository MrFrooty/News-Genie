// pages/index.tsx
import React, { useRef, useState } from 'react';
import { Parallax, ParallaxLayer, IParallax } from '@react-spring/parallax';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/avatar';
import ShimmerButton from '@/components/shimmer-button';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, X, Check, Telescope, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Dock, DockIcon } from '@/components/dock';
import { Alert, AlertTitle, AlertDescription } from '@/components/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card';

const url = (name: string, wrap = false) =>
  `${wrap ? 'url(' : ''}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ')' : ''}`;

interface Engineer {
  name: string;
  role: string;
  image: string;
  linkedIn: string;
  blurb: string;
}

const engineers: Engineer[] = [
  {
    name: 'Freddy Song',
    role: 'Lead Full-Stack Engineer',
    image: '/freddy-song.jpg',
    linkedIn: 'https://www.linkedin.com/in/freddy-song-428677212/',
    blurb: 'UCR 3rd Year.\nPersonal Interests: AI/ML, cafe hopping, DJing'
  },
  {
    name: 'Michael Chen',
    role: 'Frontend Engineer',
    image: '/michael-chen.jpg',
    linkedIn: 'https://www.linkedin.com/in/michael-luo-chen/',
    blurb: 'UCR 3rd Year.\nPersonal Interests: AI/ML, gaming, reading novels'
  }
];

const LoginStatusCard = ({
  isLoggedIn,
  setIsLoggedIn
}: {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}) => {
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: '',
    variant: 'default' as 'default' | 'destructive'
  });
  const router = useRouter();

  const handleClick = () => {
    if (isLoggedIn) {
      router.push('/settings');
    } else {
      setAlertInfo({
        show: true,
        message: 'You need to be logged in to access the settings page.',
        variant: 'destructive'
      });
      setTimeout(() => setAlertInfo({ show: false, message: '', variant: 'default' }), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (response.ok) {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
        router.push('/');
        setAlertInfo({
          show: true,
          message: 'Successfully logged out.',
          variant: 'default'
        });
        setTimeout(() => setAlertInfo({ show: false, message: '', variant: 'default' }), 3000);
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setAlertInfo({
        show: true,
        message: 'Failed to logout. Please try again.',
        variant: 'destructive'
      });
      setTimeout(() => setAlertInfo({ show: false, message: '', variant: 'default' }), 3000);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        onClick={handleClick}
      >
        <Card className="absolute top-4 right-4 bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer">
          <CardContent className="p-2 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/default-avatar.png" alt="User Avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              {isLoggedIn && <Check className="text-green-500 h-4 w-4" />}
            </div>
            {isLoggedIn && (
              <LogOut
                className="text-white h-4 w-4 cursor-pointer ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
              />
            )}
            {!isLoggedIn && <X className="text-red-500 h-4 w-4" />}
          </CardContent>
        </Card>
      </motion.div>
      <AnimatePresence>
        {alertInfo.show && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 w-auto z-50"
            style={{ transform: 'translateX(100%)' }}
          >
            <Alert variant={alertInfo.variant}>
              <AlertTitle>
                {alertInfo.variant === 'destructive' ? 'Action Required' : 'Success'}
              </AlertTitle>
              <AlertDescription>{alertInfo.message}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const LandingPage: React.FC = () => {
  const parallax = useRef<IParallax>(null!);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const renderEngineerCard = (engineer: Engineer) => (
    <Card key={engineer.name} className="bg-white text-black min-w-[240px]">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Link
            href={engineer.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <Avatar className="h-12 w-12 transition-transform group-hover:scale-105">
              <AvatarImage src={engineer.image} alt={engineer.name} />
              <AvatarFallback>
                {engineer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Linkedin className="h-6 w-6 text-white" />
            </div>
          </Link>
          <div className="flex-grow">
            <CardTitle className="text-lg">{engineer.name}</CardTitle>
            <CardDescription>{engineer.role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap break-words">{engineer.blurb}</p>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ width: '100%', height: '100vh', background: '#253237' }}>
      <Parallax ref={parallax} pages={3}>
        <ParallaxLayer offset={1} speed={1} style={{ backgroundColor: '#5f96d9' }} />
        <ParallaxLayer offset={2} speed={1} style={{ backgroundColor: '#779cc9' }} />

        <ParallaxLayer
          offset={0}
          speed={0}
          factor={3}
          style={{
            backgroundImage: url('stars', true),
            backgroundSize: 'cover'
          }}
        />

        <ParallaxLayer offset={1.3} speed={-0.3} style={{ pointerEvents: 'none' }}>
          <Image
            src={url('satellite4')}
            width={50}
            height={50}
            layout="reponsive"
            style={{ width: '15%', marginLeft: '70%' }}
            alt="Satellite"
          />
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.8} style={{ opacity: 0.1 }}>
          <Image
            src={url('cloud')}
            width={100}
            height={100}
            layout="reponsive"
            style={{ display: 'block', width: '20%', marginLeft: '55%' }}
            alt="Cloud"
          />
          <Image
            src={url('cloud')}
            width={100}
            height={100}
            layout="reponsive"
            style={{ display: 'block', width: '10%', marginLeft: '15%' }}
            alt="Cloud"
          />
        </ParallaxLayer>

        <ParallaxLayer offset={1.75} speed={0.5} style={{ opacity: 0.1 }}>
          <Image
            src={url('cloud')}
            width={100}
            height={100}
            layout="reponsive"
            style={{ display: 'block', width: '20%', marginLeft: '70%' }}
            alt="Cloud"
          />
          <Image
            src={url('cloud')}
            width={100}
            height={100}
            layout="responsive"
            style={{ display: 'block', width: '20%', marginLeft: '40%' }}
            alt="Cloud"
          />
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.2} style={{ opacity: 0.2 }}>
          <Image
            src={url('cloud')}
            width={100}
            height={100}
            layout="responsive"
            style={{ display: 'block', width: '10%', marginLeft: '10%' }}
            alt="Cloud"
          />
          <Image
            src={url('cloud')}
            width={100}
            height={100}
            layout="responsive"
            style={{ display: 'block', width: '20%', marginLeft: '75%' }}
            alt="Cloud"
          />
        </ParallaxLayer>

        <ParallaxLayer
          offset={0}
          speed={0.1}
          // onClick={() => parallax.current.scrollTo(2)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1 }}
            style={{ textAlign: 'center' }}
          >
            <h1
              style={{ fontSize: '4rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}
            >
              News Genie
            </h1>
            <Dock className="bg-white/5 backdrop-blur-sm border-gray-700/30 absolute left-1/2 transform -translate-x-1/2 p-2 rounded-full flex space-x-4">
              <DockIcon className="w-10 h-10 flex items-center justify-center" />
              <DockIcon className="w-10 h-10 flex items-center justify-center">
                <Telescope
                  onClick={() => parallax.current.scrollTo(2)}
                  className="text-white h-8 w-8"
                />
              </DockIcon>
              <DockIcon className="w-10 h-10 flex items-center justify-center">
                <Link href="/login">
                  <LogIn className="text-white h-8 w-8" />
                </Link>
              </DockIcon>
              <DockIcon className="w-10 h-10 flex items-center justify-center" />
            </Dock>
          </motion.div>
          {/* need to add for login check state for the status card */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ position: 'absolute', top: '1rem', right: '1rem' }}
          >
            <LoginStatusCard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={1}
          speed={0.1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ maxWidth: '50%', textAlign: 'center', color: 'white' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'semibold', marginBottom: '1rem' }}>
              About News Genie
            </h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
              News Genie is a personalized news aggregator that uses AI to curate articles based on
              your interests and preferences. Stay informed with tailored news recommendations and
              real-time analysis.
            </p>
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          speed={-0}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5
          }}
        >
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 'semibold',
              marginBottom: '2rem',
              color: 'white'
            }}
          >
            Meet the brains of News Genie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
            {engineers.map((engineer) => renderEngineerCard(engineer))}
          </div>
          <div style={{ position: 'relative', zIndex: 10, marginTop: '2rem' }}>
            <Link href="/try-me-out">
              <ShimmerButton className="px-6 py-3 text-lg font-semibold text-black">
                Take Me to the Project
              </ShimmerButton>
            </Link>
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};

export default LandingPage;

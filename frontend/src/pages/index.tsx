// pages/index.tsx
import React, { useRef } from 'react';
import { Parallax, ParallaxLayer, IParallax } from '@react-spring/parallax';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/avatar';
import ShimmerButton from '@/components/shimmer-button';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
    role: 'Lead Full-Stack Dev',
    image: '/freddy-song.jpg',
    linkedIn: 'https://www.linkedin.com/in/freddy-song-428677212/',
    blurb: 'UCR 2nd Year.\nPersonal Interests: AI/ML, cafe hopping, DJing'
  },
  {
    name: 'Michael Chen',
    role: 'Backend Dev',
    image: '/michael-chen.jpg',
    linkedIn: 'https://www.linkedin.com/in/michael-luo-chen/',
    blurb: 'UCR 2nd Year.\nPersonal Interests: AI/ML, gaming, reading novels'
  }
];

const LandingPage: React.FC = () => {
  const parallax = useRef<IParallax>(null!);

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
          onClick={() => parallax.current.scrollTo(2)}
          style={{
            display: 'flex',
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
            {/* <Image src={url('server')} width={20} height={20} layout="responsive" style={{ width: '10%', margin: 'auto'}} alt="Server" /> */}
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
            Contributors
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

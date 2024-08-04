// pages/index.tsx
import React, { useRef } from 'react';
import { Parallax, ParallaxLayer, IParallax } from '@react-spring/parallax';
import { motion } from 'framer-motion';
import { BentoGrid, BentoGridItem } from '@/components/bento-grid';
import Link from 'next/link';

const url = (name: string, wrap = false) =>
  `${wrap ? 'url(' : ''}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ')' : ''}`;

const LandingPage: React.FC = () => {
  const parallax = useRef<IParallax>(null!);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#253237' }}>
      <Parallax ref={parallax} pages={3}>
        <ParallaxLayer offset={1} speed={1} style={{ backgroundColor: '#805E73' }} />
        <ParallaxLayer offset={2} speed={1} style={{ backgroundColor: '#87BCDE' }} />

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
          <img
            src={url('satellite4')}
            style={{ width: '15%', marginLeft: '70%' }}
            alt="Satellite"
          />
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.8} style={{ opacity: 0.1 }}>
          <img
            src={url('cloud')}
            style={{ display: 'block', width: '20%', marginLeft: '55%' }}
            alt="Cloud"
          />
          <img
            src={url('cloud')}
            style={{ display: 'block', width: '10%', marginLeft: '15%' }}
            alt="Cloud"
          />
        </ParallaxLayer>

        <ParallaxLayer offset={1.75} speed={0.5} style={{ opacity: 0.1 }}>
          <img
            src={url('cloud')}
            style={{ display: 'block', width: '20%', marginLeft: '70%' }}
            alt="Cloud"
          />
          <img
            src={url('cloud')}
            style={{ display: 'block', width: '20%', marginLeft: '40%' }}
            alt="Cloud"
          />
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.2} style={{ opacity: 0.2 }}>
          <img
            src={url('cloud')}
            style={{ display: 'block', width: '10%', marginLeft: '10%' }}
            alt="Cloud"
          />
          <img
            src={url('cloud')}
            style={{ display: 'block', width: '20%', marginLeft: '75%' }}
            alt="Cloud"
          />
        </ParallaxLayer>

        <ParallaxLayer
          offset={0}
          speed={0.1}
          onClick={() => parallax.current.scrollTo(1)}
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
            <img src={url('server')} style={{ width: '20%', margin: 'auto' }} alt="Server" />
          </motion.div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={1}
          speed={0.1}
          onClick={() => parallax.current.scrollTo(2)}
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
            <img src={url('bash')} style={{ width: '40%', margin: 'auto' }} alt="Bash" />
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          speed={-0}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => parallax.current.scrollTo(0)}
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
          <BentoGrid className="max-w-4xl mb-8">
            <BentoGridItem title="John Doe" description="Frontend Developer" />
            <BentoGridItem title="Jane Smith" description="Backend Developer" />
            <BentoGridItem title="Alex Johnson" description="UI/UX Designer" />
          </BentoGrid>
          <Link href="/try-me-out">
            <button
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4299e1',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease'
              }}
            >
              Take Me to the Project
            </button>
          </Link>
          <img
            src={url('clients-main')}
            style={{ width: '40%', marginTop: '2rem' }}
            alt="Clients"
          />
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};

export default LandingPage;

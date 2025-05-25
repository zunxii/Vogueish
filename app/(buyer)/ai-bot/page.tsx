'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function HomeTrialComingSoon() {
  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden py-24 px-6 md:px-20 flex items-center justify-center">
      {/* Background Accent */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/trial-bg.jpg" // Elegant lifestyle background
          alt="Background"
          fill
          className="object-cover object-center opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/85" />
      </div>

      {/* Foreground Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-2xl text-center space-y-8"
      >
        <h1 className={`text-5xl md:text-6xl font-semibold text-black ${cormorant.className}`}>
          The AI-Chat bot will be here soon
        </h1>
        <p className={`text-lg md:text-xl text-black/80 ${cormorant.className}`}>
          Luxury meets comfort. We&apos;re curating the perfect trial experience for your home.
        </p>
        <p className={`text-base text-black/60 ${cormorant.className}`}>
          This exclusive service will be available soon.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => console.log('Join waitlist')}
          className="border border-black text-black py-3 px-10 rounded-full uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-md"
        >
          Check out the Collection
        </motion.button>
      </motion.div>
    </section>
  );
}

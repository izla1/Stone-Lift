import Hero from '@/components/Hero';
import Story from '@/components/Story';
import WhoWeAre from '@/components/WhoWeAre';
import WhyDifferent from '@/components/WhyDifferent';
import ProductsSection from '@/components/Products';
import Stats from '@/components/Stats';
import Contact from '@/components/Contact';
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => { document.title = 'Stone Lift — Elevating Every Moment'; }, []);
  return (
    <>
      <Hero />
      <Story />
      <WhoWeAre />
      <WhyDifferent />
      <ProductsSection />
      <Stats />
      <Contact />
    </>
  );
};

export default Index;

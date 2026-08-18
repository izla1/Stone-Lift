import WhoWeAre from '@/components/WhoWeAre';
import WhyDifferent from '@/components/WhyDifferent';
import { useEffect } from 'react';

const About = () => {
  useEffect(() => { document.title = 'Who We Are — Stone Lift'; window.scrollTo(0, 0); }, []);
  return <div className="pt-20"><WhoWeAre /><WhyDifferent /></div>;
};
export default About;

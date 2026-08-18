import Story from '@/components/Story';
import { useEffect } from 'react';

const StoryPage = () => {
  useEffect(() => { document.title = 'Our Story — Stone Lift'; window.scrollTo(0, 0); }, []);
  return <div className="pt-20"><Story /></div>;
};
export default StoryPage;

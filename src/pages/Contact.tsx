import Contact from '@/components/Contact';
import { useEffect } from 'react';

const ContactPage = () => {
  useEffect(() => { document.title = 'Contact — Stone Lift'; window.scrollTo(0, 0); }, []);
  return <div className="pt-20"><Contact /></div>;
};
export default ContactPage;

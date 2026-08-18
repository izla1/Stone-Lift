import { useEffect, useState } from 'react';
import ProductsSection from '@/components/Products';

const Products = () => {
  useEffect(() => { document.title = 'Products — Stone Lift'; window.scrollTo(0, 0); }, []);
  // Force a re-render via state to align with scroll-reveal observer
  const [_, set] = useState(0);
  useEffect(() => { set(1); }, []);
  return (
    <div className="pt-20">
      <ProductsSection />
    </div>
  );
};

export default Products;

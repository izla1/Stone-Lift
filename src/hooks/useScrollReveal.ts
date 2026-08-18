import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    const observeAll = () => {
      const targets = document.querySelectorAll(
        '.scroll-reveal:not(.visible), .scroll-reveal-left:not(.visible), .scroll-reveal-right:not(.visible)'
      );
      targets.forEach((t) => observer.observe(t));
    };

    // Initial pass + a short delayed pass to catch async-rendered children
    observeAll();
    const t1 = setTimeout(observeAll, 100);
    const t2 = setTimeout(observeAll, 400);

    // Watch for new nodes being added (route changes, lazy content)
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [location.pathname]);
}

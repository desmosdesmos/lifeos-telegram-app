import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Aggressive scroll reset for all possible scrolling elements
    const elementsToScroll = [
      window,
      document.documentElement,
      document.body,
      ...Array.from(document.querySelectorAll('.overflow-y-auto'))
    ];

    elementsToScroll.forEach(el => {
      try {
        el.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
      } catch (e) {}
    });

    // Delayed reset for dynamic content
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

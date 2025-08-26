"use client";
import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Performance monitoring
    const logPerformance = () => {
      if (typeof window !== 'undefined') {
        // Navigation timing
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          console.log('🚀 Performance Metrics:');
          console.log('  - DOM Content Loaded:', Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart), 'ms');
          console.log('  - Load Event:', Math.round(navigation.loadEventEnd - navigation.loadEventStart), 'ms');
          console.log('  - Total Load Time:', Math.round(navigation.loadEventEnd - navigation.fetchStart), 'ms');
        }

        // Resource timing
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter(resource => resource.duration > 1000);
        if (slowResources.length > 0) {
          console.log('🐌 Slow Resources (>1s):');
          slowResources.forEach(resource => {
            console.log(`  - ${resource.name}: ${Math.round(resource.duration)}ms`);
          });
        }

        // Core Web Vitals
        if ('web-vital' in window) {
          // This would be available if you install web-vitals package
          console.log('📊 Core Web Vitals available');
        }
      }
    };

    // Log performance after page load
    if (document.readyState === 'complete') {
      logPerformance();
    } else {
      window.addEventListener('load', logPerformance);
    }

    // Monitor route changes
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          console.log('🔄 Route Change:', entry.name, 'took', Math.round(entry.duration), 'ms');
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['navigation'] });
    } catch (e) {
      // PerformanceObserver not supported
    }

    return () => {
      window.removeEventListener('load', logPerformance);
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}

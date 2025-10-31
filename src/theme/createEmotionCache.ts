import createCache from '@emotion/cache';
import type { EmotionCache } from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

const caches = new Map<'ltr' | 'rtl', EmotionCache>();

export const getEmotionCache = (direction: 'ltr' | 'rtl'): EmotionCache => {
  const existing = caches.get(direction);
  if (existing) {
    return existing;
  }

  const cache = createCache({
    key: direction === 'rtl' ? 'muirtl' : 'mui',
    stylisPlugins: direction === 'rtl' ? [prefixer, rtlPlugin] : undefined,
  });

  cache.compat = true;
  caches.set(direction, cache);
  return cache;
};

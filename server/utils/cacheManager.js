/**
 * Bounded LRU in-memory cache with:
 * 1. Request Coalescing (Singleflight) for concurrent cache misses
 * 2. Proactive Refresh Ahead + Stale-While-Revalidate
 * 3. Per-key TTL jitter to avoid synchronized expiry spikes
 * 4. Monotonic invalidation sequence (epoch) guards so slow in-flight loads
 *    started before a mutation never overwrite newer data with stale results.
 */

const createCache = ({
  name = "default",
  maxEntries = 150,
  defaultTtlMs = 45_000,
  defaultRefreshAheadRatio = 0.75,
  defaultStaleGraceMs = 15_000,
  defaultJitterRatio = 0.1,
} = {}) => {
  const store = new Map();
  const inFlight = new Map();
  const bgInFlight = new Map();
  const keyInvalidationSeq = new Map();
  const prefixInvalidationSeq = new Map();
  let seq = 0;

  const stats = {
    name,
    hits: 0,
    misses: 0,
    coalesced: 0,
    refreshAheads: 0,
    staleServed: 0,
    errors: 0,
    evictions: 0,
    invalidations: 0,
  };

  const pruneSeqMaps = () => {
    const cap = Math.max(200, maxEntries * 4);
    while (keyInvalidationSeq.size > cap) {
      const oldest = keyInvalidationSeq.keys().next().value;
      keyInvalidationSeq.delete(oldest);
    }
  };

  const hasInvalidatedSince = (key, startSeq) => {
    if ((keyInvalidationSeq.get(key) || 0) > startSeq) return true;
    for (const [prefix, prefixSeq] of prefixInvalidationSeq.entries()) {
      if (prefixSeq > startSeq && key.startsWith(prefix)) return true;
    }
    return false;
  };

  const setEntry = (key, value, { ttlMs, refreshAheadRatio, staleGraceMs, jitterRatio }) => {
    const now = Date.now();
    const jitter =
      jitterRatio > 0 ? 1 - jitterRatio + Math.random() * jitterRatio * 2 : 1;
    const effectiveTtl = Math.max(50, Math.round(ttlMs * jitter));
    const boundedRatio = Math.min(0.95, Math.max(0.1, refreshAheadRatio));

    if (store.has(key)) {
      store.delete(key);
    } else if (store.size >= maxEntries) {
      const oldestKey = store.keys().next().value;
      if (oldestKey !== undefined) {
        store.delete(oldestKey);
        stats.evictions++;
      }
    }

    store.set(key, {
      value,
      createdAt: now,
      refreshAt: now + Math.round(effectiveTtl * boundedRatio),
      freshUntil: now + effectiveTtl,
      staleUntil: now + effectiveTtl + Math.max(0, staleGraceMs),
    });
  };

  const touchLru = (key, entry) => {
    store.delete(key);
    store.set(key, entry);
  };

  const triggerBackgroundRefresh = (key, loader, resolvedOpts) => {
    if (bgInFlight.has(key) || inFlight.has(key)) return;
    stats.refreshAheads++;
    const startSeq = seq;

    const bgPromise = Promise.resolve()
      .then(() => loader())
      .then((value) => {
        if (!hasInvalidatedSince(key, startSeq) && resolvedOpts.shouldCache(value)) {
          setEntry(key, value, resolvedOpts);
        }
        return value;
      })
      .catch(() => {
        stats.errors++;
        // Keep existing cached entry intact if background refresh transiently fails
      })
      .finally(() => {
        if (bgInFlight.get(key) === bgPromise) {
          bgInFlight.delete(key);
        }
      });

    bgInFlight.set(key, bgPromise);
  };

  const getOrLoad = async (key, loader, options = {}) => {
    const resolvedOpts = {
      ttlMs: options.ttlMs ?? defaultTtlMs,
      refreshAheadRatio: options.refreshAheadRatio ?? defaultRefreshAheadRatio,
      staleGraceMs: options.staleGraceMs ?? defaultStaleGraceMs,
      jitterRatio: options.jitterRatio ?? defaultJitterRatio,
      shouldCache: options.shouldCache ?? (() => true),
    };

    const now = Date.now();
    const cached = store.get(key);

    if (cached) {
      if (now < cached.freshUntil) {
        stats.hits++;
        touchLru(key, cached);
        if (now >= cached.refreshAt) {
          triggerBackgroundRefresh(key, loader, resolvedOpts);
        }
        return cached.value;
      }

      if (now < cached.staleUntil) {
        stats.hits++;
        stats.staleServed++;
        touchLru(key, cached);
        triggerBackgroundRefresh(key, loader, resolvedOpts);
        return cached.value;
      }

      store.delete(key);
    }

    if (inFlight.has(key)) {
      stats.coalesced++;
      return inFlight.get(key);
    }

    stats.misses++;
    const startSeq = seq;

    const promise = Promise.resolve()
      .then(() => loader())
      .then((value) => {
        if (!hasInvalidatedSince(key, startSeq) && resolvedOpts.shouldCache(value)) {
          setEntry(key, value, resolvedOpts);
        }
        return value;
      })
      .catch((err) => {
        stats.errors++;
        throw err;
      })
      .finally(() => {
        if (inFlight.get(key) === promise) {
          inFlight.delete(key);
        }
      });

    inFlight.set(key, promise);
    return promise;
  };

  const invalidate = (key) => {
    stats.invalidations++;
    seq++;
    store.delete(key);
    inFlight.delete(key);
    bgInFlight.delete(key);
    keyInvalidationSeq.delete(key);
    keyInvalidationSeq.set(key, seq);
    pruneSeqMaps();
  };

  const invalidatePrefix = (prefix) => {
    stats.invalidations++;
    seq++;
    for (const k of store.keys()) {
      if (k.startsWith(prefix)) store.delete(k);
    }
    for (const k of inFlight.keys()) {
      if (k.startsWith(prefix)) inFlight.delete(k);
    }
    for (const k of bgInFlight.keys()) {
      if (k.startsWith(prefix)) bgInFlight.delete(k);
    }
    prefixInvalidationSeq.set(prefix, seq);
  };

  const clear = () => {
    seq++;
    store.clear();
    inFlight.clear();
    bgInFlight.clear();
    keyInvalidationSeq.clear();
    prefixInvalidationSeq.clear();
  };

  const getStats = () => ({
    ...stats,
    size: store.size,
    inFlightSize: inFlight.size,
    bgInFlightSize: bgInFlight.size,
  });

  const resetStats = () => {
    stats.hits = 0;
    stats.misses = 0;
    stats.coalesced = 0;
    stats.refreshAheads = 0;
    stats.staleServed = 0;
    stats.errors = 0;
    stats.evictions = 0;
    stats.invalidations = 0;
  };

  return {
    getOrLoad,
    invalidate,
    invalidatePrefix,
    clear,
    getStats,
    resetStats,
  };
};

module.exports = { createCache };

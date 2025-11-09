import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

import "dotenv/config";

// Initialize Upstash Ratelimit, but fall back to a no-op limiter if Upstash is
// unreachable or environment variables are missing. This prevents the app
// from throwing 500s when Redis DNS/network issues occur during development.
let ratelimit;

try {
  const redis = Redis.fromEnv();
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "60 s"),
  });
} catch (err) {
  console.warn("Upstash initialization failed, falling back to noop ratelimit:", err?.message || err);
  // noop limiter: always allow requests
  ratelimit = {
    // key can be ignored for noop
    async limit(_key) {
      return { success: true, remaining: Infinity };
    },
  };
}

export default ratelimit;
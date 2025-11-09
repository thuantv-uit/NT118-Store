import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // Here we just kept it simple
    // in a real-world-app you'd like to put the userId or ipAdress as your key
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    }

    next();
  } catch (error) {
    // Log the error but don't fail the entire request pipeline.
    // Upstash/network issues should not make the whole API return 500.
    console.log("Rate limit error (allowing request):", error?.message || error);
    // allow request to proceed
    next();
  }
};

export default rateLimiter;
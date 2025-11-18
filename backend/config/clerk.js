import { createClerkClient, verifyToken } from "@clerk/clerk-sdk-node";

const secretKey = process.env.CLERK_SECRET_KEY;
const clerkClient = secretKey ? createClerkClient({ secretKey }) : null;

export async function authenticateClerkToken(token) {
  if (!token) {
    const error = new Error("Missing authentication token");
    error.status = 401;
    throw error;
  }

  if (!secretKey) {
    const error = new Error("CLERK_SECRET_KEY is not configured");
    error.status = 500;
    throw error;
  }

  try {
    const options = { secretKey };
    if (process.env.CLERK_JWT_TEMPLATE) {
      options.template = process.env.CLERK_JWT_TEMPLATE;
    }
    if (process.env.CLERK_JWT_AUDIENCE) {
      options.audience = process.env.CLERK_JWT_AUDIENCE;
    }

    const payload = await verifyToken(token, options);
    return payload.sub;
  } catch (err) {
    const error = new Error("Invalid or expired authentication token");
    error.status = 401;
    throw error;
  }
}

export { clerkClient };

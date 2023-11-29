import rateLimit from 'express-rate-limit';

export const rateLimitUsingThirdParty = rateLimit({
  windowMs: 1 * 60 * 1000, // milliseconds
  max: 3,
  message: 'You have exceeded the 3 requests in 1 minute limit!',
  standardHeaders: true,
  legacyHeaders: false,
})


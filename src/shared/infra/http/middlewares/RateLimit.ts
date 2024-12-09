import { Request, Response, NextFunction } from 'express'
import { createClient } from 'redis'
// import Redis from 'ioredis'
import AppError from '@shared/errors/AppError'
import { RateLimiterRedis } from 'rate-limiter-flexible'

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined
})

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5,
  duration: 5,
})

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
) : Promise<void> {
  try{

    console.log("Ip client =>", request.ip)

    await limiter.consume(request.ip)

    return next();

  } catch(err){
    console.log("ERROR", err)
    throw new AppError("Too many request", 429)
  }
}

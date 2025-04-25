import { createClient } from "redis";
import GradeSchema from "../models/Grade.js";             // TODO

// init + connect to redis
const redis = createClient();
redis.connect().catch(console.error);

// export cache middleware
export async function gradesCacheMiddleware(req, res, next) {
    const cacheKey = 'grades'
    const cached = await redis.get(cacheKey);

    if (cached) {
        console.log("Cache hit");
        return res.status(200).json(JSON.parse(cached));
    } else {
        console.log("Cache miss");
        req.cacheKey = cacheKey;
        next();
    }
}
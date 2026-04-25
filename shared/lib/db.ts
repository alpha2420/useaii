import { connect, Connection } from "mongoose"
import { env } from "./env"

let cache = global.mongoose

if (!cache) {
  cache = global.mongoose = { conn: null, promise: null }
}

async function connectDb(): Promise<Connection> {
  if (cache.conn) {
    return cache.conn
  }

  if (!cache.promise) {
    const options = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    cache.promise = connect(env.MONGODB_URL, options).then((mongoose) => {
      console.log("✅ MongoDB Connected Successfully")
      return mongoose.connection
    })
  }

  try {
    cache.conn = await cache.promise
  } catch (error) {
    cache.promise = null
    console.error("❌ MongoDB Connection Error:", error)
    throw error
  }

  return cache.conn
}

export default connectDb
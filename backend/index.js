import app from "./app.js";
import { connectToDB } from "./config/db.js";

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectToDB();
    isConnected = true;
  }
  return app(req, res);
}

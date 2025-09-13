import "../instrument.mjs";
import express from "express";
import { ENV } from "./config/env.js";
import connectDB from "./config/db.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import chatRoutes from "./routes/chat.route.js";
import * as Sentry from "@sentry/node";
import cors from "cors";

import { StreamChat } from "stream-chat";


Sentry.init({ dsn: ENV.SENTRY_DSN });
// const streamClient = StreamChat.getInstance(ENV.STREAM_API_KEY, ENV.STREAM_API_SECRET);


const app = express();

// Middleware
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(clerkMiddleware()); // req.auth will be available

app.use(cors({
  origin: [ENV.CLIENT_URL, "http://localhost:5173"], // allow both local and deployed frontend
  credentials: true
}));


// Inngest endpoint (only once, correct form)
app.use("/api/inngest", serve(inngest, functions));

// Debug route
app.get("/debug-sentry", (req, res) => {
  throw new Error("My first sentry error");
});

// Health check
app.get("/", (req, res) => {
  res.send("Hello ");
});

// Chat API
app.use("/api/chat", chatRoutes);

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log("Server started on port:", ENV.PORT);
      });
    }
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

export default app;

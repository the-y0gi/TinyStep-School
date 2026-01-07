// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";

// import { connectToDB } from "./config/db.js";

// import adminRoutes from "./routes/admin.routes.js";
// import teacherRoutes from "./routes/teacher.routes.js";
// import authRoutes from "./routes/auth.routes.js"
// import studentRoutes from "./routes/student.routes.js"
// import uploadRoutes from "./routes/upload.routes.js"
// import dashboardRoutes from "./routes/studentDashboard.routes.js";
// import feeRoutes from "./routes/fee.routes.js"
// connectToDB();
// const app = express();
// const PORT = process.env.PORT || 4000;

// // 🔐 Middleware
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use(helmet());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));

// // 🔗 Route Use
// app.use("/api/admin", adminRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/teacher", teacherRoutes);
// app.use("/api/student",studentRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/upload",uploadRoutes);
// app.use("/api/fee",feeRoutes);

// //  Server Listen
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectToDB } from "./config/db.js";

import adminRoutes from "./routes/admin.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import authRoutes from "./routes/auth.routes.js"
import studentRoutes from "./routes/student.routes.js"
import uploadRoutes from "./routes/upload.routes.js"
import dashboardRoutes from "./routes/studentDashboard.routes.js";
import feeRoutes from "./routes/fee.routes.js"

const app = express();

// DB Connection
connectToDB();

// 🔐 Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", 
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health Check Route 
app.get("/", (req, res) => {
  res.send("Server is running on Vercel");
});

// Route Use
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/fee", feeRoutes);

// 🚀 Server Listen 
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
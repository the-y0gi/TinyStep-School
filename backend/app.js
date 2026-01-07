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
connectToDB();
const app = express();
const PORT = process.env.PORT || 4000;

// 🔐 Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 🔗 Route Use
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student",studentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload",uploadRoutes);
app.use("/api/fee",feeRoutes);

//  Server Listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";

// import { connectToDB } from "./config/db.js";

// import adminRoutes from "./routes/admin.routes.js";
// import teacherRoutes from "./routes/teacher.routes.js";
// import authRoutes from "./routes/auth.routes.js";
// import studentRoutes from "./routes/student.routes.js";
// import uploadRoutes from "./routes/upload.routes.js";
// import dashboardRoutes from "./routes/studentDashboard.routes.js";
// import feeRoutes from "./routes/fee.routes.js";

// dotenv.config();

// const app = express();

// // 🔐 Middleware
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL, 
//     credentials: true,
//   })
// );

// app.use(helmet());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));

// // Routes
// app.use("/api/admin", adminRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/teacher", teacherRoutes);
// app.use("/api/student", studentRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/fee", feeRoutes);

// export default app;

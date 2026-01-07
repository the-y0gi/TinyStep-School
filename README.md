# Tinysteps School Management System

A comprehensive web-based school management system designed to streamline administrative tasks, student management, teacher coordination, and parent communication for Tinysteps School.

## 🌐 Live Demo

[View Live Application](https://tinystep-school-pre.vercel.app/)

## 📋 Features

### Admin Dashboard
- User management (students, teachers, admins)
- Class and section management
- Fee structure configuration
- Attendance monitoring
- Payment processing
- Document management
- Notification system
- Super admin controls

### Teacher Dashboard
- Class management
- Student attendance tracking
- Grade and result management
- Communication with parents

### Student Dashboard
- View personal information
- Check attendance records
- Access fee details
- View notifications
- Download reports

### Public Features
- School information and gallery
- Admission process details
- Fee structure display
- Contact information

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Image/file storage
- **Razorpay** - Payment gateway
- **Nodemailer** - Email service
- **Multer** - File upload handling

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **TailwindCSS** - CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Date-fns** - Date utilities

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account (for file uploads)
- Razorpay account (for payments)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tinysteps-school
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   
   Create a `.env` file in the frontend directory:
   ```
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

4. **Run the Application**

   **Backend:**
   ```bash
   cd backend
   npm start
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

## 📁 Project Structure

```
tinysteps-school/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── app.js
│   ├── index.js
│   ├── package.json
│   └── vercel.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── admin/
    │   ├── components/
    │   ├── context/
    │   ├── features/
    │   ├── layouts/
    │   ├── pages/
    │   ├── routes/
    │   └── services/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── README.md
```

## 🔧 API Endpoints

The backend provides RESTful APIs for:
- Authentication (`/auth`)
- Admin operations (`/admin`)
- Student management (`/student`)
- Teacher operations (`/teacher`)
- Fee management (`/fee`)
- File uploads (`/upload`)

## 🚀 Deployment

The application is configured for deployment on Vercel:

- **Backend**: Deployed as a serverless function
- **Frontend**: Static site deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Contact

For questions or support, please contact the development team.

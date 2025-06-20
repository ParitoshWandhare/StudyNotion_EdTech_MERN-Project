# **StudyNotion**

StudyNotion is a full-stack EdTech platform where instructors can create and manage courses, and students can browse, purchase, and learn through an intuitive learning dashboard.  
This is my **first solo full-stack project**, built from scratch using the MERN stack and integrated with Razorpay for secure payments.

---

## 🚀 Features

### 👨‍🏫 For Instructors:
- Create, update, and manage courses
- Upload course videos (via Cloudinary)
- Monitor enrolled students and earnings

### 👨‍🎓 For Students:
- Browse courses by category
- View course details (description, price, content, etc.)
- Add to cart and purchase via Razorpay
- Track learning progress
- Submit ratings and reviews

### 🔐 Auth & Account:
- Role-based authentication
- Secure login/signup with JWT
- Update profile and settings

### 🌟 Extra:
- Recommended courses based on ratings
- Contact form with nodemailer integration
- Responsive UI and mobile-friendly

---

## 🛠️ Tech Stack

| Frontend      | Backend       | Database | Other Integrations     |
|---------------|---------------|----------|-------------------------|
| React.js      | Node.js       | MongoDB  | Razorpay (Payments)     |
| Tailwind CSS  | Express.js    | Mongoose | Cloudinary (Media)      |
| React Router  | JWT Auth      |          | Nodemailer (Contact Us) |

---

## 📂 Pages

- Home Page
- About Page
- Contact Us
- Catalog Page
- Course Detail Page
- Instructor Dashboard
- My Courses
- Add/Edit Course
- Enrolled Courses
- My Profile
- Settings


---

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/studynotion.git
   cd studynotion

2. Backend setup
   ```bash
   cd backend
   npm install
   npm run dev
   
3. Environment Variables

   ```bash
   Create .env files for both frontend and backend with necessary keys like:
   MONGODB_URI
   JWT_SECRET
   RAZORPAY_KEY_ID and KEY_SECRET
   CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET
   EMAIL_USER, EMAIL_PASS (for nodemailer)

---

## 🧠 Learnings
- Designed and built a scalable multi-role authentication system
- Integrated Razorpay for real payment processing
- Deployed media assets using Cloudinary
- Managed state and user sessions in a MERN app

---

## 🙋‍♂️ Author
- Paritosh Wandhare
- 3rd Year IT Student | Full Stack Developer
- <a href="www.linkedin.com/in/paritosh-wandhare-959615290" target="_blank" rel="noopener noreferrer">LinkedIn</a>


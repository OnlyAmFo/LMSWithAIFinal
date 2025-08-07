# 🎓 AI-Powered Learning Management System (LMS)

A comprehensive Learning Management System with advanced AI features for personalized education, automated grading, and intelligent content recommendations.

![LMS Demo](https://img.shields.io/badge/Status-Active-brightgreen)
![AI Features](https://img.shields.io/badge/AI-Features-orange)
![Tech Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Python-blue)

## 🚀 Live Demo

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **AI Demo**: [http://localhost:3000/enhanced-ai-demo](http://localhost:3000/enhanced-ai-demo)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Student Dashboard**: [http://localhost:3000/dashboard/student](http://localhost:3000/dashboard/student)

## ✨ Features

### 🧠 **AI-Powered Features**

- **Performance Analysis**: ML-based student performance prediction
- **Smart Content Recommendation**: Personalized learning materials
- **Automated Grading**: AI-powered assignment and quiz grading
- **Learning Path Optimization**: Personalized study sequences
- **Intelligent Tutoring**: Automated tutoring recommendations
- **Behavioral Analysis**: Learning pattern recognition
- **Predictive Analytics**: Risk assessment and success prediction
- **Adaptive Learning**: Dynamic difficulty adjustment
- **Quiz Generation**: AI-generated quizzes based on weak subjects

### 📚 **Core LMS Features**

- **User Management**: Students, Teachers, Admins
- **Course Management**: Create, enroll, and manage courses
- **Assignment System**: Create and submit assignments
- **Quiz System**: Multiple question types with AI generation
- **Attendance Tracking**: Digital attendance with unique student IDs
- **Progress Tracking**: Real-time performance monitoring
- **Role-based Access**: Secure authentication and authorization

### 🎨 **User Interface**

- **Modern Design**: Clean, responsive UI with Tailwind CSS
- **Real-time Updates**: Live data synchronization
- **Interactive Dashboards**: Rich visualizations and charts
- **Mobile Responsive**: Works on all devices
- **Dark/Light Mode**: Customizable themes

## 🛠️ Technology Stack

### **Frontend**

- **React 19** with Next.js 15
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **Axios** for API communication
- **React Hot Toast** for notifications

### **Backend**

- **Node.js** with Express.js
- **Prisma ORM** for database management
- **PostgreSQL** database
- **JWT** authentication
- **Multer** for file uploads
- **Cloudinary** for image storage

### **AI Module**

- **Python** with FastAPI
- **scikit-learn** for machine learning
- **numpy** & **pandas** for data processing
- **joblib** for model persistence
- **RandomForest** algorithms
- **KMeans** clustering

### **Database**

- **PostgreSQL** with Prisma ORM
- **Comprehensive schema** with relationships
- **Data validation** and constraints
- **Migration system** for version control

## 📁 Project Structure

```
LMS-test/
├── Backend/
│   ├── ai_module/           # AI/ML Python service
│   │   ├── main.py         # FastAPI application
│   │   ├── enhanced_ai.py  # ML models and algorithms
│   │   ├── requirements.txt # Python dependencies
│   │   └── models/         # Trained ML models
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Authentication & validation
│   │   └── utils/          # Helper functions
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API services
│   │   └── lib/           # Utilities
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** database
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/lms-ai-system.git
cd lms-ai-system
```

### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Database setup
npx prisma generate
npx prisma db push
npx prisma db seed

# Start the server
npm run dev
```

### 3. AI Module Setup

```bash
cd Backend/ai_module

# Install Python dependencies
pip install -r requirements.txt

# Train AI models
python train_enhanced_ai.py

# Start AI service
python main.py
```

### 4. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8001

## 🔧 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/lms"
ACCESS_TOKEN_SECRET="your_access_token_secret"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
AI_SERVICE_URL="http://localhost:8001"
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```

## 🧠 AI Features Deep Dive

### **Performance Analysis**

```python
# Analyzes student performance patterns
- Predicts future performance trends
- Identifies weak and strong subjects
- Provides personalized insights
```

### **Smart Content Recommendation**

```python
# Recommends learning materials based on:
- Student performance history
- Weak subject areas
- Learning preferences
- Course requirements
```

### **Learning Path Optimization**

```python
# Creates personalized learning journeys:
- Optimizes topic sequence
- Estimates completion time
- Adapts to learning pace
- Focuses on weak areas
```

### **Automated Grading**

```python
# AI-powered assignment grading:
- Predicts assignment scores
- Provides detailed feedback
- Identifies improvement areas
- Generates grade percentages
```

## 📊 Database Schema

### **Core Models**

- **User**: Authentication and profile management
- **Student**: Student-specific data with attendance numbers
- **Teacher**: Teacher profiles and course management
- **Course**: Course information and enrollment
- **Assignment**: Assignment creation and submission
- **Quiz**: Quiz management with AI generation
- **Attendance**: Digital attendance tracking
- **Enrollment**: Student-course relationships

### **AI Integration**

- **Performance Data**: Student scores and analytics
- **ML Models**: Trained models for predictions
- **Recommendations**: AI-generated suggestions

## 🎯 API Endpoints

### **Authentication**

- `POST /api/v1/auth/registration` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/logged-out` - User logout

### **AI Services**

- `GET /api/v1/enhanced-ai/comprehensive-insights/:studentId` - Performance analysis
- `GET /api/v1/enhanced-ai/content-recommendations/:studentId` - Content recommendations
- `POST /api/v1/enhanced-ai/auto-grade` - Automated grading
- `GET /api/v1/enhanced-ai/learning-path/:studentId` - Learning path optimization

### **Course Management**

- `GET /api/v1/course` - Get all courses
- `POST /api/v1/course/create` - Create course
- `POST /api/v1/course/enroll` - Enroll in course

### **Student Management**

- `GET /api/v1/student` - Get all students
- `GET /api/v1/student/:id` - Get student details
- `POST /api/v1/student` - Create student

## 🤖 AI Model Training

### **Training Process**

```bash
cd Backend/ai_module

# Train all models
python train_enhanced_ai.py

# Retrain with new data
python retrain_models.py

# Test models
python test_ai.py
```

### **Model Types**

- **RandomForestRegressor**: Performance prediction
- **RandomForestClassifier**: Risk level classification
- **KMeans**: Student clustering
- **StandardScaler**: Data normalization

## 🎨 Frontend Components

### **Core Components**

- **Header**: Navigation and user menu
- **Footer**: Links and information
- **Dashboard**: Role-based dashboards
- **Course Cards**: Course display and management
- **AI Performance Cards**: Performance visualization
- **Quiz Components**: Interactive quiz interface

### **AI Demo Components**

- **Enhanced AI Demo**: All AI features showcase
- **Performance Analysis**: Student performance insights
- **Content Recommendations**: Personalized suggestions
- **Learning Paths**: Optimized study sequences

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: Admin, Teacher, Student roles
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Graceful error management
- **CORS Protection**: Cross-origin request security

## 📈 Performance & Scalability

- **Database Optimization**: Efficient queries with Prisma
- **Caching**: Redis integration ready
- **Load Balancing**: Horizontal scaling support
- **API Rate Limiting**: Request throttling
- **Error Monitoring**: Comprehensive logging

## 🧪 Testing

### **Backend Testing**

```bash
cd Backend
npm test
```

### **AI Module Testing**

```bash
cd Backend/ai_module
python test_ai.py
```

### **Frontend Testing**

```bash
cd Frontend
npm run test
```

## 🚀 Deployment

### **Backend Deployment**

```bash
# Production build
npm run build
npm start
```

### **Frontend Deployment**

```bash
# Production build
npm run build
npm start
```

### **AI Service Deployment**

```bash
# Using uvicorn
uvicorn main:app --host 0.0.0.0 --port 8001
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **scikit-learn** for machine learning capabilities
- **Prisma** for database management
- **Next.js** for the frontend framework
- **Tailwind CSS** for styling
- **FastAPI** for the AI service

## 📞 Support

- **Email**: support@lms-ai.com
- **Documentation**: [Wiki](https://github.com/yourusername/lms-ai-system/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/lms-ai-system/issues)

## 🎯 Roadmap

### **Phase 1** ✅

- [x] Basic LMS functionality
- [x] AI performance analysis
- [x] User authentication
- [x] Course management

### **Phase 2** 🚧

- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Video conferencing

### **Phase 3** 📋

- [ ] Deep learning integration
- [ ] Natural language processing
- [ ] Computer vision
- [ ] Advanced AI features

---

**Made with ❤️ for better education through AI**

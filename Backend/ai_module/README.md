# LMS AI Performance Analysis Module

This FastAPI service provides AI-powered performance analysis for the LMS system. It analyzes student scores, identifies weaknesses, and provides personalized recommendations.

## Features

- **Individual Student Analysis**: Analyzes performance trends and identifies weak topics
- **Class Performance Analysis**: Provides insights for teachers and admins
- **Risk Assessment**: Identifies at-risk students
- **Personalized Recommendations**: Generates improvement suggestions based on performance

## Setup

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Navigate to the AI module directory:

```bash
cd Backend/ai_module
```

2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

### Running the Service

Start the FastAPI server:

```bash
python main.py
```

The service will be available at `http://localhost:8001`

## API Endpoints

### Health Check

- **GET** `/health`
- Returns service health status

### Individual Student Analysis

- **POST** `/analyze-performance`
- Analyzes a student's performance and provides insights

**Request Body:**

```json
{
  "student_id": "student123",
  "scores": [
    {
      "student_id": "student123",
      "topic": "Mathematics",
      "score": 85,
      "max_score": 100,
      "date": "2024-01-15",
      "assignment_type": "quiz"
    }
  ]
}
```

**Response:**

```json
{
  "student_id": "student123",
  "overall_performance": 82.5,
  "trend": "improving",
  "weaknesses": [
    {
      "topic": "Physics",
      "current_performance": 65.0,
      "average_performance": 65.0,
      "weakness_level": "high",
      "improvement_suggestions": [
        "Focus on fundamental concepts in Physics",
        "Consider additional tutoring or study groups"
      ]
    }
  ],
  "recommendations": [
    "Focus on foundational topics first",
    "Increase study time significantly"
  ],
  "risk_level": "medium"
}
```

### Class Performance Analysis

- **POST** `/analyze-class-performance`
- Analyzes performance for multiple students

## Integration with Backend

The backend connects to this AI service through the `aiService.js` module. The service URL can be configured via the `AI_SERVICE_URL` environment variable.

## Configuration

Set the following environment variables in your backend `.env` file:

```
AI_SERVICE_URL=http://localhost:8001
```

## Testing

You can test the API endpoints using tools like:

- Postman
- curl
- FastAPI's automatic documentation at `http://localhost:8001/docs`

## Future Enhancements

- Machine learning models for more accurate predictions
- Integration with external educational APIs
- Real-time performance monitoring
- Advanced analytics and reporting

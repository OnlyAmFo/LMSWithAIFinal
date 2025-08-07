import random
import json
from datetime import datetime, timedelta
import numpy as np

class LMSDataGenerator:
    def __init__(self):
        self.topics = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English", "History"]
        self.assignment_types = ["quiz", "assignment", "exam", "project", "lab"]
        
    def generate_student_scores(self, student_id, num_assessments=10, performance_level="average"):
        """Generate realistic student scores based on performance level"""
        scores = []
        
        # Set base performance based on level
        if performance_level == "excellent":
            base_score = random.uniform(85, 95)
            variance = random.uniform(5, 15)
        elif performance_level == "good":
            base_score = random.uniform(75, 85)
            variance = random.uniform(10, 20)
        elif performance_level == "average":
            base_score = random.uniform(65, 75)
            variance = random.uniform(15, 25)
        elif performance_level == "struggling":
            base_score = random.uniform(50, 65)
            variance = random.uniform(20, 30)
        else:  # poor
            base_score = random.uniform(40, 55)
            variance = random.uniform(25, 35)
        
        # Generate trend (improving, declining, or stable)
        trend = random.choice([-2, -1, 0, 1, 2])  # Points per assessment
        
        start_date = datetime(2024, 1, 1)
        
        for i in range(num_assessments):
            # Calculate score with trend and noise
            trend_effect = trend * i
            noise = random.uniform(-variance, variance)
            raw_score = base_score + trend_effect + noise
            
            # Ensure score is within valid range
            score = max(0, min(100, raw_score))
            
            # Generate date (every 5-15 days)
            days_offset = random.randint(5, 15)
            date = start_date + timedelta(days=i * days_offset)
            
            # Select topic and assignment type
            topic = random.choice(self.topics)
            assignment_type = random.choice(self.assignment_types)
            
            scores.append({
                "topic": topic,
                "score": round(score, 1),
                "maxScore": 100,
                "date": date.strftime("%Y-%m-%d"),
                "assignmentType": assignment_type
            })
        
        return scores
    
    def generate_class_data(self, num_students=50):
        """Generate data for an entire class"""
        class_data = {}
        
        # Define performance distribution
        performance_distribution = {
            "excellent": 0.15,  # 15% excellent students
            "good": 0.25,       # 25% good students
            "average": 0.35,    # 35% average students
            "struggling": 0.20, # 20% struggling students
            "poor": 0.05        # 5% poor students
        }
        
        for i in range(num_students):
            student_id = f"student{i+1}"
            
            # Assign performance level based on distribution
            rand = random.random()
            cumulative = 0
            selected_level = "average"  # default
            
            for level, prob in performance_distribution.items():
                cumulative += prob
                if rand <= cumulative:
                    selected_level = level
                    break
            
            # Generate 8-15 assessments per student
            num_assessments = random.randint(8, 15)
            scores = self.generate_student_scores(student_id, num_assessments, selected_level)
            
            class_data[student_id] = scores
        
        return class_data
    
    def generate_multiple_classes(self, num_classes=5, students_per_class=30):
        """Generate data for multiple classes"""
        all_data = {}
        
        for class_num in range(num_classes):
            class_id = f"class{class_num + 1}"
            class_data = self.generate_class_data(students_per_class)
            
            # Add class prefix to student IDs
            class_data_with_prefix = {}
            for student_id, scores in class_data.items():
                new_student_id = f"{class_id}_{student_id}"
                class_data_with_prefix[new_student_id] = scores
            
            all_data.update(class_data_with_prefix)
        
        return all_data
    
    def save_data(self, data, filename="training_data.json"):
        """Save generated data to JSON file"""
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Data saved to {filename}")
    
    def load_data(self, filename="training_data.json"):
        """Load data from JSON file"""
        try:
            with open(filename, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"File {filename} not found")
            return None

def main():
    """Generate sample training data"""
    generator = LMSDataGenerator()
    
    print("Generating training data...")
    
    # Generate data for 3 classes with 25 students each
    training_data = generator.generate_multiple_classes(num_classes=3, students_per_class=25)
    
    # Save the data
    generator.save_data(training_data, "ai_training_data.json")
    
    print(f"Generated data for {len(training_data)} students")
    
    # Show sample statistics
    total_assessments = sum(len(scores) for scores in training_data.values())
    avg_assessments = total_assessments / len(training_data)
    
    print(f"Total assessments: {total_assessments}")
    print(f"Average assessments per student: {avg_assessments:.1f}")
    
    # Show performance distribution
    performance_levels = []
    for student_id, scores in training_data.items():
        avg_score = np.mean([s['score'] for s in scores])
        if avg_score >= 85:
            performance_levels.append("excellent")
        elif avg_score >= 75:
            performance_levels.append("good")
        elif avg_score >= 65:
            performance_levels.append("average")
        elif avg_score >= 50:
            performance_levels.append("struggling")
        else:
            performance_levels.append("poor")
    
    from collections import Counter
    level_counts = Counter(performance_levels)
    
    print("\nPerformance Distribution:")
    for level, count in level_counts.items():
        percentage = (count / len(training_data)) * 100
        print(f"{level}: {count} students ({percentage:.1f}%)")

if __name__ == "__main__":
    main() 
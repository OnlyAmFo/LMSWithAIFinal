import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, mean_squared_error
import joblib
import json
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class EnhancedLMSAI:
    def __init__(self):
        self.performance_model = None
        self.risk_model = None
        self.content_recommendation_model = None
        self.grading_model = None
        self.learning_path_model = None
        self.behavioral_model = None
        self.scaler = StandardScaler()
        
    def train_performance_model(self, data):
        """Train performance prediction model"""
        X = []
        y = []
        
        for student_id, scores in data.items():
            if len(scores) < 3:
                continue
                
            # Extract features
            avg_score = np.mean([s['score'] for s in scores])
            std_score = np.std([s['score'] for s in scores])
            recent_trend = self._calculate_trend(scores[-3:])
            topic_diversity = len(set([s['topic'] for s in scores]))
            assignment_types = len(set([s['assignmentType'] for s in scores]))
            
            features = [avg_score, std_score, recent_trend, topic_diversity, assignment_types]
            X.append(features)
            y.append(avg_score)
        
        if len(X) > 10:
            X = np.array(X)
            y = np.array(y)
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            self.performance_model = RandomForestRegressor(n_estimators=100, random_state=42)
            self.performance_model.fit(X_scaled, y)
            
            return True
        return False
    
    def train_risk_classification_model(self, data):
        """Train risk classification model"""
        X = []
        y = []
        
        for student_id, scores in data.items():
            if len(scores) < 3:
                continue
                
            avg_score = np.mean([s['score'] for s in scores])
            std_score = np.std([s['score'] for s in scores])
            recent_trend = self._calculate_trend(scores[-3:])
            
            features = [avg_score, std_score, recent_trend]
            X.append(features)
            
            # Classify risk level
            if avg_score < 60:
                risk_level = 2  # High risk
            elif avg_score < 75:
                risk_level = 1  # Medium risk
            else:
                risk_level = 0  # Low risk
            y.append(risk_level)
        
        if len(X) > 10:
            X = np.array(X)
            y = np.array(y)
            
            X_scaled = self.scaler.fit_transform(X)
            
            self.risk_model = RandomForestClassifier(n_estimators=100, random_state=42)
            self.risk_model.fit(X_scaled, y)
            
            return True
        return False
    
    def train_content_recommendation_model(self, data):
        """Train content recommendation model using collaborative filtering"""
        # Create user-item matrix
        user_item_matrix = {}
        topic_scores = {}
        
        for student_id, scores in data.items():
            user_item_matrix[student_id] = {}
            for score in scores:
                topic = score['topic']
                if topic not in topic_scores:
                    topic_scores[topic] = []
                topic_scores[topic].append(score['score'])
                user_item_matrix[student_id][topic] = score['score']
        
        # Calculate topic similarities
        self.topic_similarities = {}
        topics = list(topic_scores.keys())
        
        for i, topic1 in enumerate(topics):
            for j, topic2 in enumerate(topics):
                if i != j:
                    scores1 = topic_scores[topic1]
                    scores2 = topic_scores[topic2]
                    
                    if len(scores1) > 0 and len(scores2) > 0:
                        # Use minimum length to avoid dimension mismatch
                        min_length = min(len(scores1), len(scores2))
                        if min_length >= 2:  # Need at least 2 points for correlation
                            scores1_subset = scores1[:min_length]
                            scores2_subset = scores2[:min_length]
                            
                            try:
                                correlation = np.corrcoef(scores1_subset, scores2_subset)[0, 1]
                                if not np.isnan(correlation):
                                    self.topic_similarities[(topic1, topic2)] = correlation
                            except:
                                # If correlation fails, use simple similarity
                                avg1 = np.mean(scores1_subset)
                                avg2 = np.mean(scores2_subset)
                                similarity = 1 - abs(avg1 - avg2) / 100
                                self.topic_similarities[(topic1, topic2)] = similarity
        
        return True
    
    def train_grading_model(self, data):
        """Train automated grading model"""
        X = []
        y = []
        
        for student_id, scores in data.items():
            for score in scores:
                # Features for grading
                topic = score['topic']
                assignment_type = score['assignmentType']
                date = datetime.strptime(score['date'], '%Y-%m-%d')
                
                # Convert categorical features
                topic_encoded = hash(topic) % 100
                assignment_encoded = hash(assignment_type) % 10
                day_of_week = date.weekday()
                
                features = [topic_encoded, assignment_encoded, day_of_week, score['maxScore']]
                X.append(features)
                y.append(score['score'])
        
        if len(X) > 50:
            X = np.array(X)
            y = np.array(y)
            
            self.grading_model = RandomForestRegressor(n_estimators=100, random_state=42)
            self.grading_model.fit(X, y)
            
            return True
        return False
    
    def train_learning_path_model(self, data):
        """Train learning path optimization model"""
        # Analyze learning sequences
        learning_paths = {}
        
        for student_id, scores in data.items():
            if len(scores) < 5:
                continue
                
            # Sort by date
            sorted_scores = sorted(scores, key=lambda x: x['date'])
            
            # Extract learning sequence
            sequence = []
            for score in sorted_scores:
                sequence.append({
                    'topic': score['topic'],
                    'score': score['score'],
                    'type': score['assignmentType']
                })
            
            learning_paths[student_id] = sequence
        
        # Find optimal learning patterns
        self.optimal_paths = self._analyze_learning_patterns(learning_paths)
        
        return True
    
    def train_behavioral_model(self, data):
        """Train behavioral analysis model"""
        X = []
        y = []
        
        for student_id, scores in data.items():
            if len(scores) < 3:
                continue
                
            # Behavioral features
            avg_score = np.mean([s['score'] for s in scores])
            consistency = 1 - np.std([s['score'] for s in scores]) / 100
            engagement = len(scores) / 30  # Normalize by time period
            improvement_rate = self._calculate_improvement_rate(scores)
            
            features = [avg_score, consistency, engagement, improvement_rate]
            X.append(features)
            
            # Classify learning style
            if improvement_rate > 0.1 and consistency > 0.7:
                learning_style = 0  # Consistent improver
            elif improvement_rate > 0.05:
                learning_style = 1  # Gradual improver
            else:
                learning_style = 2  # Struggling learner
            y.append(learning_style)
        
        if len(X) > 10:
            X = np.array(X)
            y = np.array(y)
            
            self.behavioral_model = RandomForestClassifier(n_estimators=100, random_state=42)
            self.behavioral_model.fit(X, y)
            
            return True
        return False
    
    def predict_performance(self, student_scores):
        """Predict future performance"""
        if self.performance_model is None:
            return None
        
        if len(student_scores) < 3:
            return None
        
        # Extract features (same as training)
        avg_score = np.mean([s['score'] for s in student_scores])
        std_score = np.std([s['score'] for s in student_scores])
        recent_trend = self._calculate_trend(student_scores[-3:])
        topic_diversity = len(set([s['topic'] for s in student_scores]))
        assignment_types = len(set([s['assignmentType'] for s in student_scores]))
        
        features = [avg_score, std_score, recent_trend, topic_diversity, assignment_types]
        X = np.array([features])
        
        try:
            X_scaled = self.scaler.transform(X)
            prediction = self.performance_model.predict(X_scaled)[0]
            return max(0, min(100, prediction))
        except ValueError:
            # If scaler expects different features, use unscaled data
            prediction = self.performance_model.predict(X)[0]
            return max(0, min(100, prediction))
    
    def predict_risk_level(self, student_scores):
        """Predict risk level"""
        if self.risk_model is None:
            return None
        
        if len(student_scores) < 3:
            return None
        
        avg_score = np.mean([s['score'] for s in student_scores])
        std_score = np.std([s['score'] for s in student_scores])
        recent_trend = self._calculate_trend(student_scores[-3:])
        
        features = [avg_score, std_score, recent_trend]
        X = np.array([features])
        
        try:
            X_scaled = self.scaler.transform(X)
            risk_level = self.risk_model.predict(X_scaled)[0]
        except ValueError:
            # If scaler expects different features, use unscaled data
            risk_level = self.risk_model.predict(X)[0]
        
        risk_labels = ['low', 'medium', 'high']
        return risk_labels[risk_level]
    
    def recommend_content(self, student_scores, target_topic=None):
        """Recommend content based on student performance"""
        if not hasattr(self, 'topic_similarities'):
            return []
        
        # Analyze student strengths and weaknesses
        topic_performance = {}
        for score in student_scores:
            topic = score['topic']
            if topic not in topic_performance:
                topic_performance[topic] = []
            topic_performance[topic].append(score['score'])
        
        # Calculate average performance per topic
        topic_avg = {}
        for topic, scores in topic_performance.items():
            topic_avg[topic] = np.mean(scores)
        
        # Find weak topics
        weak_topics = [topic for topic, avg in topic_avg.items() if avg < 70]
        
        # Generate recommendations
        recommendations = []
        
        if target_topic:
            # Recommend similar topics
            for (topic1, topic2), similarity in self.topic_similarities.items():
                if topic1 == target_topic and similarity > 0.3:
                    recommendations.append({
                        'topic': topic2,
                        'reason': f'Similar to {target_topic}',
                        'confidence': similarity
                    })
        else:
            # Recommend based on weak topics
            for weak_topic in weak_topics:
                for (topic1, topic2), similarity in self.topic_similarities.items():
                    if topic1 == weak_topic and similarity > 0.5:
                        recommendations.append({
                            'topic': topic2,
                            'reason': f'Strengthen {weak_topic}',
                            'confidence': similarity
                        })
        
        # Sort by confidence
        recommendations.sort(key=lambda x: x['confidence'], reverse=True)
        return recommendations[:5]
    
    def auto_grade_assignment(self, assignment_data):
        """Automated grading system"""
        if self.grading_model is None:
            return None
        
        topic = assignment_data.get('topic', 'General')
        assignment_type = assignment_data.get('assignmentType', 'assignment')
        max_score = assignment_data.get('maxScore', 100)
        
        # Encode features
        topic_encoded = hash(topic) % 100
        assignment_encoded = hash(assignment_type) % 10
        day_of_week = datetime.now().weekday()
        
        features = [topic_encoded, assignment_encoded, day_of_week, max_score]
        X = np.array([features])
        
        predicted_score = self.grading_model.predict(X)[0]
        return max(0, min(max_score, predicted_score))
    
    def optimize_learning_path(self, student_scores, target_topics=None):
        """Optimize learning path for student"""
        if not hasattr(self, 'optimal_paths'):
            return []
        
        # Analyze current progress
        completed_topics = set([s['topic'] for s in student_scores])
        topic_performance = {}
        
        for score in student_scores:
            topic = score['topic']
            if topic not in topic_performance:
                topic_performance[topic] = []
            topic_performance[topic].append(score['score'])
        
        # Calculate topic mastery
        topic_mastery = {}
        for topic, scores in topic_performance.items():
            avg_score = np.mean(scores)
            if avg_score >= 80:
                mastery = 'mastered'
            elif avg_score >= 60:
                mastery = 'developing'
            else:
                mastery = 'needs_work'
            topic_mastery[topic] = mastery
        
        # Generate optimized path
        optimized_path = []
        
        if target_topics:
            for target in target_topics:
                if target not in completed_topics:
                    # Find prerequisites
                    prerequisites = self._find_prerequisites(target, completed_topics)
                    optimized_path.extend(prerequisites)
                    optimized_path.append({
                        'topic': target,
                        'type': 'target',
                        'estimated_time': '2-3 weeks'
                    })
        else:
            # Suggest next best topics
            weak_topics = [topic for topic, mastery in topic_mastery.items() if mastery == 'needs_work']
            for weak_topic in weak_topics:
                optimized_path.append({
                    'topic': weak_topic,
                    'type': 'improvement',
                    'estimated_time': '1-2 weeks'
                })
        
        return optimized_path
    
    def analyze_behavior(self, student_scores):
        """Analyze student learning behavior"""
        if self.behavioral_model is None:
            return None
        
        if len(student_scores) < 3:
            return None
        
        avg_score = np.mean([s['score'] for s in student_scores])
        consistency = 1 - np.std([s['score'] for s in student_scores]) / 100
        engagement = len(student_scores) / 30
        improvement_rate = self._calculate_improvement_rate(student_scores)
        
        features = [avg_score, consistency, engagement, improvement_rate]
        X = np.array([features])
        
        learning_style = self.behavioral_model.predict(X)[0]
        learning_styles = ['Consistent Improver', 'Gradual Improver', 'Struggling Learner']
        
        return {
            'learning_style': learning_styles[learning_style],
            'consistency': consistency,
            'engagement': engagement,
            'improvement_rate': improvement_rate,
            'recommendations': self._get_behavioral_recommendations(learning_style)
        }
    
    def _calculate_trend(self, recent_scores):
        """Calculate performance trend"""
        if len(recent_scores) < 2:
            return 0
        
        scores = [s['score'] for s in recent_scores]
        if len(scores) >= 3:
            return (scores[-1] - scores[0]) / len(scores)
        return 0
    
    def _calculate_improvement_rate(self, scores):
        """Calculate improvement rate over time"""
        if len(scores) < 2:
            return 0
        
        sorted_scores = sorted(scores, key=lambda x: x['date'])
        first_half = sorted_scores[:len(sorted_scores)//2]
        second_half = sorted_scores[len(sorted_scores)//2:]
        
        if len(first_half) > 0 and len(second_half) > 0:
            first_avg = np.mean([s['score'] for s in first_half])
            second_avg = np.mean([s['score'] for s in second_half])
            return (second_avg - first_avg) / 100
        return 0
    
    def _analyze_learning_patterns(self, learning_paths):
        """Analyze optimal learning patterns"""
        patterns = {}
        
        for student_id, path in learning_paths.items():
            # Find successful sequences
            for i in range(len(path) - 1):
                current = path[i]
                next_topic = path[i + 1]
                
                sequence = f"{current['topic']}->{next_topic['topic']}"
                if sequence not in patterns:
                    patterns[sequence] = []
                
                # Calculate success rate
                if next_topic['score'] >= 70:
                    patterns[sequence].append(1)
                else:
                    patterns[sequence].append(0)
        
        # Find optimal patterns
        optimal_patterns = {}
        for sequence, success_rates in patterns.items():
            if len(success_rates) >= 3:
                avg_success = np.mean(success_rates)
                if avg_success > 0.7:
                    optimal_patterns[sequence] = avg_success
        
        return optimal_patterns
    
    def _find_prerequisites(self, target_topic, completed_topics):
        """Find prerequisites for a topic"""
        prerequisites = []
        
        # Simple prerequisite logic (can be enhanced)
        if target_topic == 'Advanced Mathematics':
            if 'Mathematics' not in completed_topics:
                prerequisites.append({
                    'topic': 'Mathematics',
                    'type': 'prerequisite',
                    'estimated_time': '1 week'
                })
        elif target_topic == 'Physics':
            if 'Mathematics' not in completed_topics:
                prerequisites.append({
                    'topic': 'Mathematics',
                    'type': 'prerequisite',
                    'estimated_time': '1 week'
                })
        
        return prerequisites
    
    def _get_behavioral_recommendations(self, learning_style):
        """Get recommendations based on learning style"""
        recommendations = {
            0: [  # Consistent Improver
                "Continue with current study habits",
                "Consider advanced topics",
                "Mentor other students"
            ],
            1: [  # Gradual Improver
                "Focus on consistent practice",
                "Set specific goals",
                "Track progress regularly"
            ],
            2: [  # Struggling Learner
                "Seek additional help",
                "Break down complex topics",
                "Practice fundamental concepts"
            ]
        }
        
        return recommendations.get(learning_style, ["Continue current approach"])
    
    def save_models(self, filepath):
        """Save all trained models"""
        models = {
            'performance_model': self.performance_model,
            'risk_model': self.risk_model,
            'grading_model': self.grading_model,
            'behavioral_model': self.behavioral_model,
            'scaler': self.scaler,
            'topic_similarities': getattr(self, 'topic_similarities', {}),
            'optimal_paths': getattr(self, 'optimal_paths', {})
        }
        
        joblib.dump(models, filepath)
    
    def load_models(self, filepath):
        """Load trained models"""
        try:
            models = joblib.load(filepath)
            
            self.performance_model = models.get('performance_model')
            self.risk_model = models.get('risk_model')
            self.grading_model = models.get('grading_model')
            self.behavioral_model = models.get('behavioral_model')
            self.scaler = models.get('scaler')
            self.topic_similarities = models.get('topic_similarities', {})
            self.optimal_paths = models.get('optimal_paths', {})
            
            return True
        except Exception as e:
            print(f"Error loading models: {e}")
            return False 
from django.core.management.base import BaseCommand
from pymongo import MongoClient
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Connect to MongoDB
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        self.stdout.write(self.style.SUCCESS('Connected to octofit_db'))

        # Clear existing data
        self.stdout.write('Clearing existing data...')
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Create unique index on email field
        db.users.create_index('email', unique=True)
        self.stdout.write(self.style.SUCCESS('Created unique index on email field'))

        # Insert Teams
        teams_data = [
            {
                '_id': 1,
                'name': 'Team Marvel',
                'description': 'Earth\'s Mightiest Heroes',
                'created_at': datetime.now(),
            },
            {
                '_id': 2,
                'name': 'Team DC',
                'description': 'Justice League United',
                'created_at': datetime.now(),
            }
        ]
        db.teams.insert_many(teams_data)
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(teams_data)} teams'))

        # Insert Users (Superheroes)
        users_data = [
            # Team Marvel
            {
                '_id': 1,
                'name': 'Tony Stark',
                'email': 'ironman@marvel.com',
                'team_id': 1,
                'role': 'hero',
                'created_at': datetime.now(),
            },
            {
                '_id': 2,
                'name': 'Steve Rogers',
                'email': 'captainamerica@marvel.com',
                'team_id': 1,
                'role': 'hero',
                'created_at': datetime.now(),
            },
            {
                '_id': 3,
                'name': 'Natasha Romanoff',
                'email': 'blackwidow@marvel.com',
                'team_id': 1,
                'role': 'hero',
                'created_at': datetime.now(),
            },
            {
                '_id': 4,
                'name': 'Thor Odinson',
                'email': 'thor@marvel.com',
                'team_id': 1,
                'role': 'hero',
                'created_at': datetime.now(),
            },
            {
                '_id': 5,
                'name': 'Bruce Banner',
                'email': 'hulk@marvel.com',
                'team_id': 1,
                'role': 'hero',
                'created_at': datetime.now(),
            },
            # Team DC
            {
                '_id': 6,
                'name': 'Bruce Wayne',
                'email': 'batman@dc.com',
                'team_id': 2,
                'role': 'hero',
                'created_at': datetime.now(),
            },
            {
                '_id': 7,
                'name': 'Clark Kent',
                'email': 'superman@dc.com',
                'team_id': 2,
                'role': 'hero',
                'created_at': datetime.now(),
            },
            {
                '_id': 8,
                'name': 'Diana Prince',
                'email': 'wonderwoman@dc.com',
                'team_id': 2,
                'role': 'hero',
                'created_at': datetime.now(),
            },
            {
                '_id': 9,
                'name': 'Barry Allen',
                'email': 'flash@dc.com',
                'team_id': 2,
                'role': 'hero',
                'created_at': datetime.now(),
            },
            {
                '_id': 10,
                'name': 'Arthur Curry',
                'email': 'aquaman@dc.com',
                'team_id': 2,
                'role': 'hero',
                'created_at': datetime.now(),
            }
        ]
        db.users.insert_many(users_data)
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(users_data)} users'))

        # Insert Activities
        activities_data = []
        activity_types = ['running', 'cycling', 'swimming', 'strength_training', 'yoga']
        activity_id = 1
        
        for user in users_data:
            # Create 5-10 activities per user
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                activity_date = datetime.now() - timedelta(days=random.randint(0, 30))
                activities_data.append({
                    '_id': activity_id,
                    'user_id': user['_id'],
                    'type': random.choice(activity_types),
                    'duration': random.randint(15, 120),  # minutes
                    'distance': round(random.uniform(1, 20), 2),  # km
                    'calories': random.randint(100, 800),
                    'date': activity_date,
                    'notes': f'{user["name"]} training session',
                })
                activity_id += 1
        
        db.activities.insert_many(activities_data)
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(activities_data)} activities'))

        # Calculate and insert Leaderboard data
        leaderboard_data = []
        for user in users_data:
            user_activities = [a for a in activities_data if a['user_id'] == user['_id']]
            total_duration = sum(a['duration'] for a in user_activities)
            total_distance = sum(a['distance'] for a in user_activities)
            total_calories = sum(a['calories'] for a in user_activities)
            
            leaderboard_data.append({
                '_id': user['_id'],
                'user_id': user['_id'],
                'user_name': user['name'],
                'team_id': user['team_id'],
                'total_activities': len(user_activities),
                'total_duration': total_duration,
                'total_distance': round(total_distance, 2),
                'total_calories': total_calories,
                'rank': 0,  # Will be calculated after sorting
            })
        
        # Sort by total_calories and assign ranks
        leaderboard_data.sort(key=lambda x: x['total_calories'], reverse=True)
        for idx, entry in enumerate(leaderboard_data, 1):
            entry['rank'] = idx
        
        db.leaderboard.insert_many(leaderboard_data)
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(leaderboard_data)} leaderboard entries'))

        # Insert Workouts (Personalized workout suggestions)
        workouts_data = [
            {
                '_id': 1,
                'name': 'Power Armor Maintenance',
                'type': 'strength_training',
                'difficulty': 'advanced',
                'duration': 45,
                'description': 'High-intensity strength training for enhanced performance',
                'exercises': ['bench press', 'deadlifts', 'squats', 'pull-ups'],
            },
            {
                '_id': 2,
                'name': 'Super Soldier Cardio',
                'type': 'running',
                'difficulty': 'advanced',
                'duration': 60,
                'description': 'Endurance training for peak physical condition',
                'exercises': ['interval running', 'hill sprints', 'long distance'],
            },
            {
                '_id': 3,
                'name': 'Spy Agility Training',
                'type': 'mixed',
                'difficulty': 'intermediate',
                'duration': 50,
                'description': 'Agility and flexibility training for stealth operations',
                'exercises': ['parkour', 'martial arts', 'gymnastics', 'yoga'],
            },
            {
                '_id': 4,
                'name': 'Asgardian Warrior Workout',
                'type': 'strength_training',
                'difficulty': 'advanced',
                'duration': 90,
                'description': 'Godlike strength training routine',
                'exercises': ['hammer swings', 'battle rope', 'tire flips', 'sledgehammer'],
            },
            {
                '_id': 5,
                'name': 'Mindful Hulk Control',
                'type': 'yoga',
                'difficulty': 'beginner',
                'duration': 30,
                'description': 'Meditation and breathing exercises for anger management',
                'exercises': ['meditation', 'breathing techniques', 'gentle stretching'],
            },
            {
                '_id': 6,
                'name': 'Dark Knight Training',
                'type': 'mixed',
                'difficulty': 'advanced',
                'duration': 120,
                'description': 'Complete combat and detective training',
                'exercises': ['martial arts', 'detective work', 'stealth training', 'gadget practice'],
            },
            {
                '_id': 7,
                'name': 'Kryptonian Strength',
                'type': 'strength_training',
                'difficulty': 'advanced',
                'duration': 60,
                'description': 'Ultimate strength and power training',
                'exercises': ['super squats', 'flying practice', 'laser focus training'],
            },
            {
                '_id': 8,
                'name': 'Amazon Warrior Training',
                'type': 'mixed',
                'difficulty': 'advanced',
                'duration': 75,
                'description': 'Warrior training from Themyscira',
                'exercises': ['sword training', 'shield work', 'combat techniques', 'endurance'],
            },
            {
                '_id': 9,
                'name': 'Speed Force Sprint',
                'type': 'running',
                'difficulty': 'advanced',
                'duration': 30,
                'description': 'Lightning-fast speed training',
                'exercises': ['speed intervals', 'reaction drills', 'agility ladder'],
            },
            {
                '_id': 10,
                'name': 'Atlantean Swimming',
                'type': 'swimming',
                'difficulty': 'intermediate',
                'duration': 45,
                'description': 'Underwater endurance and strength',
                'exercises': ['freestyle', 'underwater swimming', 'aquatic strength training'],
            }
        ]
        db.workouts.insert_many(workouts_data)
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(workouts_data)} workouts'))

        # Close connection
        client.close()

        self.stdout.write(self.style.SUCCESS('Database population completed successfully!'))
        self.stdout.write(self.style.SUCCESS(f'Summary:'))
        self.stdout.write(f'  - Teams: {len(teams_data)}')
        self.stdout.write(f'  - Users: {len(users_data)}')
        self.stdout.write(f'  - Activities: {len(activities_data)}')
        self.stdout.write(f'  - Leaderboard entries: {len(leaderboard_data)}')
        self.stdout.write(f'  - Workouts: {len(workouts_data)}')

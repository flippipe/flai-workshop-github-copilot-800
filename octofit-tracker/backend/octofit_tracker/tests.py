from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import datetime
from .models import Team, User, Activity, Leaderboard, Workout


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            _id=1,
            name='Test Team',
            description='Test Description',
            created_at=datetime.now()
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, 'Test Team')
        self.assertEqual(str(self.team), 'Test Team')


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            _id=1,
            name='Test User',
            email='test@test.com',
            team_id=1,
            role='hero',
            created_at=datetime.now()
        )

    def test_user_creation(self):
        self.assertEqual(self.user.name, 'Test User')
        self.assertEqual(str(self.user), 'Test User')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            _id=1,
            user_id=1,
            type='running',
            duration=30,
            distance=5.0,
            calories=300,
            date=datetime.now(),
            notes='Test activity'
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.type, 'running')
        self.assertEqual(self.activity.duration, 30)


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.leaderboard = Leaderboard.objects.create(
            _id=1,
            user_id=1,
            user_name='Test User',
            team_id=1,
            total_activities=10,
            total_duration=300,
            total_distance=50.0,
            total_calories=3000,
            rank=1
        )

    def test_leaderboard_creation(self):
        self.assertEqual(self.leaderboard.rank, 1)
        self.assertEqual(str(self.leaderboard), '1. Test User')


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            _id=1,
            name='Test Workout',
            type='strength_training',
            difficulty='intermediate',
            duration=45,
            description='Test workout description',
            exercises=['push-ups', 'squats']
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.name, 'Test Workout')
        self.assertEqual(str(self.workout), 'Test Workout')


class TeamAPITest(APITestCase):
    def test_team_list_endpoint(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class UserAPITest(APITestCase):
    def test_user_list_endpoint(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ActivityAPITest(APITestCase):
    def test_activity_list_endpoint(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITest(APITestCase):
    def test_leaderboard_list_endpoint(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    def test_workout_list_endpoint(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class APIRootTest(APITestCase):
    def test_api_root_endpoint(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('teams', response.data)
        self.assertIn('users', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)

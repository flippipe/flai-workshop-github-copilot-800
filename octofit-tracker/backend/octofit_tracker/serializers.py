from rest_framework import serializers
from .models import Team, User, Activity, Leaderboard, Workout


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['_id', 'name', 'description', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['_id', 'name', 'email', 'team_id', 'role', 'created_at']


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['_id', 'user_id', 'type', 'duration', 'distance', 'calories', 'date', 'notes']


class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaderboard
        fields = ['_id', 'user_id', 'user_name', 'team_id', 'total_activities', 
                  'total_duration', 'total_distance', 'total_calories', 'rank']


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['_id', 'name', 'type', 'difficulty', 'duration', 'description', 'exercises']

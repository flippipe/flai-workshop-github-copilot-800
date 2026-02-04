from django.contrib import admin
from .models import Team, User, Activity, Leaderboard, Workout


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'description', 'created_at']
    search_fields = ['name']
    ordering = ['_id']


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'email', 'team_id', 'role', 'created_at']
    search_fields = ['name', 'email']
    list_filter = ['role', 'team_id']
    ordering = ['_id']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['_id', 'user_id', 'type', 'duration', 'distance', 'calories', 'date']
    search_fields = ['type', 'notes']
    list_filter = ['type', 'date']
    ordering = ['-date']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['rank', 'user_name', 'team_id', 'total_activities', 'total_duration', 
                    'total_distance', 'total_calories']
    search_fields = ['user_name']
    list_filter = ['team_id']
    ordering = ['rank']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'type', 'difficulty', 'duration']
    search_fields = ['name', 'description']
    list_filter = ['type', 'difficulty']
    ordering = ['_id']

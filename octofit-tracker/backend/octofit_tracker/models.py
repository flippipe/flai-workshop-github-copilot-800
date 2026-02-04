from djongo import models


class Team(models.Model):
    _id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField()

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class User(models.Model):
    ROLE_HERO = 'hero'
    ROLE_ADMIN = 'admin'
    ROLE_MEMBER = 'member'

    ROLE_CHOICES = [
        (ROLE_HERO, 'Hero'),
        (ROLE_ADMIN, 'Admin'),
        (ROLE_MEMBER, 'Member'),
    ]

    _id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    team_id = models.IntegerField()
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    created_at = models.DateTimeField()

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.name


class Activity(models.Model):
    ACTIVITY_TYPE_CHOICES = [
        ('running', 'Running'),
        ('cycling', 'Cycling'),
        ('swimming', 'Swimming'),
        ('strength_training', 'Strength Training'),
        ('yoga', 'Yoga'),
    ]

    _id = models.IntegerField(primary_key=True)
    user_id = models.IntegerField()
    type = models.CharField(max_length=100, choices=ACTIVITY_TYPE_CHOICES)
    duration = models.IntegerField()  # minutes
    distance = models.FloatField()  # km
    calories = models.IntegerField()
    date = models.DateTimeField()
    notes = models.TextField()

    class Meta:
        db_table = 'activities'
        verbose_name_plural = 'Activities'

    def __str__(self):
        return f"{self.type} - {self.duration}min"


class Leaderboard(models.Model):
    _id = models.IntegerField(primary_key=True)
    user_id = models.IntegerField()
    user_name = models.CharField(max_length=200)
    team_id = models.IntegerField()
    total_activities = models.IntegerField()
    total_duration = models.IntegerField()
    total_distance = models.FloatField()
    total_calories = models.IntegerField()
    rank = models.IntegerField()

    class Meta:
        db_table = 'leaderboard'
        ordering = ['rank']

    def __str__(self):
        return f"{self.rank}. {self.user_name}"


class Workout(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    WORKOUT_TYPE_CHOICES = [
        ('running', 'Running'),
        ('swimming', 'Swimming'),
        ('strength_training', 'Strength Training'),
        ('yoga', 'Yoga'),
        ('mixed', 'Mixed'),
    ]

    _id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=100, choices=WORKOUT_TYPE_CHOICES)
    difficulty = models.CharField(max_length=50, choices=DIFFICULTY_CHOICES)
    duration = models.IntegerField()  # minutes
    description = models.TextField()
    exercises = models.JSONField()

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.name

from django.contrib.auth.models import User
from rest_framework import serializers
from TaskList.models import Task
from django.urls import reverse

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'  
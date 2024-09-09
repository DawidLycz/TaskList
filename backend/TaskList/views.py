import datetime
from string import digits, punctuation
from typing import Any

from django.contrib.auth import login, logout, update_session_auth_hash
from django.contrib.auth.models import Group, User
from django.contrib.auth.views import LoginView, LogoutView
from django.core.paginator import Paginator
from django.http import HttpRequest
from django.http.response import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse, reverse_lazy
from django.utils import timezone
from django.views import generic
from django.views.generic.edit import FormView, UpdateView

from rest_framework import status, mixins, generics, permissions, renderers, viewsets, filters
from rest_framework import generics as drfgenerics
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from rest_framework.parsers import JSONParser
from rest_framework.reverse import reverse as drf_reverse

from .models import Task, TaskList
from .serializers import *

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username is already taken"},
                status=status.HTTP_400_BAD_REQUEST
            )
        user = User.objects.create_user(username=username, password=password)
        refresh = MyTokenObtainPairSerializer.get_token(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# _________________________________________________

class IndexView(drfgenerics.ListCreateAPIView):

    serializer_class = TaskListSerializer

    def get_queryset(self):
        return TaskList.objects.all()
        # user = self.request.user
        # if not user.is_authenticated:
        #     return TaskList.objects.none()
        # return TaskList.objects.filter(author=user)
    
class TaskListDetailView(drfgenerics.RetrieveUpdateDestroyAPIView):
    model = TaskList
    queryset = TaskList.objects.all()
    serializer_class = TaskListSerializer

class TaskListView(drfgenerics.ListCreateAPIView):
    model = Task
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskDetailView(drfgenerics.RetrieveUpdateDestroyAPIView):
    model = Task
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class SubTaskListListView(drfgenerics.ListCreateAPIView):
    model = SubTaskList
    queryset = SubTaskList.objects.all()
    serializer_class = SubTaskListSerializer

class SubTaskListDetailView(drfgenerics.RetrieveUpdateDestroyAPIView):
    model = SubTaskList
    queryset = SubTaskList.objects.all()
    serializer_class = SubTaskListSerializer

class SubTaskListView(drfgenerics.ListCreateAPIView):
    model = SubTask
    queryset = SubTask.objects.all()
    serializer_class = SubTaskSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        task_id = serializer.validated_data['task'].id
        task = Task.objects.get(id=task_id)

        task_serializer = TaskSerializer(task)

        return Response(task_serializer.data, status=status.HTTP_201_CREATED)

class SubTaskDetailView(drfgenerics.RetrieveUpdateDestroyAPIView):
    model = SubTask
    queryset = SubTask.objects.all()
    serializer_class = SubTaskSerializer


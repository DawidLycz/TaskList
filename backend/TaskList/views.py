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

from .models import Task
from .serializers import TaskSerializer

class IndexView(drfgenerics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

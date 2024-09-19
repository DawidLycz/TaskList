# dfrom django.contrib.auth import views
from django.contrib.auth.views import LogoutView, LoginView
from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


app_name = "tasklist"


urlpatterns = [
    path('', views.IndexView.as_view(), name='home'),
    path('tasklists/<int:pk>/', views.TaskListDetailView.as_view(), name='tasklist'),
    path('tasks/', views.TaskListView.as_view(), name='tasks'),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
    path('subtasklists/', views.SubTaskListListView.as_view(), name='subtasklists'),
    path('subtasklists/<int:pk>/', views.SubTaskListDetailView.as_view(), name='subtasklist'),
    path('subtasks/', views.SubTaskListView.as_view(), name='subtasks'),
    path('subtasks/<int:pk>/', views.SubTaskDetailView.as_view(), name='subtask'),
    path('api/token/', views.MyTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('test/', views.TestView.as_view(), name='test'),
]
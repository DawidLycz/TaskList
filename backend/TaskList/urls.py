# dfrom django.contrib.auth import views
from django.contrib.auth.views import LogoutView, LoginView
from . import views
from django.urls import path

app_name = "tasklist"


urlpatterns = [
    path('', views.IndexView.as_view(), name='home'),
]
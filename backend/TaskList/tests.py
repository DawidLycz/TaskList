from django.test import TestCase
from django.contrib.auth.models import User
from .models import TaskList, Task, SubTask, SubTaskList
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from .models import TaskList, Task, SubTask
from rest_framework_simplejwt.tokens import RefreshToken

def get_token_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class TaskListModelTest(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.task_list = TaskList.objects.create(
            title="Test TaskList",
            description="This is a test tasklist",
            author=self.user
        )

    def test_tasklist_creation(self):
        self.assertEqual(self.task_list.title, "Test TaskList")
        self.assertEqual(self.task_list.description, "This is a test tasklist")
        self.assertEqual(self.task_list.author.username, "testuser")

    def test_tasklist_string_representation(self):
        self.assertEqual(str(self.task_list), "Test TaskList")

class TaskModelTest(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.task_list = TaskList.objects.create(
            title="Test TaskList",
            description="This is a test tasklist",
            author=self.user
        )
        
        self.task = Task.objects.create(
            task_list=self.task_list,
            title="Test Task",
            description="This is a test task",
            complete=False
        )

    def test_task_creation(self):
        self.assertEqual(self.task.title, "Test Task")
        self.assertEqual(self.task.description, "This is a test task")
        self.assertFalse(self.task.complete)
        self.assertEqual(self.task.task_list, self.task_list)

    def test_task_string_representation(self):
        self.assertEqual(str(self.task), "Test Task")

class SubTaskModelTest(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.task_list = TaskList.objects.create(
            title="Test TaskList",
            description="This is a test tasklist",
            author=self.user
        )
        self.task = Task.objects.create(
            task_list=self.task_list,
            title="Test Task",
            description="This is a test task",
            complete=False
        )
        self.subtask = SubTask.objects.create(
            task=self.task,
            title="Test SubTask",
            description="This is a test subtask",
            complete=False
        )

    def test_subtask_creation(self):
        self.assertEqual(self.subtask.title, "Test SubTask")
        self.assertEqual(self.subtask.description, "This is a test subtask")
        self.assertFalse(self.subtask.complete)
        self.assertEqual(self.subtask.task, self.task)

    def test_subtask_string_representation(self):
        self.assertEqual(str(self.subtask), "Test SubTask")

class SubTaskListModelTest(TestCase):
    
    def setUp(self):
        self.subtasklist = SubTaskList.objects.create(
            title="Test SubTaskList",
            description="This is a test subtasklist",
            complete=False
        )

    def test_subtasklist_creation(self):
        self.assertEqual(self.subtasklist.title, "Test SubTaskList")
        self.assertEqual(self.subtasklist.description, "This is a test subtasklist")
        self.assertFalse(self.subtasklist.complete)

    def test_subtasklist_string_representation(self):
        self.assertEqual(str(self.subtasklist), "Test SubTaskList")


class RegisterAndLoginTests(APITestCase):
    def test_register_user(self):
        url = reverse('tasklist:register')
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_register_user_with_existing_username(self):
        User.objects.create_user(username='testuser', password='testpassword')
        url = reverse('tasklist:register')
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "Username is already taken")

    def test_login_user(self):
        user = User.objects.create_user(username='testuser', password='testpassword')
        url = reverse('tasklist:token-obtain-pair') 
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_login_with_invalid_credentials(self):
        User.objects.create_user(username='testuser', password='testpassword')
        url = reverse('tasklist:token-obtain-pair')
        data = {'username': 'testuser', 'password': 'wrongpassword'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)


class TaskListTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = get_token_for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token['access'])

    def test_create_tasklist(self):
        url = reverse('tasklist:home') 
        data = {'title': 'My TaskList', 'description': 'A new task list', 'author': self.user.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TaskList.objects.count(), 1)
        self.assertEqual(TaskList.objects.get().title, 'My TaskList')

    def test_get_tasklists(self):
        TaskList.objects.create(title='My TaskList', description='A new task list', author=self.user)
        url = reverse('tasklist:home')
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'My TaskList')

    def test_update_tasklist(self):
        tasklist = TaskList.objects.create(title='Old TaskList', description='Old description', author=self.user)
        url = reverse('tasklist:tasklist', args=[tasklist.id])
        data = {'title': 'Updated TaskList', 'description': 'Updated description', 'author': self.user.id}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        tasklist.refresh_from_db()
        self.assertEqual(tasklist.title, 'Updated TaskList')

    def test_delete_tasklist(self):
        tasklist = TaskList.objects.create(title='My TaskList', description='A new task list', author=self.user)
        url = reverse('tasklist:tasklist', args=[tasklist.id])
        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TaskList.objects.count(), 0)


class TaskTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tasklist = TaskList.objects.create(title='My TaskList', author=self.user)
        self.token = get_token_for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token['access'])

    def test_create_task(self):
        url = reverse('tasklist:tasks')  
        data = {'title': 'My Task', 'task_list': self.tasklist.id, 'description': 'Task description'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
        self.assertEqual(Task.objects.get().title, 'My Task')

    def test_get_tasks(self):
        Task.objects.create(title='My Task', task_list=self.tasklist, description='Task description')
        url = reverse('tasklist:tasks')
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'My Task')

    def test_update_task(self):
        task = Task.objects.create(title='Old Task', task_list=self.tasklist, description='Old description')
        url = reverse('tasklist:task-detail', args=[task.id])
        data = {'task_list': self.tasklist.id,'title': 'Updated Task', 'description': 'Updated description'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        task.refresh_from_db()
        self.assertEqual(task.title, 'Updated Task')

    def test_delete_task(self):
        task = Task.objects.create(title='My Task', task_list=self.tasklist)
        url = reverse('tasklist:task-detail', args=[task.id])
        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Task.objects.count(), 0)


class SubTaskTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.tasklist = TaskList.objects.create(title='My TaskList', author=self.user)
        self.task = Task.objects.create(title='My Task', task_list=self.tasklist)
        self.token = get_token_for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token['access'])

    def test_create_subtask(self):
        url = reverse('tasklist:subtasks')  
        data = {'title': 'My SubTask', 'task': self.task.id, 'description': 'SubTask description'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        task_data = response.data
        self.assertEqual(task_data['id'], self.task.id)
        self.assertEqual(len(task_data['subtasks']), 1) 
        self.assertEqual(task_data['subtasks'][0]['title'], 'My SubTask')
        self.assertEqual(SubTask.objects.count(), 1)
        self.assertEqual(SubTask.objects.get().title, 'My SubTask')


    def test_get_subtasks(self):
        SubTask.objects.create(title='My SubTask', task=self.task)
        url = reverse('tasklist:subtasks')
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'My SubTask')

    def test_update_subtask(self):
        subtask = SubTask.objects.create(title='Old SubTask', task=self.task)
        url = reverse('tasklist:subtask', args=[subtask.id])
        data = {'title': 'Updated SubTask'}
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        subtask.refresh_from_db()
        self.assertEqual(subtask.title, 'Updated SubTask')

    def test_delete_subtask(self):
        subtask = SubTask.objects.create(title='My SubTask', task=self.task)
        url = reverse('tasklist:subtask', args=[subtask.id])
        response = self.client.delete(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(SubTask.objects.count(), 0)

# Generated by Django 5.0.7 on 2024-08-20 21:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TaskList', '0004_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='task',
            options={'verbose_name': 'Task'},
        ),
        migrations.AlterModelOptions(
            name='tasklist',
            options={'verbose_name': 'Tasklist'},
        ),
        migrations.RemoveField(
            model_name='task',
            name='depends',
        ),
        migrations.RemoveField(
            model_name='task',
            name='main',
        ),
        migrations.AddField(
            model_name='tasklist',
            name='main',
            field=models.BooleanField(default=True),
        ),
        migrations.CreateModel(
            name='SubTaskList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=250)),
                ('description', models.TextField()),
                ('complete', models.BooleanField(default=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subtasks', to='TaskList.task')),
            ],
            options={
                'verbose_name': 'Subtasklist',
                'verbose_name_plural': 'Subtasklists',
            },
        ),
        migrations.CreateModel(
            name='SubTask',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=250)),
                ('description', models.TextField()),
                ('complete', models.BooleanField(default=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('tasklist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subtasks', to='TaskList.subtasklist')),
            ],
            options={
                'verbose_name': 'Subtask',
                'verbose_name_plural': 'Subtasks',
            },
        ),
    ]
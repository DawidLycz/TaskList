# Generated by Django 5.0.7 on 2024-08-27 21:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TaskList', '0007_alter_subtask_description_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subtask',
            name='tasklist',
        ),
        migrations.AlterField(
            model_name='subtasklist',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subtasks', to='TaskList.task'),
        ),
    ]

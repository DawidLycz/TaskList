# Generated by Django 5.0.7 on 2024-08-19 19:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('TaskList', '0002_task_main'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Task',
        ),
    ]
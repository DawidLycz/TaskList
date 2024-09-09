# Generated by Django 5.0.7 on 2024-08-23 21:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TaskList', '0006_remove_tasklist_main'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subtask',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='subtasklist',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='subtasklist',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subtasklists', to='TaskList.task'),
        ),
        migrations.AlterField(
            model_name='task',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='tasklist',
            name='description',
            field=models.TextField(blank=True),
        ),
    ]
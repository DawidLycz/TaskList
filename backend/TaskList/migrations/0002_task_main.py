# Generated by Django 5.0.7 on 2024-08-08 22:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TaskList', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='main',
            field=models.BooleanField(default=True),
        ),
    ]
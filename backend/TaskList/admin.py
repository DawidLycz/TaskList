from django.contrib import admin
from . import models

admin.site.register(models.TaskList)
admin.site.register(models.Task)
admin.site.register(models.SubTaskList)
admin.site.register(models.SubTask)

# Register your models here.

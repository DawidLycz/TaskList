from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField()
    complete = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    depends = models.ManyToManyField('self', symmetrical=False, blank=True)

    def __str__(self):
        return self.title
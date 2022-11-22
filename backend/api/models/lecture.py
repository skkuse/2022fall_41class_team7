from django.db import models


class Lecture(models.Model):
    id = models.BigAutoField(help_text="Lecture Id", primary_key=True)
    name = models.CharField(max_length=2000)
    deadline = models.DateTimeField()
    submission_capacity = models.IntegerField()
    storage_capacity = models.IntegerField()

    def __str__(self):
        return self.name

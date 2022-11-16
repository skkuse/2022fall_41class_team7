from django.db import models


class Enrollment(models.Model):
    id = models.BigAutoField(help_text="Enrollment Id", primary_key=True)
    user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
    )
    lecture = models.ForeignKey(
        "Lecture",
        on_delete=models.CASCADE,
    )

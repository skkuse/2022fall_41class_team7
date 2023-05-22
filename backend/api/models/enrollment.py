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
    is_ended = models.BooleanField(default=False)

    def end(self):
        self.is_ended = True
        self.save()

    class Meta:
        unique_together = ("user", "lecture")

    def __str__(self):
        return f"{self.id}: {self.user.student_id}_{self.lecture.name}"

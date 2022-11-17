from django.core.validators import MinValueValidator
from django.db import models


class Storage(models.Model):
    id = models.BigAutoField(help_text="Storage Id", primary_key=True)
    order = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    code = models.CharField(max_length=2000)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
    )
    problem = models.ForeignKey(
        "Problem",
        on_delete=models.CASCADE,
    )

    class Meta:
        unique_together = ("user", "problem", "order")

    def __str__(self):
        return f"{self.user.student_id}_{self.problem.name}_{self.order}"

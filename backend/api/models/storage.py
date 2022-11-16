from django.db import models


class Storage(models.Model):
    id = models.BigAutoField(help_text="Storage Id", primary_key=True)
    user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
    )
    problem = models.ForeignKey(
        "Problem",
        on_delete=models.CASCADE,
    )
    code = models.CharField(max_length=2000)
    updated_at = models.DateTimeField()

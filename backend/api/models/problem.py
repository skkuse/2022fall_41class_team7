from django.db import models


class Problem(models.Model):
    id = models.BigAutoField(help_text="Problem Id", primary_key=True)
    name = models.CharField(max_length=2000)
    lecture = models.ForeignKey(
        "Lecture",
        on_delete=models.CASCADE,
    )
    explanation = models.CharField(max_length=2000)
    reference = models.CharField(max_length=2000)
    testcases = models.JSONField(
        default=list
    )  # [{"input": "x", "output": "y", "timeout": null, "is_hidden": false}]
    skeleton_code = models.CharField(max_length=2000)
    answer_code = models.CharField(max_length=2000)
    related_content = models.CharField(max_length=2000)

    def __str__(self):
        return self.name

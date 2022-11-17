from django.db import models
from django_enumfield import enum


class SubmissionState(enum.Enum):
    GRADING = 0  # 채점중
    ANALYZING = 1  # 분석중
    COMPLETE = 2  # 완료


class Submission(models.Model):
    id = models.BigAutoField(help_text="Submission Id", primary_key=True)
    user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
    )
    problem = models.ForeignKey(
        "Problem",
        on_delete=models.CASCADE,
    )
    code = models.CharField(max_length=2000)
    created_at = models.DateTimeField()
    state = enum.EnumField(SubmissionState, default=SubmissionState.GRADING)
    result = models.JSONField(null=True, blank=True, default=dict)
    analysis = models.JSONField(null=True, blank=True, default=dict)

    def __str__(self):
        return f"{self.user.student_id}_{self.problem.name}_{self.created_at}"

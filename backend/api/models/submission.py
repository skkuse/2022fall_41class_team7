from django.db import models
from django_enumfield import enum


class SubmissionState(enum.Enum):
    CREATED = 0  # 생성됨
    GRADING = 1  # 채점중
    ANALYZING = 2  # 분석중
    COMPLETE = 3  # 완료


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
    created_at = models.DateTimeField(auto_now_add=True)
    state = enum.EnumField(SubmissionState, default=SubmissionState.CREATED)
    result = models.JSONField(null=True, blank=True, default=dict)
    analysis = models.JSONField(null=True, blank=True, default=dict)

    def __str__(self):
        return (
            f"{self.id}: {self.user.student_id}_{self.problem.name}_{self.created_at}"
        )

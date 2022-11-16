from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django_enumfield import enum


class SubmissionState(enum.Enum):
    GRADING = 0  # 채점중
    ANALYZING = 1  # 분석중
    COMPLETE = 2  # 완료


class CustomUserManager(BaseUserManager):
    def create_user(self, student_id, password, name):
        if not student_id:
            raise ValueError("Users must have an student_id")
        if not password:
            raise ValueError("Users must have a password")

        user = self.model(student_id=student_id, name=name)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, student_id, password, name, **other):
        user = self.create_user(student_id, password, name)
        user.is_admin = True

        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(help_text="User Id", primary_key=True)
    student_id = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "student_id"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.name

    @property
    def is_staff(self):
        return self.is_admin

    @property
    def is_superuser(self):
        return self.is_admin


class Lecture(models.Model):
    id = models.BigAutoField(help_text="Lecture Id", primary_key=True)
    name = models.CharField(max_length=2000)
    deadline = models.DateTimeField()
    submission_capacity = models.IntegerField()
    storage_capacity = models.IntegerField()

    def __str__(self):
        return self.name


class Enrollment(models.Model):
    id = models.BigAutoField(help_text="Enrollment Id", primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    lecture = models.ForeignKey(
        Lecture,
        on_delete=models.CASCADE,
    )


class Problem(models.Model):
    id = models.BigAutoField(help_text="Problem Id", primary_key=True)
    name = models.CharField(max_length=2000)
    lecture = models.ForeignKey(
        Lecture,
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


class Storage(models.Model):
    id = models.BigAutoField(help_text="Storage Id", primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    problem = models.ForeignKey(
        Problem,
        on_delete=models.CASCADE,
    )
    code = models.CharField(max_length=2000)
    updated_at = models.DateTimeField()


class Submission(models.Model):
    id = models.BigAutoField(help_text="Submission Id", primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    problem = models.ForeignKey(
        Problem,
        on_delete=models.CASCADE,
    )
    code = models.CharField(max_length=2000)
    created_at = models.DateTimeField()
    state = enum.EnumField(SubmissionState, default=SubmissionState.GRADING)
    result = models.JSONField(default=dict)
    analysis = models.JSONField(default=dict)

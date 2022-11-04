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


class Class(models.Model):
    id = models.BigAutoField(help_text="Class Id", primary_key=True)
    name = models.CharField(max_length=2000)
    deadline = models.DateTimeField()
    submission_capacity = models.IntegerField()
    storage_capacity = models.IntegerField()


class Enrollment(models.Model):
    id = models.BigAutoField(help_text="Enrollment Id", primary_key=True)
    user_id = models.ForeignKey(
        "User",
        related_name="Enrollment_user_id",
        on_delete=models.CASCADE,
        db_column="user_id",
    )
    class_id = models.ForeignKey(
        "Class",
        related_name="Enrollment_class_id",
        on_delete=models.CASCADE,
        db_column="class_id",
    )


class Problem(models.Model):
    id = models.BigAutoField(help_text="Problem Id", primary_key=True)
    name = models.CharField(max_length=2000)
    class_id = models.ForeignKey(
        "Class",
        related_name="Problem_user_id",
        on_delete=models.CASCADE,
        db_column="class_id",
    )
    explanation = models.CharField(max_length=2000)
    reference = models.CharField(max_length=2000)
    testcases = models.JSONField(
        default=list
    )  # [{"input": "x", "output": "y", "timeout": null, "is_hidden": false}]
    skeleton_code = models.CharField(max_length=2000)
    answer_code = models.CharField(max_length=2000)
    related_content = models.CharField(max_length=2000)


class Storage(models.Model):
    id = models.BigAutoField(help_text="Storage Id", primary_key=True)
    user_id = models.ForeignKey(
        "User",
        related_name="Storage_user_id",
        on_delete=models.CASCADE,
        db_column="user_id",
    )
    problem_id = models.ForeignKey(
        "Problem",
        related_name="Storage_problem_id",
        on_delete=models.CASCADE,
        db_column="problem_id",
    )
    code = models.CharField(max_length=2000)
    updated_at = models.DateTimeField()


class Submission(models.Model):
    id = models.BigAutoField(help_text="Submission Id", primary_key=True)
    user_id = models.ForeignKey(
        "User",
        related_name="Submission_user_id",
        on_delete=models.CASCADE,
        db_column="user_id",
    )
    problem_id = models.ForeignKey(
        "Problem",
        related_name="Submission_problem_id",
        on_delete=models.CASCADE,
        db_column="problem_id",
    )
    code = models.CharField(max_length=2000)
    created_at = models.DateTimeField()
    state = enum.EnumField(SubmissionState, default=SubmissionState.GRADING)
    result = models.JSONField(default=dict)
    analysis = models.JSONField(default=dict)


"""
Table user {
  id int [pk, increment]
  student_id varchar
  password varchar
}

Table class {
  id int [pk, increment]
  name varchar
  deadline datetime
  submission_capacity int
  storage_capacity int
}

Table enrollment {
  id int [pk, increment]
  user_id int [ref: > user.id]
  class_id int [ref: > class.id]
}

Table problem {
  id int [pk, increment]
  class_id int [ref: > class.id]
  explanation varchar
  reference varchar
  testcases json // [{input: "x", output: "y", is_hidden: false}]
  skeleton_code varchar
  answer_code varchar
  related_content varchar // 데이터 형식 정해야 함
}

Table storage {
  id int [pk, increment]
  user_id int [ref: > user.id]
  problem_id int [ref: > problem.id]
  code varchar
  updated_at datetime
}

Table submission {
  id int [pk, increment]
  user_id int [ref: > user.id]
  problem_id int [ref: > problem.id]
  code varchar
  created_at datetime
  state enum // ['채점중', '분석중', '완료']
  result json // testcase 돌려본 결과 (input, output 포함)
  analysis json // 표절 검사, 기능 채점, 효율 채점, 가독성 채점
}
"""

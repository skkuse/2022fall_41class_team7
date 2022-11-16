from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models


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

from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError

from api.models import Lecture, Problem, User, Submission, Storage


class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(
        label="Password confirmation", widget=forms.PasswordInput
    )

    class Meta:
        model = User
        fields = ("student_id", "name")

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ("student_id", "name", "password", "is_active", "is_admin")


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ("student_id", "name", "is_admin")
    list_filter = ("is_admin", "is_active")
    fieldsets = (
        (None, {"fields": ("student_id", "name", "password")}),
        ("Permissions", {"fields": ("is_admin", "is_active")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("student_id", "name", "password1", "password2"),
            },
        ),
    )
    search_fields = ("student_id",)
    ordering = ("student_id",)


admin.site.register(User, UserAdmin)
admin.site.unregister(Group)

admin.site.register(Lecture)

admin.site.register(Problem)

admin.site.register(Storage)

admin.site.register(Submission)

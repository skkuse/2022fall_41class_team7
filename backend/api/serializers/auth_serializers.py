from rest_framework import serializers

from api.models import User


class UserSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField(max_length=10, validators=[])

    class Meta:
        model = User
        fields = ("id", "student_id", "name", "password")
        read_only_fields = ("name",)
        extra_kwargs = {"password": {"write_only": True}}

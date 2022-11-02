from rest_framework import serializers

from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "student_id", "password")


class ExecuteSerializer(serializers.Serializer):
    input = serializers.CharField(required=False)
    code = serializers.CharField()

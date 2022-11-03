from rest_framework import serializers

from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "student_id", "password")


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = (
            "id",
            "class_id",
            "explanation",
            "reference",
            "testcases",
            "skeleton_code",
            "answer_code",
            "related_content",
        )


class ExecuteSerializer(serializers.Serializer):
    input = serializers.CharField(required=False)
    code = serializers.CharField()

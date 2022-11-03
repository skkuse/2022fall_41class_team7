from rest_framework import serializers

from .models import *


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ("id", "name")
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "student_id", "password")


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = "__all__"


class OneClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = "__all__"


class EnrolledClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"
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

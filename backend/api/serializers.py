from rest_framework import serializers

from .models import *


class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = ("id", "name")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "student_id", "password")


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = "__all__"


class StorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Storage
        fields = "__all__"


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = "__all__"


class OneLectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = "__all__"


class EnrolledLectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"


class ExecuteSerializer(serializers.Serializer):
    input = serializers.CharField(required=False)
    code = serializers.CharField()

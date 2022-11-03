from rest_framework import serializers
from .models import *


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ("id", "name")


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

from rest_framework import serializers

from api.models import Lecture, Enrollment


class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = ("id", "name")


class OneLectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = "__all__"


class EnrolledLectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"

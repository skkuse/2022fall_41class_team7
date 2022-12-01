from rest_framework import serializers

from api.common import EpochDateTimeField
from api.models import Lecture, Enrollment


class LectureMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = ("id", "name")


class EnrollmentSerializer:
    class Meta:
        model = Enrollment
        fields = "__all__"


class LectureSerializer(serializers.ModelSerializer):
    problems = serializers.SerializerMethodField()
    deadline = EpochDateTimeField()

    class Meta:
        model = Lecture
        fields = "__all__"

    def get_problems(self, obj):
        from api.serializers import ProblemMetaSerializer

        return ProblemMetaSerializer(obj.problem_set.all(), many=True).data


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"

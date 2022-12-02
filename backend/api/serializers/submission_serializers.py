from django.core.validators import MinValueValidator
from rest_framework import serializers

from api.common import EpochDateTimeField
from api.models import Submission
from api.serializers import ProblemSerializer


class SubmissionSerializer(serializers.ModelSerializer):
    created_at = EpochDateTimeField()
    problem = ProblemSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = "__all__"


class SubmitSerializer(serializers.ModelSerializer):
    created_at = EpochDateTimeField()

    class Meta:
        model = Submission
        fields = ["id", "created_at", "state"]


class CodeSerializer(serializers.Serializer):
    code = serializers.CharField(trim_whitespace=False)


class ExecuteSerializer(CodeSerializer):
    input = serializers.CharField(required=False)


class ExecuteResultSerializer(serializers.Serializer):
    result = serializers.CharField(allow_null=True, allow_blank=True)
    error = serializers.CharField(allow_null=True)
    error_line = serializers.IntegerField(allow_null=True)


class GradeResultSerializer(ExecuteResultSerializer):
    is_passed = serializers.BooleanField()
    is_hidden = serializers.BooleanField(write_only=True)
    input = serializers.CharField()
    output = serializers.CharField()

    def validate(self, attrs):
        if attrs.get("is_hidden"):
            attrs["input"] = None
            attrs["output"] = None
            attrs["result"] = None
            attrs["error"] = None
        return attrs


class GradeQueryParamsSerializer(serializers.Serializer):
    problem_id = serializers.IntegerField(validators=[MinValueValidator(1)])
    testcase = serializers.IntegerField(validators=[MinValueValidator(1)])


class SubmitQueryParamsSerializer(serializers.Serializer):
    problem_id = serializers.IntegerField(validators=[MinValueValidator(1)])

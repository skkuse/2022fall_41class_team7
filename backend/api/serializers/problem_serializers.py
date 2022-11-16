from rest_framework import serializers

from api.models import Problem


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = "__all__"

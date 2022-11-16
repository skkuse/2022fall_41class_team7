from rest_framework import serializers


class ExecuteSerializer(serializers.Serializer):
    input = serializers.CharField(required=False)
    code = serializers.CharField()

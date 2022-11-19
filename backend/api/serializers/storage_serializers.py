from django.core.validators import MinValueValidator
from rest_framework import serializers

from api.common import EpochDateTimeField
from api.models import Storage


class StorageQueryParamsSerializer(serializers.Serializer):
    problem_id = serializers.IntegerField(validators=[MinValueValidator(1)])
    order = serializers.IntegerField(validators=[MinValueValidator(0)])


class StorageMetaSerializer(serializers.ModelSerializer):
    updated_at = EpochDateTimeField()

    class Meta:
        model = Storage
        fields = ("id", "order", "updated_at")
        extra_kwargs = {"order": {"write_only": True}}


class StorageSerializer(serializers.ModelSerializer):
    updated_at = EpochDateTimeField()

    class Meta:
        model = Storage
        fields = ("id", "code", "updated_at")

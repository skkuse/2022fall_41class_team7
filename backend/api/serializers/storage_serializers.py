from rest_framework import serializers

from api.common import EpochDateTimeField
from api.models import Storage


class StorageMetaSerializer(serializers.ModelSerializer):
    updated_at = EpochDateTimeField()

    class Meta:
        model = Storage
        fields = ("id", "order", "updated_at")
        extra_kwargs = {"order": {"write_only": True}}


class StorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Storage
        fields = "__all__"

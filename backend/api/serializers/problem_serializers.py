from rest_framework import serializers

from api.models import Problem


class ProblemMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = ("id", "name")


class ProblemSerializer(serializers.ModelSerializer):
    testcases = serializers.SerializerMethodField()
    storages = serializers.SerializerMethodField()
    submissions = serializers.SerializerMethodField()

    class Meta:
        model = Problem
        fields = (
            "id",
            "name",
            "explanation",
            "reference",
            "testcases",
            "skeleton_code",
            "storages",
            "submissions",
        )

    def get_testcases(self, obj):
        return [
            {
                "is_hidden": tc["is_hidden"],
                "input": None if tc["is_hidden"] else tc["input"],
                "output": None if tc["is_hidden"] else tc["output"],
            }
            for tc in obj.testcases
        ]

    def get_storages(self, obj):
        from api.serializers import StorageMetaSerializer

        # storage 정렬 (storage capacity 반영)
        storages = obj.storage_set.all()
        capacity = obj.lecture.storage_capacity
        sorted_storages = [
            next(filter(lambda s: s.order == i, storages), None)
            for i in range(capacity)
        ]

        return StorageMetaSerializer(sorted_storages, many=True).data

    def get_submissions(self, obj):
        return [submission.id for submission in obj.submission_set.all()]

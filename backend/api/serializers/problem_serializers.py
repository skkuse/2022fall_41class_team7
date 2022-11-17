from rest_framework import serializers

from api.models import Problem


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
            {"input": tc["input"], "output": tc["output"]}
            for tc in obj.testcases
            if not tc["is_hidden"]
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

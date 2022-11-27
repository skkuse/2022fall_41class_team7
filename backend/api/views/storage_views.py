from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response

from api.models import Storage, Lecture
from api.serializers import (
    StorageQueryParamsSerializer,
    StorageSerializer,
    CodeSerializer,
)

@api_view(["GET", "POST"])
def storage(request: Request):
    storage_serializer = StorageQueryParamsSerializer(data=request.data)
    storage_serializer.is_valid(raise_exception=True)
    problem_id = storage_serializer.validated_data.get("problem_id")
    order = storage_serializer.validated_data.get("order")

    lecture = get_object_or_404(Lecture.objects.filter(problem__id=problem_id))
    # 강의 마감 체크
    if lecture.deadline < timezone.now():
        raise PermissionDenied("강의가 마감되었습니다.")

    # 저장소 번호 체크
    if order >= lecture.storage_capacity:
        raise ValidationError("저장소 번호가 올바르지 않습니다.")

    if request.method == "GET":
        storage = Storage.objects.filter(
            user=request.user, problem_id=problem_id, order=order
        )
        return Response(StorageSerializer(get_object_or_404(storage)).data, 200)
    elif request.method == "POST":
        code_serializer = CodeSerializer(data=request.data)
        code_serializer.is_valid(raise_exception=True)
        code = code_serializer.validated_data.get("code")

        storage, created = Storage.objects.update_or_create(
            user=request.user,
            problem_id=problem_id,
            order=order,
            defaults={"code": code},
        )

        if created:
            return Response(StorageSerializer(storage).data, 201)
        else:
            return Response(StorageSerializer(storage).data, 200)

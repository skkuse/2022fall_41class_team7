from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response

from api.models import Lecture, Enrollment
from api.serializers import (
    LectureMetaSerializer,
    LectureSerializer,
)


@api_view(["GET"])
def get_lectures(request: Request):
    lectures = Lecture.objects.filter(deadline__gte=timezone.now())
    return Response(LectureMetaSerializer(lectures, many=True).data, 200)


@api_view(["GET"])
def get_lecture_by_id(request: Request, lecture_id):
    # 강의, 문제, 저장소, 제출 가져오기
    lecture = get_object_or_404(
        Lecture.objects.filter(id=lecture_id)
        .filter(enrollment__user__id=request.user.id)
        .prefetch_related("problem_set")
    )

    return Response(LectureSerializer(lecture).data, 200)


@api_view(["POST"])
def enroll_lecture(request: Request, lecture_id):
    lecture = get_object_or_404(Lecture.objects.filter(id=lecture_id))
    # 강의 마감 체크
    if lecture.deadline < timezone.now():
        raise PermissionDenied("강의가 마감되었습니다.")

    enrollment = Enrollment.objects.filter(user__id=request.user.id)
    if enrollment.exists():
        return Response(status=200)
    else:
        Enrollment.objects.create(user=request.user, lecture_id=lecture_id)
        return Response(status=201)

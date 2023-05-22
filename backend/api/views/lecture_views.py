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
    EnrollmentSerializer,
)


@api_view(["GET"])
def get_lectures(request: Request):
    lectures = Lecture.objects.all()
    return Response(LectureMetaSerializer(lectures, many=True).data, 200)


@api_view(["GET"])
def get_lecture_by_id(request: Request, lecture_id):
    # 강의, 문제, enrollment 가져오기
    lecture = get_object_or_404(
        Lecture.objects.filter(id=lecture_id)
        .filter(enrollment__user__id=request.user.id)
        .prefetch_related("problem_set")
    )
    enrollment = get_object_or_404(
        Enrollment.objects.filter(user__id=request.user.id, lecture_id=lecture.id)
    )

    res = LectureSerializer(lecture).data
    res["enrollment"] = EnrollmentSerializer(enrollment).data

    return Response(res, 200)


@api_view(["POST"])
def enroll_lecture(request: Request, lecture_id):
    lecture = get_object_or_404(Lecture.objects.filter(id=lecture_id))
    enrollment = Enrollment.objects.filter(
        user__id=request.user.id, lecture_id=lecture_id
    )

    if enrollment.exists():
        return Response(status=200)
    else:
        if lecture.deadline < timezone.now():
            raise PermissionDenied("강의가 마감되었습니다.")

        Enrollment.objects.create(user=request.user, lecture_id=lecture.id)
        return Response(status=201)


@api_view(["POST"])
def end_lecture(request: Request, lecture_id):
    lecture = get_object_or_404(Lecture.objects.filter(id=lecture_id))
    enrollment = get_object_or_404(
        Enrollment.objects.filter(user__id=request.user.id, lecture_id=lecture_id)
    )

    # 강의 마감 체크
    if enrollment.is_ended or lecture.deadline < timezone.now():
        if not enrollment.is_ended:
            enrollment.end()
        raise PermissionDenied("강의가 마감되었습니다.")

    enrollment.end()

    return Response(status=200)

from datetime import datetime

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import Lecture, Problem, Enrollment
from api.serializers.lecture_serializers import LectureSerializer, OneLectureSerializer, EnrolledLectureSerializer
from api.serializers.problem_serializers import ProblemSerializer


@api_view(["GET"])
def get_lectures():
    lectures = Lecture.objects.filter(deadline__gte=datetime.now())
    serializer = LectureSerializer(lectures, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def get_lecture_by_id(request, user_id):
    login_user_id = request.user.id  # user id

    lecture = Lecture.objects.filter(id=user_id)
    problems = Problem.objects.filter(lecture=user_id)
    enroll = Enrollment.objects.filter(user_id=login_user_id)

    serializer = OneLectureSerializer(lecture, many=True)
    serializer2 = ProblemSerializer(problems, many=True)
    serializer3 = EnrolledLectureSerializer(enroll, many=True)

    enrolled_lectures = []
    for i in serializer3.data:
        enrolled_lectures.append(i["lecture_id"])
    serializer.data[0]["problems"] = serializer2.data
    serializer.data["Problem"] = serializer2.data

    # enrollment check
    if user_id in enrolled_lectures:
        return Response(serializer.data)
    else:
        return Response("Invalid Access")


@api_view(["POST"])
def enroll_lecture(request, lecture_id):
    enroll = Enrollment.objects.all()
    lectures = Lecture.objects.filter(deadline__gte=datetime.now())

    serializer = EnrolledLectureSerializer(enroll, many=True)
    serializer2 = LectureSerializer(lectures, many=True)

    lecture_list = []
    for i in serializer2.data:
        lecture_list.append(i["lecture_id"])

    # check valid lecture
    if lecture_id in lecture_list:

        enrolled_lectures = []
        for i in serializer.data:
            enrolled_lectures.append(i["lecture_id"])

        # non-exist
        if lecture_id not in enrolled_lectures:
            serializer3 = EnrolledLectureSerializer(data=request.data)
            if serializer3.is_valid():
                serializer3.save()
                return Response(status=200)
            return Response(serializer3.errors, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response("Invalid Lecture")

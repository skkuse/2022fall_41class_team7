from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.request import Request
from rest_framework.response import Response


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def login(request: Request):
    student_id = request.data.get("student_id")
    password = request.data.get("password")

    # 요청 validation
    if student_id is None or password is None:
        return Response({"error": "student_id or password is not given"}, status=400)

    # 유저 정보 검증
    user = authenticate(student_id=student_id, password=password)
    if user is None:
        return Response({"error": "student_id or password is wrong"}, status=400)

    # 로그인 처리
    auth_login(request, user)
    return Response({"id": user.id, "student_id": user.student_id}, status=200)


@api_view(["GET"])
def logout(request: Request):
    # 로그아웃 처리
    auth_logout(request)
    return Response({"success": "logout success"}, status=200)

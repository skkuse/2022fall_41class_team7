from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.request import Request
from rest_framework.response import Response

from api.serializers import UserSerializer


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def login(request: Request):
    user_serializer = UserSerializer(data=request.data)
    user_serializer.is_valid(raise_exception=True)

    student_id = user_serializer.validated_data.get("student_id")
    password = user_serializer.validated_data.get("password")

    # 요청 validation
    if student_id is None or password is None:
        return Response({"error": "학번과 비밀번호를 모두 적어 주세요."}, status=400)

    # 유저 정보 검증
    user = authenticate(student_id=student_id, password=password)
    if user is None:
        return Response({"error": "학번 또는 비밀번호가 올바르지 않습니다."}, status=400)

    # 로그인 처리
    auth_login(request, user)
    return Response(UserSerializer(user).data, status=200)


@api_view(["GET"])
def logout(request: Request):
    # 로그아웃 처리
    auth_logout(request)
    return Response(status=200)

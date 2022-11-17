from django.urls import path

from api.views import (
    login,
    logout,
    execute,
    get_problem_by_id,
    grade,
    get_lectures,
    enroll_lecture,
    get_lecture_by_id,
    storage,
)

# api 앱 내의 url 관리
# 추후 server의 urls에 연결

urlpatterns = [
    path("login/", login),
    path("logout/", logout),
    path("problems/<int:problem_id>/", get_problem_by_id),
    path("lectures/", get_lectures),
    path("lectures/<int:lecture_id>/enroll/", enroll_lecture),
    path("lectures/<int:lecture_id>/", get_lecture_by_id),
    path("execute/", execute),
    path("grade/", grade),
    path("storages/", storage),
]

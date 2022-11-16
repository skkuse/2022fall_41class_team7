from django.urls import path

from .views import *

# api 앱 내의 url 관리
# 추후 server의 urls에 연결

urlpatterns = [
    path("login/", login),
    path("logout/", logout),
    path("lectures/", get_lectures),
    path("lectures/<int:id>/enroll/", enroll_lecture),
    path("lectures/<int:id>/", get_lecture_by_id),
    path("problems/", get_problem_by_id),
    path("problems/<id>/", get_problem_by_id),
    path("execute/", execute),
    path("problems/<int:problem_id>/grade/<int:testcase_num>/", grade),
]

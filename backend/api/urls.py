from django.urls import path

from .views import execute, grade

# api 앱 내의 url 관리
# 추후 server의 urls에 연결

urlpatterns = [
    path("execute/", execute),
    path("problems/<int:problem_id>/grade/<int:testcase_num>/", grade),
]

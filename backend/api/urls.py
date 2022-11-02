from django.urls import path
from .views import hello

# api 앱 내의 url 관리
# 추후 server의 urls에 연결

urlpatterns = [
    path("hello/", hello),
]
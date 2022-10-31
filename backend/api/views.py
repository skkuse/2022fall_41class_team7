from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response


@api_view(["GET"])
def hello(request: Request):
    return Response({"message": "Hello, world!"})

@api_view(["GET"])
def loginUser(request):
    totalUser = User.objects.all()
    serializer = UserSerializer(totalUser, many=True)
    return Response(serializer.data)
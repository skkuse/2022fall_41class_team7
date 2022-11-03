from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from .models import *
from .serializers import *

from django.http.response import HttpResponse

@api_view(['GET'])
def getClasses(request):
    classes = Class.objects.all()
    serializer = ClassSerializer(classes, many=True)
    
    return Response(serializer.data)


@api_view(['GET'])
def getIdClasses(request, id):
    login_user_id = request.user.id # user id

    class_ = Class.objects.filter(id = id)
    problems = Problem.objects.filter(class_id = id)
    enroll = Enrollment.objects.filter(user_id = login_user_id)

    serializer = OneClassSerializer(class_, many=True)
    serializer2 = ProblemSerializer(problems, many=True)
    serializer3 = EnrolledClassSerializer(enroll, many=True)

    enrolled_classes = []
    for i in serializer3.data:
        enrolled_classes.append(i['class_id'])

    serializer.data["Problem"] = serializer2.data
    
    # enrollment check
    if id in enrolled_classes:
        return Response(serializer.data)
    else:
        return HttpResponse("Invalid Access")

@api_view(['GET','POST'])
def enrollClasses(request, id):
    login_user_id = request.user.id # user id
    
    enroll = Enrollment.objects.all()
    classes = Class.objects.all()

    serializer = EnrolledClassSerializer(enroll, many=True)
    serializer2 = ClassSerializer(classes, many=True)

    classes_list = []
    for i in serializer2.data:
        classes_list.append(i['class_id'])

    # check valid class
    if id in classes_list:

        enrolled_classes = []
        for i in serializer.data:
            enrolled_classes.append(i['class_id'])

        # non-exist
        if id not in enrolled_classes:
            serializer3 = EnrolledClassSerializer(data=request.data)
            if serializer3.is_valid():
                serializer3.save()
                return Response(serializer3.data, status=status.HTTP_201_CREATED)
            return Response(serializer3.errors, status=status.HTTP_400_BAD_REQUEST)

    else:
        return HttpResponse("Invalid Class")

        
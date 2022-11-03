import uuid
from datetime import datetime
from os import remove

from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

import api.executor as executor
from server.settings.base import BASE_DIR
from .serializers import *


@api_view(["POST"])
def loginAPI(request: Request):
    student_id = request.data.get("student_id")
    password = request.data.get("password")

    try:
        user = User.objects.get(student_id=student_id)
    except User.DoesNotExist:
        return Response(status=404)

    if password == user.password:
        user_dict = UserSerializer(user).data
        user_dict["password"] = None
        return Response(user_dict, status=200)
    else:
        return Response(status=401)


@api_view(["GET"])
def getClasses(request):
    classes = Class.objects.filter(deadline__gte=datetime.now())
    serializer = ClassSerializer(classes, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def getIdClasses(request, id):
    login_user_id = request.user.id  # user id

    class_ = Class.objects.filter(id=id)
    problems = Problem.objects.filter(class_id=id)
    enroll = Enrollment.objects.filter(user_id=login_user_id)

    serializer = OneClassSerializer(class_, many=True)
    serializer2 = ProblemSerializer(problems, many=True)
    serializer3 = EnrolledClassSerializer(enroll, many=True)

    enrolled_classes = []
    for i in serializer3.data:
        enrolled_classes.append(i["class_id"])
    serializer.data[0]["problems"] = serializer2.data
    serializer.data["Problem"] = serializer2.data

    # enrollment check
    if id in enrolled_classes:
        return Response(serializer.data)
    else:
        return Response("Invalid Access")


@api_view(["POST"])
def enrollClasses(request, id):
    enroll = Enrollment.objects.all()
    classes = Class.objects.filter(deadline__gte=datetime.now())

    serializer = EnrolledClassSerializer(enroll, many=True)
    serializer2 = ClassSerializer(classes, many=True)

    classes_list = []
    for i in serializer2.data:
        classes_list.append(i["class_id"])

    # check valid class
    if id in classes_list:

        enrolled_classes = []
        for i in serializer.data:
            enrolled_classes.append(i["class_id"])

        # non-exist
        if id not in enrolled_classes:
            serializer3 = EnrolledClassSerializer(data=request.data)
            if serializer3.is_valid():
                serializer3.save()
                return Response(status=200)
            return Response(serializer3.errors, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response("Invalid Class")


@api_view(["GET"])
def problemAPI(request: Request, id):
    problem = Problem.objects.get(id=id)

    problem_dict = ProblemSerializer(problem).data
    problem_dict["answer_code"] = None
    problem_dict["related_content"] = None

    return Response(problem_dict, status=200)


@api_view(["POST"])
def execute(request: Request):
    code = request.data.get("code")
    inp = request.data.get("input")

    file_path = BASE_DIR.joinpath("tmp", f"{uuid.uuid4()}.py")

    # create directory if not exists
    if not file_path.parent.exists():
        file_path.parent.mkdir()

    # write code to file
    with open(file_path, "w") as f:
        f.write(code)

    outp, err = executor.run(file_path, code, inp)

    # remove file
    remove(file_path)

    return Response({"result": outp, "error": err})


@api_view(["POST"])
def grade(request: Request, problem_id: int, testcase_num: int):
    code = request.data.get("code")
    problem = Problem.objects.get(id=problem_id)  # TODO: Not Found Exception 처리
    testcase: dict = problem.testcases[testcase_num - 1]  # TODO: IndexError 처리

    tc_inp = testcase.get("input")
    tc_outp = testcase.get("output")
    timeout = testcase.get("timeout")
    is_hidden = testcase.get("is_hidden")

    file_path = BASE_DIR.joinpath("tmp", f"{uuid.uuid4()}.py")

    # create directory if not exists
    if not file_path.parent.exists():
        file_path.parent.mkdir()

    # write code to file
    with open(file_path, "w") as f:
        f.write(code)

    outp, err = executor.run(file_path, code, tc_inp, timeout)

    is_passed = str(outp).strip() == str(tc_outp).strip()

    if is_hidden:
        tc_inp = None
        tc_outp = None
        outp = None
        err = None

    # remove file
    remove(file_path)

    return Response(
        {
            "is_passed": is_passed,
            "input": tc_inp,
            "output": tc_outp,
            "result": outp,
            "error": err,
        }
    )

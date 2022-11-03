import uuid
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
def problemAPI(request, id=0):
    if id == 0:  # '/question/'
        problem = Problem.objects.all()
    else:  # '/question/<id>/'
        problem = Problem.objects.filter(id=id)

    # how to remove hidden case
    problem_serializer = MiniProblemSerializer(problem, many=True)
    return JsonResponse(problem_serializer.data, status=200, safe=False)


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

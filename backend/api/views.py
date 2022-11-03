import uuid
from os import remove

from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

import api.executor as executor
from api.models import Problem
from server.settings.base import BASE_DIR

from django.http import HttpResponse
from django.http.response import JsonResponse

from .models import *
from .serializers import *

@api_view(["POST"])
def loginAPI(request):
    login_data = JSONParser().parse(request)
    search_id = login_data['student_id']
    
    try:
        user = User.objects.get(student_id = search_id)
    except User.DoesNotExist:
        return HttpResponse(status = 404)
    
    if login_data['password'] == user.password:
        user_serializer = MiniUserSerializer(user)
        return JsonResponse(user_serializer.data, status = 200, safe = False)
    else:
        return HttpResponse(status = 401)
    
    """ Find out why authenticat is not working
    
    login_data = JSONParser().parse(request)
    id = login_data['student_id']
    pw = login_data['password']
    
    result = authenticate(username = id, password = pw)
    if result:
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=401)
    """

    
@api_view(["GET"])    
def problemAPI(request, id = 0):
    
    if id == 0: # '/question/'
        problem = Problem.objects.all()
    else:       # '/question/<id>/'
        problem = Problem.objects.filter(id = id)
    
    # how to remove hidden case
    problem_serializer = MiniProblemSerializer(problem, many = True)
    return JsonResponse(problem_serializer.data, status = 200, safe = False)


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

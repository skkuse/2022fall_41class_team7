import uuid
from os import remove

from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response

from api.common import executor
from api.models import Problem
from api.serializers import (
    CodeSerializer,
    GradeResultSerializer,
    ExecuteResultSerializer,
    GradeQueryParamsSerializer,
    ExecuteSerializer,
)
from server.settings.base import BASE_DIR


@api_view(["POST"])
def execute(request: Request):
    execute_serializer = ExecuteSerializer(data=request.data)
    execute_serializer.is_valid(raise_exception=True)
    code = execute_serializer.validated_data.get("code")
    user_in = execute_serializer.validated_data.get("input")

    file_path = BASE_DIR.joinpath("tmp", f"{uuid.uuid4()}.py")

    # create directory if not exists
    if not file_path.parent.exists():
        file_path.parent.mkdir()

    # write code to file
    with open(file_path, "w") as f:
        f.write(code)

    user_out, err = executor.run(file_path, code, user_in)

    # remove file
    remove(file_path)

    result_serializer = ExecuteResultSerializer(data={"result": user_out, "error": err})
    result_serializer.is_valid(raise_exception=True)

    return Response(result_serializer.data, 200)


@api_view(["POST"])
def grade(request: Request):
    query_params_serializer = GradeQueryParamsSerializer(data=request.query_params)
    query_params_serializer.is_valid(raise_exception=True)
    problem_id = query_params_serializer.validated_data.get("problem_id")
    testcase_num = query_params_serializer.validated_data.get("testcase")

    code_serializer = CodeSerializer(data=request.data)
    code_serializer.is_valid(raise_exception=True)
    code = code_serializer.validated_data.get("code")

    problem = get_object_or_404(Problem.objects.filter(id=problem_id))
    # testcase_num 검증
    if not 0 < testcase_num <= len(problem.testcases):
        raise ValidationError("testcase 번호가 올바르지 않습니다.")
    testcase: dict = problem.testcases[testcase_num - 1]

    tc_in = testcase.get("input")
    tc_out = testcase.get("output")
    timeout = testcase.get("timeout")
    is_hidden = testcase.get("is_hidden")

    file_path = BASE_DIR.joinpath("tmp", f"{uuid.uuid4()}.py")

    # create directory if not exists
    if not file_path.parent.exists():
        file_path.parent.mkdir()

    # write code to file
    with open(file_path, "w") as f:
        f.write(code)

    user_out, err = executor.run(file_path, code, tc_in, timeout)

    is_passed = str(user_out).strip() == str(tc_out).strip()

    # remove file
    remove(file_path)

    response_serializer = GradeResultSerializer(
        data={
            "is_passed": is_passed,
            "is_hidden": is_hidden,
            "input": tc_in,
            "output": tc_out,
            "result": user_out,
            "error": err,
        }
    )
    response_serializer.is_valid(raise_exception=True)

    return Response(response_serializer.data, 200)

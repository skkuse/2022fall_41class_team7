from typing import TextIO

from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response

from api.common import executor, file_interceptor
from api.models import Problem
from api.serializers import (
    CodeSerializer,
    GradeResultSerializer,
    ExecuteResultSerializer,
    GradeQueryParamsSerializer,
    ExecuteSerializer,
)


@api_view(["POST"])
@file_interceptor
def execute(request: Request, file: TextIO):
    execute_serializer = ExecuteSerializer(data=request.data)
    execute_serializer.is_valid(raise_exception=True)
    code = execute_serializer.validated_data.get("code")
    user_in = execute_serializer.validated_data.get("input")

    # write code to file
    file.write(code)
    file.close()

    user_out, err = executor.run(file.name, code, user_in)

    result_serializer = ExecuteResultSerializer(data={"result": user_out, "error": err})
    result_serializer.is_valid(raise_exception=True)

    return Response(result_serializer.data, 200)


@api_view(["POST"])
@file_interceptor
def grade(request: Request, file: TextIO):
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

    # write code to file
    file.write(code)
    file.close()

    user_out, err = executor.run(file.name, code, tc_in, timeout)

    is_passed = str(user_out).strip() == str(tc_out).strip()

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

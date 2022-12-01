from typing import TextIO

from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response

from api.common import executor, file_interceptor, grade_submission
from api.models import Problem, Submission, Enrollment
from api.serializers import (
    CodeSerializer,
    GradeResultSerializer,
    ExecuteResultSerializer,
    GradeQueryParamsSerializer,
    ExecuteSerializer,
    SubmitQueryParamsSerializer,
    SubmitSerializer,
    SubmissionSerializer,
)


@api_view(["POST"])
@file_interceptor()
def execute(request: Request, file: TextIO):
    execute_serializer = ExecuteSerializer(data=request.data)
    execute_serializer.is_valid(raise_exception=True)
    code = execute_serializer.validated_data.get("code")
    user_in = execute_serializer.validated_data.get("input")

    # write code to file
    file.write(code)
    file.close()

    user_out, err, err_line_num = executor.run(file.name, user_in)

    result_serializer = ExecuteResultSerializer(
        data={"result": user_out, "error": err, "error_line": err_line_num}
    )
    result_serializer.is_valid(raise_exception=True)

    return Response(result_serializer.data, 200)


@api_view(["POST"])
@file_interceptor()
def grade(request: Request, file: TextIO):
    query_params_serializer = GradeQueryParamsSerializer(data=request.query_params)
    query_params_serializer.is_valid(raise_exception=True)
    problem_id = query_params_serializer.validated_data.get("problem_id")
    testcase_num = query_params_serializer.validated_data.get("testcase")

    code_serializer = CodeSerializer(data=request.data)
    code_serializer.is_valid(raise_exception=True)
    code = code_serializer.validated_data.get("code")

    problem = get_object_or_404(Problem.objects.filter(id=problem_id))
    enrollment = get_object_or_404(Enrollment.objects.filter(
        user__id=request.user.id, lecture_id=problem.lecture.id)
    )

    # 강의 마감 체크
    if problem.lecture.deadline < timezone.now() or enrollment.is_ended is True:
        raise PermissionDenied("강의가 마감되었습니다.")

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

    user_out, err, err_line_num = executor.run(file.name, tc_in, timeout)

    print(user_out)
    print(tc_in, tc_out)

    is_passed = str(user_out.strip()) == str(tc_out.strip())

    response_serializer = GradeResultSerializer(
        data={
            "is_passed": is_passed,
            "is_hidden": is_hidden,
            "input": tc_in,
            "output": tc_out,
            "result": user_out,
            "error": err,
            "error_line": err_line_num,
        }
    )
    response_serializer.is_valid(raise_exception=True)

    return Response(response_serializer.data, 200)


@api_view(["POST"])
def submit(request: Request):
    query_params_serializer = SubmitQueryParamsSerializer(data=request.query_params)
    query_params_serializer.is_valid(raise_exception=True)
    problem_id = query_params_serializer.validated_data.get("problem_id")

    code_serializer = CodeSerializer(data=request.data)
    code_serializer.is_valid(raise_exception=True)
    code = code_serializer.validated_data.get("code")
    print(problem_id, code)

    # get problem & enrollment & submissions
    problem = get_object_or_404(Problem.objects.filter(id=problem_id))
    enrollment = get_object_or_404(Enrollment.objects.filter(
        user__id=request.user.id, lecture_id=problem.lecture.id)
    )
    submissions = Submission.objects.filter(problem=problem, user=request.user).all()

    # 강의 마감 체크
    if problem.lecture.deadline < timezone.now() or enrollment.is_ended is True:
        raise PermissionDenied("강의가 마감되었습니다.")

    # 제출 횟수 체크
    if len(submissions) >= problem.lecture.submission_capacity:
        raise PermissionDenied("제출 횟수가 초과되었습니다.")

    # create submission
    submission = Submission.objects.create(
        problem=problem, user=request.user, code=code
    )

    # send grade signal
    grade_submission.delay(submission.id)

    return Response(SubmitSerializer(submission).data, 201)


@api_view(["GET"])
def get_submission_by_id(request: Request, submission_id: int):
    submission = get_object_or_404(
        Submission.objects.filter(id=submission_id)
        .select_related("problem")
        .select_related("user")
    )
    enrollment = get_object_or_404(Enrollment.objects.filter(
        user__id=request.user.id, lecture_id=submission.problem.lecture.id)
    )

    if submission.problem.lecture.deadline > timezone.now() and enrollment.is_ended is False:
        raise PermissionDenied("강의가 마감되지 않았습니다.")

    if submission.user != request.user:
        raise PermissionDenied("다른 사용자의 제출물입니다.")

    return Response(SubmissionSerializer(submission).data, status=200)

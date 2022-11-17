import uuid
from os import remove

from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response

from api.common import executor
from api.models import Problem
from api.serializers.problem_serializers import ProblemSerializer
from server.settings.base import BASE_DIR


@api_view(["GET"])
def get_problem_by_id(request: Request, problem_id):
    # 문제, 저장소, 제출 가져오기
    problem = get_object_or_404(
        Problem.objects.filter(id=problem_id)
        .prefetch_related("storage_set")
        .prefetch_related("submission_set")
    )

    return Response(ProblemSerializer(problem).data, status=200)


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

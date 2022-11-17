from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response

from api.models import Problem
from api.serializers import ProblemSerializer


@api_view(["GET"])
def get_problem_by_id(request: Request, problem_id):
    # 문제, 저장소, 제출 가져오기
    problem = get_object_or_404(
        Problem.objects.filter(id=problem_id)
        .prefetch_related("storage_set")
        .prefetch_related("submission_set")
    )

    return Response(ProblemSerializer(problem).data, status=200)

from typing import TextIO

from celery import shared_task
from rest_framework.generics import get_object_or_404

from api.common import executor, file_interceptor
from api.models import Submission, SubmissionState, Problem
from .analysis import (
    execute_plagiarism,
    execute_readability,
    execute_efficiency,
    execute_codex,
)


@shared_task
@file_interceptor()
def grade_submission(submission_id: int, file: TextIO):
    # get submission
    submission = get_object_or_404(
        Submission.objects.filter(id=submission_id).select_related("problem")
    )

    # change state to grading
    submission.state = SubmissionState.GRADING
    submission.save()

    # write code to file
    file.write(submission.code)
    file.close()

    result = []
    for testcase in submission.problem.testcases:
        tc_in = testcase.get("input")
        tc_out = testcase.get("output")
        timeout = testcase.get("timeout")

        user_out, err, err_line = executor.run(file.name, tc_in, timeout)

        is_passed = str(user_out) == str(tc_out.strip()) if user_out else False
        result.append(
            {
                "input": tc_in,
                "output": tc_out,
                "user_output": user_out,
                "is_passed": is_passed,
            }
        )

    # save result
    submission.result = result
    submission.save()

    # send analyze signal
    analyze_submission.delay(submission.id)


@shared_task
@file_interceptor()
def analyze_submission(submission_id: int, file: TextIO):
    # get submission
    submission = get_object_or_404(
        Submission.objects.filter(id=submission_id).select_related("problem")
    )

    problem = get_object_or_404(Problem.objects.filter(id=submission.problem_id))

    # change state to analyzing
    submission.state = SubmissionState.ANALYZING
    submission.save()

    # write code to file
    file.write(submission.code)
    file.close()

    # 표절 검사
    plagiarism = execute_plagiarism(file.name, problem.answer_code)

    # 가독성 채점
    readability = execute_readability(file.name)

    # 효율성 채점
    efficiency = execute_efficiency(file.name, problem.answer_code)

    # 코드 설명
    explanation = execute_codex(file.name)

    # 분석 완료 및 저장
    submission.analysis = {
        "plagiarism": plagiarism,
        "readability": readability,
        "efficiency": efficiency,
        "explanation": explanation,
    }
    submission.state = SubmissionState.COMPLETE
    submission.save()

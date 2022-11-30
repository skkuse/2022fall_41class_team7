from typing import TextIO

from celery import shared_task
from rest_framework.generics import get_object_or_404

from api.common import file_interceptor, executor
from api.models import Submission, SubmissionState

from .analysis import *

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

        user_out, err = executor.run(file.name, tc_in, timeout)

        is_passed = str(user_out) == str(tc_out)
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

    # change state to analyzing
    submission.state = SubmissionState.ANALYZING
    submission.save()

    # write code to file
    file.write(submission.code)
    file.close()

    # 표절 검사
    plagiarism = execute_plagiarism (file.name)

    # 가독성 채점
    readability = analyze_readability(file.name)

    # 효율 채점
    temp_dic = {}
    temp["mypy"] = execute_mypy(file.name)
    temp["pylint"] = execute_pylint(file.name)
    temp["eradicate"] = execute_eradicate(file.name)
    temp["radon"] = execute_radon(file.name)
    temp["eradicate"] = execute_eradicate(file.name)
    efficiency = temp_dic

    # 코드 설명
    explanation = execute_codex(file.name)

    # 분석 완료 및 저장
    submission.analysis = {"plagiarism": plagiarism, "readability": readability, "efficiency": efficiency,
                           "explanation": explanation}
    submission.state = SubmissionState.COMPLETE
    submission.save()


def analyze_plagiarism(name) -> int:
    pass


def analyze_readability(path: str) -> dict:
    # relative_path = relpath(path)
    # errors = check_paths([relative_path], parse_options(), rootdir=Path.cwd())
    # print(errors)
    pass


def analyze_efficiency(path: str) -> dict:
    pass


def analyze_explanation(path: str) -> str:
    pass

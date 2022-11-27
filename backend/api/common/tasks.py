from typing import TextIO

from celery import shared_task
from rest_framework.generics import get_object_or_404

from api.common import file_interceptor, executor
from api.models import Submission


@shared_task
@file_interceptor()
def grade_submission(submission_id: int, file: TextIO):
    print(submission_id)
    print(file.name)

    # get submission
    submission = get_object_or_404(
        Submission.objects.filter(id=submission_id).select_related("problem")
    )

    # write code to file
    file.write(submission.code)
    file.close()

    for testcase in submission.problem.testcases:
        tc_in = testcase.get("input")
        tc_out = testcase.get("output")
        timeout = testcase.get("timeout")

        user_out, err = executor.run(file.name, tc_in, timeout)

        is_passed = str(user_out).strip() == str(tc_out).strip()
        print("is_passed: " + str(is_passed))

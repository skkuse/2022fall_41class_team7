import uuid
from os import remove

from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

import api.executor as executor
from server.settings.base import BASE_DIR


@api_view(["POST"])
def execute(request: Request):
    data = request.data

    code = data.get("code")
    inp = data.get("input")

    file_name = f"{uuid.uuid4()}.py"
    file_path = BASE_DIR.joinpath("tmp", file_name)

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

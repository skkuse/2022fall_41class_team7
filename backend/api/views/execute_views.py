import uuid
from os import remove

from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from api.common import executor
from server.settings.base import BASE_DIR


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

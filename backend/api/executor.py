import subprocess
import uuid
from os import remove
from typing import Union, Tuple

from server.settings.base import BASE_DIR


def run(code: str, inp: str = "") -> Union[Tuple[str, None], Tuple[None, str]]:
    file_name = f"{uuid.uuid4()}.py"
    file_path = BASE_DIR.joinpath("tmp", file_name)

    # create directory if not exists
    if not file_path.parent.exists():
        file_path.parent.mkdir()

    # write code to file
    with open(file_path, "w") as f:
        f.write(code)

    # execute code
    result = subprocess.run(["python", file_path], capture_output=True, input=inp, text=True)

    # remove file
    remove(file_path)

    return result.stdout if result.stdout else None, result.stderr.splitlines()[-1] if result.stderr else None

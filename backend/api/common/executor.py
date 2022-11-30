import subprocess
from typing import Union, Tuple

MAX_TIMEOUT = 10.0


def run(
    file_path: str, inp: str, timeout: float = MAX_TIMEOUT
) -> Union[Tuple[str, None], Tuple[None, str]]:
    # execute code
    try:
        result = subprocess.run(
            ["python", file_path],
            capture_output=True,
            input=inp,
            text=True,
            timeout=timeout,
        )
    except subprocess.TimeoutExpired:
        return None, "Timeout"

    return (
        result.stdout.strip() if result.stdout else None,
        result.stderr.splitlines()[-1] if result.stderr else None,
    )

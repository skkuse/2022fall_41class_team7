import subprocess
from typing import Union, Tuple

MAX_TIMEOUT = 10.0


def run(
        file_path: str, inp: str, timeout: float = MAX_TIMEOUT
) -> Union[Tuple[str, None, None], Tuple[None, str, int or None]]:
    # 최대 timeout = MAX_TIMEOUT
    if timeout is None or timeout > MAX_TIMEOUT:
        timeout = MAX_TIMEOUT

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
        return None, "Timeout", None

    if result.stderr:
        line_num, replaced_err = process_err(result.stderr)
        return None, replaced_err, line_num
    else:
        return result.stdout, None, None


def process_err(stderr) -> (int, str):
    lines = stderr.splitlines()
    line_num = None
    for i in range(len(lines)):
        line = lines[i]
        if line.strip().startswith("File"):
            # change file name to "main.py"
            lines[i] = line.replace(line.split('"')[1], "<stdin>")
            # get error line number
            line_num = int(line.split(",")[1].strip().split()[1])
            break

    replaced_err = "\n".join(lines)
    return line_num, replaced_err

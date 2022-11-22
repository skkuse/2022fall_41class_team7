import functools
import uuid
from os import remove

from server.settings.base import BASE_DIR


def file_interceptor(view_func):
    @functools.wraps(view_func)
    def wrapper(request, *args, **kwargs):
        # generate file path
        file_path = BASE_DIR.joinpath("tmp", f"{uuid.uuid4()}.py")

        # create directory if not exists
        if not file_path.parent.exists():
            file_path.parent.mkdir()

        # open file
        f = open(file_path, "w")

        try:
            ret = view_func(request, f, *args, **kwargs)
        finally:
            # close file if open
            if not f.closed:
                f.close()

            # remove file
            remove(file_path)

        return ret

    return wrapper

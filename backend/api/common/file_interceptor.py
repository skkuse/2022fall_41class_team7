import functools
import uuid
from os import remove

from server.settings.base import BASE_DIR


def file_interceptor(remove_file=True):
    def decorator(view_func):
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
                kwargs["file"] = f
                ret = view_func(request, *args, **kwargs)
            finally:
                # close file if open
                if not f.closed:
                    f.close()

                if remove_file and file_path.exists():
                    # remove file
                    remove(file_path)

            return ret

        return wrapper

    return decorator

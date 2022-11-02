from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

import api.executor as executor
from api.serializers import *


@api_view(["POST"])
def execute(request: Request):
    serializer = ExecuteSerializer(data=request.data)
    if serializer.is_valid():
        code = serializer.validated_data.get("code")
        inp = serializer.validated_data.get("input")
        outp, err = executor.run(code, inp)
        return Response({"result": outp, "error": err})

    return Response({"message": "Invalid request"})

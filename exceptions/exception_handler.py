from .exceptions import DomainExceptions
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken

def custom_exception_handler(exc, context):
    if isinstance(exc, DomainExceptions):
        return Response(exc.detail, status=exc.status_code)
    if isinstance(exc, InvalidToken):
        return Response(exc.default_detail, status=exc.status_code)
    return None
    # return Response("Something went wrong.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
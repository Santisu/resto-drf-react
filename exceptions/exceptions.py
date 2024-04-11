from rest_framework.exceptions import APIException
from rest_framework import status

class NotFoundException(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = "Resource not found."
    
    def __init__(self, detail=None):
        if detail:
            self.default_detail = detail
        super().__init__(self.default_detail)

class ForbiddenException(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "Forbidden."
    
    def __init__(self, detail=None):
        if detail:
            self.default_detail = detail
        super().__init__(self.default_detail)
        
class BadRequestException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Bad request."
    
    def __init__(self, detail=None):
        if detail:
            self.default_detail = detail
        super().__init__(self.default_detail)

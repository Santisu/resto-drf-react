from rest_framework.exceptions import APIException
from rest_framework import status

class DomainExceptions(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Something went wrong."
    
    def __init__(self, detail=None, status_code=None):
        if detail:
            self.default_detail = detail
        if status_code:
            self.status_code = status_code
        super().__init__(self.default_detail)
        
    @staticmethod
    def not_found(message: str):
        return DomainExceptions(detail=message, status_code=status.HTTP_404_NOT_FOUND)
    
    @staticmethod
    def forbidden(message: str):
        return DomainExceptions(detail=message, status_code=status.HTTP_403_FORBIDDEN)
    
    @staticmethod
    def bad_request(message: str):
        return DomainExceptions(detail=message, status_code=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def conflict(message: str):
        return DomainExceptions(detail=message, status_code=status.HTTP_409_CONFLICT)
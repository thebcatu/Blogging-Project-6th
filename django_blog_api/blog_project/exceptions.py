from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from rest_framework import status
from rest_framework.response import Response

class CustomValidationError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid input.'
    default_code = 'invalid'
    
    def __init__(self, detail=None, code=None):
        if detail is None:
            detail = self.default_detail
        if code is None:
            code = self.default_code
            
        self.detail = {'status': 'error', 'code': code, 'message': detail}

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first, 
    # to get the standard error response.
    response = exception_handler(exc, context)
    
    # Now add the HTTP status code to the response.
    if response is not None:
        if isinstance(exc.detail, dict):
            # Format the detailed error
            formatted_errors = {}
            for field, errors in exc.detail.items():
                if isinstance(errors, list):
                    formatted_errors[field] = errors[0]
                else:
                    formatted_errors[field] = errors
            
            response.data = {
                'status': 'error',
                'code': exc.default_code if hasattr(exc, 'default_code') else 'error',
                'message': 'Validation error',
                'errors': formatted_errors
            }
        elif isinstance(exc.detail, list):
            response.data = {
                'status': 'error',
                'code': exc.default_code if hasattr(exc, 'default_code') else 'error',
                'message': exc.detail[0]
            }
        else:
            response.data = {
                'status': 'error',
                'code': exc.default_code if hasattr(exc, 'default_code') else 'error',
                'message': str(exc.detail)
            }
    else:
        # If no response is provided, create a custom 500 response
        response = Response({
            'status': 'error',
            'code': 'server_error',
            'message': 'An unexpected error occurred'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging

from .mongo_utils import get_todos, add_todo

logger = logging.getLogger(__name__)


class TodoListView(APIView):
    """
    Handles listing and creating todo items.
    """

    def get(self, request):
        try:
            todos = get_todos()
            return Response(todos, status=status.HTTP_200_OK)
        except ConnectionError:
            return Response(
                {"error": "Database connection FAILED"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception:
            return Response(
                {"error": "FAILED to retrieve todos"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        description = request.data.get("description", "").strip()
        if not description:
            return Response(
                {"error": "Missing or empty 'description'"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            add_todo(description)
            return Response(
                {"message": "Todo created"},
                status=status.HTTP_201_CREATED,
            )
        except ConnectionError:
            return Response(
                {"error": "Database connection failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception:
            return Response(
                {"error": "Failed to create todo"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

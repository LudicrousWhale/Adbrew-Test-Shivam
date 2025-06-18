from django.test import TestCase
from rest_framework.test import APIRequestFactory
from rest_framework import status
from unittest.mock import patch

from rest.views import TodoListView


class TodoListViewTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    # GET: Should return todos when db call succeeds
    @patch("rest.views.get_todos")
    def test_get_returns_todo_list(self, mock_get_todos):
        mock_get_todos.return_value = [{"description": "Test Todo"}]

        request = self.factory.get("/todos/")
        response = TodoListView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [{"description": "Test Todo"}])

    # GET: Should return 500 when ConnectionError is raised
    @patch("rest.views.get_todos", side_effect=ConnectionError)
    def test_get_handles_connection_error(self, _):
        request = self.factory.get("/todos/")
        response = TodoListView.as_view()(request)

        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(
            response.data, {"error": "Database connection FAILED"})

    # GET: Should return 500 on generic error
    @patch("rest.views.get_todos", side_effect=Exception)
    def test_get_handles_generic_error(self, _):
        request = self.factory.get("/todos/")
        response = TodoListView.as_view()(request)

        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data, {"error": "FAILED to retrieve todos"})

    # POST: Should return 400 if description is missing or empty
    def test_post_returns_400_for_empty_description(self):
        request = self.factory.post(
            "/todos/", {"description": ""}, format="json")
        response = TodoListView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data, {"error": "Missing or empty 'description'"})

    # POST: Should return 201 when add_todo succeeds
    @patch("rest.views.add_todo")
    def test_post_creates_todo(self, mock_add_todo):
        request = self.factory.post(
            "/todos/", {"description": "New Task"}, format="json")
        response = TodoListView.as_view()(request)

        mock_add_todo.assert_called_once_with("New Task")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {"message": "Todo created"})

    # POST: Should return 500 if add_todo raises ConnectionError
    @patch("rest.views.add_todo", side_effect=ConnectionError)
    def test_post_handles_connection_error(self, _):
        request = self.factory.post(
            "/todos/", {"description": "Fail"}, format="json")
        response = TodoListView.as_view()(request)

        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(
            response.data, {"error": "Database connection failed"})

    # POST: Should return 500 on generic error
    @patch("rest.views.add_todo", side_effect=Exception)
    def test_post_handles_generic_error(self, _):
        request = self.factory.post(
            "/todos/", {"description": "Boom"}, format="json")
        response = TodoListView.as_view()(request)

        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data, {"error": "Failed to create todo"})

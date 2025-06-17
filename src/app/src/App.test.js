import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./App";

// Enable extended matchers like toBeInTheDocument()
import "@testing-library/jest-dom";

// Mock the global fetch API
global.fetch = jest.fn();

// Reset mock before each test
beforeEach(() => {
  fetch.mockClear();
});

test("Renders heading and form elements", () => {
  render(<App />);
  expect(screen.getByText(/TODO List/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Enter a new todo")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Add/i })).toBeInTheDocument();
});

test("Shows loading indicator while fetching todos", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  render(<App />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
});

test("Displays fetched todos on successful fetch", async () => {
  const mockTodosFromServer = [{ description: "Buy milk" }, { description: "Walk dog" }];

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockTodosFromServer,
  });

  render(<App />);
  await waitFor(() => {
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Walk dog")).toBeInTheDocument();
  });
});

test("Displays error message when fetch fails", async () => {
  fetch.mockRejectedValueOnce(new Error("API failure"));

  render(<App />);
  await waitFor(() => {
    expect(screen.getByText("Error fetching todos.")).toBeInTheDocument();
  });
});

test("Shows message when there are no todos", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  render(<App />);
  await waitFor(() => {
    expect(screen.getByText("No todos yet.")).toBeInTheDocument();
  });
});

test("Submits a new todo and refreshes the list", async () => {
  // First fetch to get existing todos
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })
    // Then mock for the POST request
    .mockResolvedValueOnce({
      ok: true,
    })
    // Final fetch to reload todos
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{ description: "New Todo" }],
    });

  render(<App />);
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1)); // Initial fetch

  const inputField = screen.getByPlaceholderText("Enter a new todo");
  fireEvent.change(inputField, { target: { value: "New Todo" } });

  const addButton = screen.getByRole("button", { name: /Add/i });
  fireEvent.click(addButton);

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(3); // Initial GET + POST + second GET
    expect(screen.getByText("New Todo")).toBeInTheDocument();
  });
});

test("Prevents submission of empty todo and shows error", async () => {
  // Initial fetch
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  render(<App />);
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

  const addButton = screen.getByRole("button", { name: /Add/i });
  fireEvent.click(addButton);

  expect(await screen.findByText("Todo cannot be empty.")).toBeInTheDocument();
});

test("Shows error when todo creation API fails", async () => {
  // Initial fetch
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })
    // POST fails
    .mockRejectedValueOnce(new Error("Failed to POST"));

  render(<App />);
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

  fireEvent.change(screen.getByPlaceholderText("Enter a new todo"), {
    target: { value: "Failing Todo" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Add/i }));

  await waitFor(() => {
    expect(screen.getByText("Error adding todo.")).toBeInTheDocument();
  });
});

"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs .json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [aircraft, setAircraft] = useState<Array<Schema["Aircraft"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    const content = window.prompt("Enter Todo:");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  useEffect(() => {
    client.models.Aircraft.observeQuery().subscribe({
      next: (data) => setAircraft([...data.items]),
    });
  }, []);

  function addAircraft() {
    const name = window.prompt("Enter Aircraft Name:");
    const type = window.prompt("Enter Aircraft Type:");
    if (name && type) {
      client.models.Aircraft.create({ name, type });
    }
  }

  return (
    <main>
      <div>
        <h1>Aircraft List</h1>
        <button onClick={addAircraft}>+ Add Aircraft</button>
        <ul>
          {aircraft.map((plane) => (
            <li key={plane.id}>{plane.name} ({plane.type})</li>
          ))}
        </ul>
      </div>

      <div>
        <h1>My Todos</h1>
        <button onClick={createTodo}>+ Add Todo</button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.content}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs .json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [aircraft, setAircraft] = useState<Array<Schema["Aircraft"]["type"]>>([]);

  // Fetch and observe Todos
  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    return () => subscription.unsubscribe();
  }, []);

  function createTodo() {
    const content = window.prompt("Enter Todo content:");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  // Fetch and observe Aircraft
  useEffect(() => {
    const subscription = client.models.Aircraft.observeQuery().subscribe({
      next: (data) => setAircraft([...data.items]),
    });

    return () => subscription.unsubscribe();
  }, []);

  function addAircraft() {
    const name = window.prompt("Enter Aircraft Name:");
    if (name) {
      client.models.Aircraft.create({ name }); // Use 'name' instead of 'content'
    }
  }

  return (
    <main>
      {/* Aircraft Section */}
      <div>
        <h1>Aircraft List</h1>
        <button onClick={addAircraft}>+ Add Aircraft</button>
        <ul>
          {aircraft.map((plane) => (
            <li key={plane.id}>{plane.name}</li> 
          ))}
        </ul>
      </div>

      {/* Todos Section */}
      <div>
        <h1>My Todos</h1>
        <button onClick={createTodo}>+ Add Todo</button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.content}</li>
          ))}
        </ul>
      </div>

      {/* Footer Section */}
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}
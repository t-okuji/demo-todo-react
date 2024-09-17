import "./App.css";
import TodoList from "./TodoList";

function App() {
  return (
    <div className="flex justify-center px-2 flex-col">
      <p className="text-xl font-bold mb-4">Todo demo</p>
      <TodoList />
    </div>
  );
}

export default App;

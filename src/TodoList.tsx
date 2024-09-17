import "./App.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { useState } from "react";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";

type TaskType = {
  id: number;
  task: string;
  status: number;
};

const getTodo = async () => {
  const response: AxiosResponse<TaskType[]> = await axios({
    method: "GET",
    url: `${import.meta.env.VITE_API_URL}/tasks`,
    timeout: 20000,
  });
  return response.data;
};

const postTodo = async (task: Omit<TaskType, "id">) => {
  const response: AxiosResponse<TaskType> = await axios({
    method: "POST",
    url: `${import.meta.env.VITE_API_URL}/tasks`,
    timeout: 20000,
    data: task,
  });
  return response.data;
};
const putTodo = async (task: TaskType) => {
  const response: AxiosResponse<TaskType> = await axios({
    method: "PUT",
    url: `${import.meta.env.VITE_API_URL}/tasks`,
    timeout: 20000,
    data: task,
  });
  return response.data;
};

function TodoList() {
  const queryClient = useQueryClient();
  const [task, setTask] = useState("");

  const query = useQuery({
    queryKey: [`${import.meta.env.VITE_API_URL}/tasks`],
    queryFn: getTodo,
  });

  const postMutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      queryClient.invalidateQueries();
      setTask("");
    },
  });
  const putMutation = useMutation({
    mutationFn: putTodo,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  if (query.isLoading) {
    return <div className="flex justify-center px-2 flex-col">Loading...</div>;
  }

  if (query.isSuccess) {
    return (
      <div className="flex flex-col items-center space-y-1">
        {query.data?.map((task) => (
          <div className="text-lg w-[10%]" key={task.id}>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={String(task.id)}
                checked={task.status === 1}
                onCheckedChange={(e) => {
                  putMutation.mutate({
                    id: task.id,
                    task: task.task,
                    status: e ? 1 : 0,
                  });
                }}
              />
              <label
                htmlFor={String(task.id)}
                className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {task.task}
              </label>
            </div>
          </div>
        ))}
        <div className="flex space-x-2 pt-2">
          <Input
            placeholder="Task"
            value={task}
            onChange={(e) => {
              setTask(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              postMutation.mutate({
                task: task,
                status: 0,
              });
            }}
            disabled={task === ""}
          >
            Add Todo
          </Button>
        </div>
      </div>
    );
  }
}

export default TodoList;

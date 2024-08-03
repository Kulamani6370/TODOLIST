import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import customFetch from "../utils";
import { useState } from "react";
import { toast } from "react-toastify";

const List = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [taskToAdd, setTaskToAdd] = useState("");
  const [addTaskBtn, setAddTaskBtn] = useState(false);
  const { isLoading, data, error } = useQuery({
    // const { isLoading, data, isError, error } you can use the isError property also
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await customFetch.get("/");
      // console.log(data);
      return data;
    },
  });

  const queryClient = useQueryClient();

  const { mutate: deleteTask } = useMutation({
    mutationFn: (id) => {
      return customFetch.delete(`/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Congrats you have completed the task");
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const { mutate: addTask } = useMutation({
    mutationFn: () => {
      // const {title } = taskToAdd;
      return customFetch.post("/", { title: taskToAdd });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task added successfully");
      setTaskToAdd("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return <p style={{ marginTop: "1rem" }}>Loading....</p>;
  }

  // if (isError) {
  //   return <p style={{ marginTop: "1rem" }}>There was an error</p>;
  //   // return toast.error("Failed to load");
  // }

  if (error) {
    return <p>{error.message}</p>;
  }

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };

  const handleAddTaskBtn = () => {
    let result = !addTaskBtn;
    setAddTaskBtn(result);
  };

  return (
    <section className="list-section">
      <h3>Works to do</h3>
      {data.map((item) => {
        return (
          <div className="work-item" key={item._id}>
            <input
              type="checkbox"
              onClick={handleCheck}
              className="input-checkbox"
            ></input>
            <h4 className="job-title">{item.title}</h4>
            {isChecked ? (
              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteTask(item._id)}
              >
                delete
              </button>
            ) : (
              <button
                type="button"
                onClick={() => toast.error("You haven't completed the task")}
              >
                delete
              </button>
            )}
            {/* <button type="button" onClick={() => deleteTask(item._id)}>
              delete
            </button> */}
          </div>
        );
      })}
      <button type="button" className="add-task-btn" onClick={handleAddTaskBtn}>
        Add Task
      </button>
      {addTaskBtn ? (
        <div className="task-input-container">
          <input
            type="text"
            className="task-input"
            value={taskToAdd}
            onChange={(event) => setTaskToAdd(event.target.value)}
          />
          <button
            type="submit"
            className="btn submit-btn"
            onClick={() => addTask()}
          >
            submit
          </button>
        </div>
      ) : (
        <p>Add your tasks that need to be completed</p>
      )}
    </section>
  );
};

export default List;

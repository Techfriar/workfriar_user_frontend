import React, { useEffect, useState } from "react";
import styles from "./task-selector.module.scss";
import SearchBar from "@/themes/components/search-bar/search-bar";
import Icons from "@/themes/images/icons/icons";
import { CategoryList } from "@/interfaces/timesheets/timesheets";
import UseAllTimesheetsServices from "../../services/all-timesheet-services/all-time-sheet-services";
import SkeletonLoader from "@/themes/components/skeleton-loader/skeleton-loader";
import { Empty } from "antd";

/**
 * Interface for the props passed to the TaskSelector component.
 *
 * @interface TaskSelectorProps
 * @property {string | undefined} projectId - The ID of the project to fetch tasks for.
 * @property {(task: CategoryList) => void} setSelectedTask - Function to set the selected task.
 */
interface TaskSelectorProps {
  projectId: string | undefined; // The ID of the project.
  setSelectedTask: (task: CategoryList) => void; // Function to set the selected task in the parent component.
}

/**
 * TaskSelector component allows the user to select a task category from a list.
 * It fetches the task categories for the given project and displays them in a list.
 * When a task is clicked, it sets the selected task.
 *
 * @param {TaskSelectorProps} props - The props for the component.
 * @returns {JSX.Element} The rendered TaskSelector component.
 */
const TaskSelector: React.FC<TaskSelectorProps> = ({
  projectId,
  setSelectedTask,
}) => {
  // State to store the list of tasks fetched for the project
  const [tasks, setTasks] = useState<CategoryList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Handles the task click event and sets the selected task.
   *
   * @param {CategoryList} task - The task that was clicked.
   */
  const handleTaskClick = (task: CategoryList) => {
    setSelectedTask(task); // Set the selected task
  };

  const fetchTask = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await UseAllTimesheetsServices().fetchTaskCategories(
        projectId!
      );
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch task categories when the component mounts or when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchTask(projectId!);
      setLoading(false);
    }
  }, [projectId]); // Dependency array includes projectId to refetch tasks if it changes

  return (
    <div className={styles.taskSelectorWrapper}>
      <h2>Task category</h2>
      <SearchBar placeholder="Search" onChange={() => {}} value="" />
      {loading ? (
        <SkeletonLoader />
      ) : tasks.length === 0 ? (
        <Empty />
      ) : (
        <>
          <ul>
            {tasks?.map((task) => (
              <li
                key={task._id} // Unique key for each task in the list
                onClick={() => handleTaskClick(task)} // Attach click handler to set the selected task
                className={styles.taskItem} // Styling for each task item
              >
                {task.category} {/* Display the task category name */}
              </li>
            ))}
          </ul>
        </>
      )}
      <button className={styles.addTaskButton}>
        <span>{Icons.plusGold}</span> Add task category{" "}
        {/* Button to add a new task */}
      </button>
    </div>
  );
};

export default TaskSelector;

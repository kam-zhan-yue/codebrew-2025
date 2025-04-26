import { Interactions } from "../game/types/interactions";
import { Task } from "../game/types/ui-state";
import { useGameStore } from "../store";
import Overlay from "./overlay";

interface TaskData {
  message: string;
  completed: boolean;
}

const Tasks = () => {
  const playerTasks = useGameStore((s) => s.uiState.tasks);
  const interactions = useGameStore((s) => s.gameState.interactions);
  const getTaskData = (task: Task): TaskData => {
    const interaction = Interactions[task.interactionId];
    const message = task.targetState
      ? interaction.activateGoal
      : interaction.deactivateGoal;
    const serverInteraction = interactions.find(
      (i) => i.id === task.interactionId,
    );
    const completed = serverInteraction?.active === task.targetState;
    return {
      message,
      completed,
    };
  };

  return (
    <Overlay className="inset-x-16 inset-y-16">
      <h3>Your Tasks</h3>
      {playerTasks.map((task) => {
        const taskData = getTaskData(task);
        return (
          <div key={task.interactionId}>
            {taskData.completed ? (
              <s>{taskData.message}</s>
            ) : (
              <p>{taskData.message}</p>
            )}
          </div>
        );
      })}
    </Overlay>
  );
};

export default Tasks;

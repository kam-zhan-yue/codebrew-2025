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
      <p className="text-3xl mb-4">Your Tasks</p>
      {playerTasks.map((task) => {
        const taskData = getTaskData(task);
        return (
          <div
            className="text-xl flex items-center gap-2 mb-2"
            key={task.interactionId}
          >
            <input
              type="checkbox"
              checked={taskData.completed}
              readOnly
              className="w-5 h-5 accent-green-400"
            />
            {taskData.completed ? (
              <s className="text-green-400">{taskData.message}</s>
            ) : (
              <span className="text-red-400">{taskData.message}</span>
            )}
          </div>
        );
      })}
    </Overlay>
  );
};

export default Tasks;

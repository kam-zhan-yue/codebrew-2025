import { useTasks } from "../api/hooks/get-tasks";
import { Interactions } from "../game/types/interactions";
import { Task } from "../game/types/ui-state";
import { useGameStore } from "../store";
import Overlay from "./overlay";

interface TaskData {
  message: string;
  completed: boolean;
}

const Tasks = () => {
  const playerId = useGameStore((s) => s.playerId);
  const { isPending, isError, data, error } = useTasks(playerId);

  const interactions = useGameStore((s) => s.gameState.interactions);
  const getTaskData = (task: Task): TaskData => {
    const interaction = Interactions[task.interactionId];
    const message = task.targetState
      ? interaction.activateGoal
      : interaction.deactivateGoal;
    const serverInteraction = interactions?.find(
      (i) => i.id === task.interactionId,
    );
    const completed = serverInteraction?.active === task.targetState;
    return {
      message,
      completed,
    };
  };

  if (isPending) return <></>;
  if (isError)
    return (
      <>
        <Overlay className="inset-x-16 inset-y-16">
          <p className="text-3xl mb-1">Tasks Failed to Generate</p>
          <div className="w-60 h-px bg-gray-300 mb-2" />
          <p>{error.message}</p>
        </Overlay>
      </>
    );

  const taskData = data?.data || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapTask = (data: any): Task => {
    return {
      interactionId: data.id,
      targetState: data.target_state,
    };
  };
  const playerTasks: Task[] = taskData.map(mapTask);

  return (
    <Overlay className="inset-x-16 inset-y-16">
      <p className="text-3xl mb-1">Your Tasks</p>
      <div className="w-60 h-px bg-gray-300 mb-2" />
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

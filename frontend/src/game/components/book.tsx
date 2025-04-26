import { Select } from "@react-three/postprocessing";
import { GameFlow, useGameStore } from "../../store";
import { Interactions } from "../types/interactions";
import Tooltip from "./tooltip";
import { BookActiveModel } from "../models/book-active-model";

interface BookProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

const Book = ({ position, rotation }: BookProps) => {
  const interactions = useGameStore((s) => s.gameState.interactions);
  const flow = useGameStore((s) => s.flow);
  const interaction = interactions?.find(
    (interaction) => interaction.id === "book",
  );
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );

  console.log(interaction);
  if (!interaction) {
    return <></>;
  }

  const isHovering = activeSelection === interaction.id;
  const data = Interactions[interaction.id];
  let message = "";
  if (flow === GameFlow.Game) {
    message = interaction.active
      ? data.deactivateMessage
      : data.activateMessage;
  } else {
    message = data.description;
  }

  return (
    <Select enabled={isHovering}>
      <group position={position} rotation={rotation}>
        <group name={interaction.id}>
          {interaction.active && <BookActiveModel />}
          {!interaction.active && <BookActiveModel />}
          {/* {!interaction.active && <BookActiveModel />} */}
          {/* {!interaction.active && <PhoneInactiveModel />} */}
        </group>
        {isHovering && <Tooltip position={[0, 5, 0]}>{message}</Tooltip>}
      </group>
    </Select>
  );
};

export default Book;

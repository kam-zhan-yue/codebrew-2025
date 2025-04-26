import { Select } from "@react-three/postprocessing";
import { GameFlow, useGameStore } from "../../store";
import { Interactions } from "../types/interactions";
import Tooltip from "./tooltip";
import { PaperActiveModel } from "../models/paper-active-model";
import { PaperInactiveModel } from "../models/paper-inactive-model";

interface PaperProps {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
}

const Paper = ({ position, rotation, scale }: PaperProps) => {
    const interactions = useGameStore((s) => s.gameState.interactions);
    const flow = useGameStore((s) => s.flow);
    const paper = interactions?.find((interaction) => interaction.id === "paper");
    const activeSelection = useGameStore(
        (s) => s.uiState.selection.activeSelection,
    );

    if (!paper) {
        return <></>;
    }

    const isHovering = activeSelection === paper.id;
    const data = Interactions[paper.id];
    let message = "";
    if (flow === GameFlow.Game) {
        message = paper.active ? data.deactivateMessage : data.activateMessage;
    } else {
        message = data.description;
    }

    return (
        <Select enabled={isHovering}>
            <group position={position} rotation={rotation} scale={scale}>
                <group name={paper.id}>
                    {paper.active && <PaperActiveModel />}
                    {!paper.active && <PaperInactiveModel />}
                </group>
                {isHovering && <Tooltip position={[0, 0.8, 0]}>{message}</Tooltip>}
            </group>
        </Select>
    );
};

export default Paper;
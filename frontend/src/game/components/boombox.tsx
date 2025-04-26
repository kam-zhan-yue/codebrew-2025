import { Select } from "@react-three/postprocessing";
import { GameFlow, useGameStore } from "../../store";
import { Interactions } from "../types/interactions";
import Tooltip from "./tooltip";
import { BoomboxModel } from "../models/boombox-model";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

interface BoomboxProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

const Boombox = ({ position, rotation, scale }: BoomboxProps) => {
  const { camera } = useThree();
  const playing = useRef<boolean>(false);
  const interactions = useGameStore((s) => s.gameState.interactions);
  const flow = useGameStore((s) => s.flow);
  const boombox = interactions?.find(
    (interaction) => interaction.id === "boombox",
  );
  const activeSelection = useGameStore(
    (s) => s.uiState.selection.activeSelection,
  );

  const musicSoundRef = useRef<THREE.Audio | null>(null);

  useEffect(() => {
    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    const musicSound = new THREE.Audio(listener);
    audioLoader.load("/sounds/rickroll.mp3", (buffer) => {
      musicSound.setBuffer(buffer);
      musicSound.setVolume(0.5);
      musicSound.setLoop(true);
      musicSoundRef.current = musicSound; // Store the sound in the ref
    });
    camera.add(listener);
  }, [camera]);

  const playMusic = useCallback(() => {
    if (musicSoundRef.current) {
      musicSoundRef.current?.play();
    }
  }, []);

  const stopMusic = useCallback(() => {
    if (musicSoundRef.current) {
      musicSoundRef.current?.pause();
    }
  }, []);

  useEffect(() => {
    if (boombox) {
      const active = boombox.active;
      // If the boombox turned active and we are not playing, then play
      if (active && !playing.current) {
        playing.current = true;
        playMusic();
      } else if (!active && playing.current) {
        playing.current = false;
        stopMusic();
      }
    }
  }, [boombox, playMusic, stopMusic]);

  if (!boombox) {
    return <></>;
  }

  const isHovering = activeSelection === boombox.id;
  const data = Interactions[boombox.id];
  let message = "";
  if (flow === GameFlow.Game) {
    message = boombox.active ? data.deactivateMessage : data.activateMessage;
  } else {
    message = data.description;
  }

  return (
    <Select enabled={isHovering}>
      <group position={position} rotation={rotation} scale={scale}>
        <group name={boombox.id}>
          <BoomboxModel />
        </group>
        {isHovering && <Tooltip position={[0, 1.8, 0]}>{message}</Tooltip>}
      </group>
    </Select>
  );
};

export default Boombox;

import Player from "./player";
import Gameboy from "./gameboy";
import { RoomModel } from "../models/room-model";

const Level = () => {
  return (
    <>
      <RoomModel position={[0, 0, 0]} scale={0.5} />
      <Gameboy position={[0, 1, 0]} rotation={[0, 0, 0]} />
      <Player />
    </>
  );
};

export default Level;

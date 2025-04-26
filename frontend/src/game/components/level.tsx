import Player from "./player";
import Gameboy from "./gameboy";
import { RoomModel } from "../models/room-model";
import Book from "./book";
import Ds from "./ds";
import Phone from "./phone";

const Level = () => {
  return (
    <>
      <RoomModel position={[0, 0, 0]} scale={0.5} />
      <Book position={[2.3, 1.2, 4.4]} rotation={[0, 0, 0]} scale={0.5} />
      <Ds position={[2.8, 1.6, 0]} rotation={[0, 0, 0]} scale={0.5} />
      <Phone position={[-0.2, 1.2, 5.1]} rotation={[0, 0, 0]} scale={0.5} />
      <Gameboy position={[0, 1, 0]} rotation={[0, 0, 0]} />
      <Player />
    </>
  );
};

export default Level;

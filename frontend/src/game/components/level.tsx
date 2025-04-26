import Player from "./player";
import Gameboy from "./gameboy";
import Television from "./television";
import Paper from "./paper";
import Boombox from "./boombox";
import { RoomModel } from "../models/room-model";
import Book from "./book";
import Ds from "./ds";
import Phone from "./phone";
import Lamp from "./lamp";

const Level = () => {
  return (
    <>
      <RoomModel position={[0, 0, 0]} scale={0.5} />
      <Lamp position={[2.8, 1.45, -4.2]} rotation={[0, 0, 0]} scale={0.5} />
      <Book position={[2.4, 1.22, 4.4]} rotation={[0, 0, 0]} scale={0.5} />
      <Ds position={[2.8, 1.6, 0]} rotation={[0, 0, 0]} scale={0.5} />
      <Phone position={[-0.2, 1.2, 5.1]} rotation={[0, 0, 0]} scale={0.5} />
      <Gameboy position={[0, 1, 0]} rotation={[0, 0, 0]} />
      <Television position={[-2.7, 1, -4.1]} rotation={[0, 0, 0]} scale={0.5} />
      <Paper position={[2, 1.48, -4]} rotation={[0, 0, 0]} scale={0.5} />
      <Boombox position={[-0.6, 1.67, -4.6]} rotation={[0, 0, 0]} scale={0.5} />
      <Player />
    </>
  );
};

export default Level;

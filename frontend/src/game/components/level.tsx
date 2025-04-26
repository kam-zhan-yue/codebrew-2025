import Player from "./player";
import { EnvironmentModel } from "../models/environment-model";
import Gameboy from "./gameboy";

const Level = () => {
  return (
    <>
      <EnvironmentModel />
      <Gameboy position={[0, 1, 0]} rotation={[0, 0, 0]} />
      <Player />
    </>
  );
};

export default Level;

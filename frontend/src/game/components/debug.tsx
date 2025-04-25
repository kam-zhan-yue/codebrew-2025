import Overlay from "../../components/overlay";
import { useGameStore } from "../../store";
import * as THREE from "three";

const Debug = () => {
  const debugState = useGameStore((s) => s.uiState.debug);
  const raycastHit = debugState?.raycastData?.object;
  const playerId = useGameStore((s) => s.playerId);
  const getObjectHierarchy = (obj: THREE.Object3D | null | undefined) => {
    const names = [];
    let current = obj;
    while (current) {
      names.unshift(current.name || current.type);
      current = current.parent;
    }
    return names.join(" > ");
  };

  return (
    <Overlay>
      <div style={{ fontFamily: "monospace", lineHeight: "1.5" }}>
        <h1>Debug Data</h1>
        <div>
          <strong>Player ID </strong>
          {playerId}
        </div>
        {raycastHit ? (
          <>
            <div>
              <strong>Name:</strong> {raycastHit.name || "(unnamed)"}
            </div>
            <div>
              <strong>Type:</strong> {raycastHit.type}
            </div>
            <div>
              <strong>Position:</strong>{" "}
              {raycastHit.position
                ? `${raycastHit.position.x.toFixed(2)}, ${raycastHit.position.y.toFixed(2)}, ${raycastHit.position.z.toFixed(2)}`
                : "N/A"}
            </div>
            <div>
              <strong>Hierarchy:</strong> {getObjectHierarchy(raycastHit)}
            </div>
            <div>
              <strong>Main Object: {raycastHit?.name}</strong>
            </div>
          </>
        ) : (
          <div>No raycast hit detected.</div>
        )}
      </div>
    </Overlay>
  );
};

export default Debug;

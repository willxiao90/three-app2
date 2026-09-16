import { useMemo } from "react";
import { RigidBody, ConeCollider } from "@react-three/rapier";

const CONE_RADIUS = 0.3;
const CONE_HEIGHT = 0.8;
const CONE_COUNT = 20;
const SPACING = 1;
const START_X = -9;
const FIXED_Z = 90;

function Cone({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody colliders={false} position={position} restitution={0.5}>
      <mesh>
        <coneGeometry args={[CONE_RADIUS, CONE_HEIGHT, 12]} />
        <meshStandardMaterial color="#FF6600" />
      </mesh>
      <ConeCollider args={[CONE_HEIGHT / 2, CONE_RADIUS]} />
    </RigidBody>
  );
}

export function TrafficCones(props: React.ComponentProps<"group">) {
  const positions = useMemo(() => {
    return Array.from(
      { length: CONE_COUNT },
      (_, i): [number, number, number] => [
        START_X + i * SPACING,
        CONE_HEIGHT / 2,
        FIXED_Z,
      ],
    );
  }, []);

  return (
    <group {...props}>
      {positions.map((pos, i) => (
        <Cone key={i} position={pos} />
      ))}
    </group>
  );
}

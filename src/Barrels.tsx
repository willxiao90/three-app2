import { useMemo } from "react";
import { RigidBody, CylinderCollider } from "@react-three/rapier";
import { Color } from "three";

const BARREL_COUNT = 10;
const BARREL_RADIUS = 0.6;
const BARREL_HEIGHT = 1.2;
const CIRCLE_RADIUS = 5;
const CENTER_X = 30;
const CENTER_Z = 0;

function Barrel({
  position,
  color,
}: {
  position: [number, number, number];
  color: Color;
}) {
  return (
    <RigidBody position={position} colliders={false} restitution={0.2}>
      <mesh>
        <cylinderGeometry
          args={[BARREL_RADIUS, BARREL_RADIUS, BARREL_HEIGHT, 16]}
        />
        <meshStandardMaterial color={color} />
      </mesh>
      <CylinderCollider args={[BARREL_HEIGHT / 2, BARREL_RADIUS]} />
    </RigidBody>
  );
}

export function Barrels(props: React.ComponentProps<"group">) {
  const data = useMemo(() => {
    return Array.from({ length: BARREL_COUNT }, (_, i) => {
      const angle = (i / BARREL_COUNT) * Math.PI * 2;
      const x = CENTER_X + CIRCLE_RADIUS * Math.cos(angle);
      const z = CENTER_Z + CIRCLE_RADIUS * Math.sin(angle);
      const hue = (i / BARREL_COUNT) * 0.1 + 0.05;
      return {
        position: [x, BARREL_HEIGHT / 2, z] as [number, number, number],
        color: new Color().setHSL(hue, 0.8, 0.45),
      };
    });
  }, []);

  return (
    <group {...props}>
      {data.map((d, i) => (
        <Barrel key={i} position={d.position} color={d.color} />
      ))}
    </group>
  );
}

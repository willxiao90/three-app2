import { useMemo } from "react";
import { RigidBody, BallCollider } from "@react-three/rapier";
import { Color } from "three";
import { seededRandom } from "./utils";

const SPHERE_COUNT = 30;
const SPHERE_RADIUS = 0.8;

function Sphere({
  position,
  color,
}: {
  position: [number, number, number];
  color: Color;
}) {
  return (
    <RigidBody
      colliders={false}
      position={position}
      restitution={0.8}
      gravityScale={0.3}
    >
      <mesh>
        <sphereGeometry args={[SPHERE_RADIUS, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <BallCollider args={[SPHERE_RADIUS]} />
    </RigidBody>
  );
}

export function Spheres(props: React.ComponentProps<"group">) {
  const data = useMemo(() => {
    const rand = seededRandom(123);
    return Array.from({ length: SPHERE_COUNT }, (_, i) => {
      const x = (rand() - 0.5) * 240;
      const z = (rand() - 0.5) * 240;
      const hue = rand();
      return {
        key: i,
        position: [x, SPHERE_RADIUS, z] as [number, number, number],
        color: new Color().setHSL(hue, 0.6, 0.55),
      };
    });
  }, []);

  return (
    <group {...props}>
      {data.map((d) => (
        <Sphere key={d.key} position={d.position} color={d.color} />
      ))}
    </group>
  );
}

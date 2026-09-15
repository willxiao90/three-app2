import type { ThreeElements } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

const RAMP_LENGTH = 8;
const RAMP_WIDTH = 6;
const RAMP_THICKNESS = 0.1;
const TILT_ANGLE = Math.PI / 16;
const GAP = 4;

const horizontalProjection = RAMP_LENGTH * Math.cos(TILT_ANGLE);
const peakHeight = RAMP_LENGTH * Math.sin(TILT_ANGLE);

const leftRampX = -GAP / 2 - horizontalProjection / 2;
const rightRampX = GAP / 2 + horizontalProjection / 2;
const rampY = peakHeight / 2;

export function Bridge(props: ThreeElements["group"]) {
  return (
    <group {...props}>
      <RigidBody type="fixed">
        <mesh
          castShadow
          position={[leftRampX, rampY, 0]}
          rotation={[0, 0, TILT_ANGLE]}
        >
          <boxGeometry args={[RAMP_LENGTH, RAMP_THICKNESS, RAMP_WIDTH]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed">
        <mesh
          castShadow
          position={[rightRampX, rampY, 0]}
          rotation={[0, 0, -TILT_ANGLE]}
        >
          <boxGeometry args={[RAMP_LENGTH, RAMP_THICKNESS, RAMP_WIDTH]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>
    </group>
  );
}

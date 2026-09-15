import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
import { OrbitControls } from "@react-three/drei";

const LERP_SPEED = 5;
const STOP_THRESHOLD = 0.3;

export function CameraFollow({
  carBody,
}: {
  carBody: React.RefObject<RapierRigidBody>;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  const CAMERA_OFFSET = useMemo(() => new Vector3(20, 20, 20), []);
  const _targetPos = useRef(new Vector3());
  const _lookAtPos = useRef(new Vector3());

  useFrame((_, delta) => {
    const body = carBody.current;
    if (!body) return;

    const vel = body.linvel();
    const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
    const isMoving = speed > STOP_THRESHOLD;

    if (controlsRef.current) {
      controlsRef.current.enabled = !isMoving;
    }

    if (isMoving) {
      const pos = body.translation();

      _targetPos.current.copy(pos).add(CAMERA_OFFSET);

      camera.position.lerp(_targetPos.current, LERP_SPEED * delta);

      _lookAtPos.current.set(pos.x, pos.y, pos.z);
      camera.lookAt(_lookAtPos.current);
    }

    if (controlsRef.current) {
      const pos = body.translation();
      controlsRef.current.target.set(pos.x, pos.y, pos.z);
    }
  });

  return <OrbitControls ref={controlsRef} enableZoom={false} />;
}

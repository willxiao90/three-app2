import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { Vector3, Quaternion } from "three";
import { useKeyboardControls } from "@react-three/drei";
import { type Controls } from "./App";

const ENGINE_FORCE = 200;
const REVERSE_FORCE = 100;
const TURN_SPEED = 2.0;

export function CarController({
  carBody,
}: {
  carBody: React.RefObject<RapierRigidBody>;
}) {
  const keys = useRef({
    forward: false,
    back: false,
    left: false,
    right: false,
  });
  const [sub] = useKeyboardControls<Controls>();

  useEffect(() => {
    return sub(
      (state) => state,
      (state) => {
        keys.current = state;
      },
    );
  }, [sub]);

  const _forward = useMemo(() => new Vector3(), []);
  const _quat = useMemo(() => new Quaternion(), []);

  useFrame((_, delta) => {
    const body = carBody.current;
    if (!body) return;

    const { forward, back, left, right } = keys.current;

    const rot = body.rotation();
    _quat.set(rot.x, rot.y, rot.z, rot.w);
    _forward.set(0, 0, 1).applyQuaternion(_quat);

    if (forward) {
      body.applyImpulse(
        {
          x: _forward.x * ENGINE_FORCE * delta,
          y: _forward.y * ENGINE_FORCE * delta,
          z: _forward.z * ENGINE_FORCE * delta,
        },
        true,
      );
    }
    if (back) {
      body.applyImpulse(
        {
          x: -_forward.x * REVERSE_FORCE * delta,
          y: -_forward.y * REVERSE_FORCE * delta,
          z: -_forward.z * REVERSE_FORCE * delta,
        },
        true,
      );
    }

    if (left) {
      body.setAngvel({ x: 0, y: TURN_SPEED, z: 0 }, true);
    } else if (right) {
      body.setAngvel({ x: 0, y: -TURN_SPEED, z: 0 }, true);
    } else {
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  return null;
}

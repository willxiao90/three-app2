import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { MathUtils, Vector3, Group } from "three";
import { type CarRef } from "./Car";

const TIRE_RADIUS = 0.3;
const TURN_SPEED = 2.0;
const MAX_TURN_ANGLE = Math.PI / 6;

export function WheelRotation({
  carBody,
  carRef,
}: {
  carBody: React.RefObject<RapierRigidBody>;
  carRef: React.RefObject<CarRef>;
}) {
  const backWheel = useRef<Group>(null!);
  const frontLeftWheel = useRef<Group>(null!);
  const frontRightWheel = useRef<Group>(null!);
  const targetSteerAngle = useRef(0);
  const currentSteerAngle = useRef(0);

  const _vel = useMemo(() => new Vector3(), []);

  useEffect(() => {
    const refs = carRef.current;
    if (!refs) return;
    backWheel.current = refs.backWheel.current;
    frontLeftWheel.current = refs.frontLeftWheel.current;
    frontRightWheel.current = refs.frontRightWheel.current;
  }, [carRef]);

  useFrame((_, delta) => {
    const body = carBody.current;
    if (!body) return;

    const bw = backWheel.current;
    const flw = frontLeftWheel.current;
    const frw = frontRightWheel.current;
    if (!bw || !flw || !frw) return;

    // Get velocity from physics
    const vel = body.linvel();
    _vel.set(vel.x, vel.y, vel.z);
    const speed = _vel.length();

    // Wheel rolling rotation (around local X axis)
    const rollSpeed = speed / TIRE_RADIUS;
    bw.rotation.x -= rollSpeed * delta;
    flw.rotation.x -= rollSpeed * delta;
    frw.rotation.x -= rollSpeed * delta;

    // Front wheel steering (around local Y axis)
    const angvel = body.angvel();
    const steerInput = angvel.y / TURN_SPEED;
    targetSteerAngle.current = MathUtils.clamp(
      steerInput * MAX_TURN_ANGLE,
      -MAX_TURN_ANGLE,
      MAX_TURN_ANGLE,
    );

    // Smooth steering interpolation
    currentSteerAngle.current = MathUtils.lerp(
      currentSteerAngle.current,
      targetSteerAngle.current,
      10 * delta,
    );

    flw.rotation.y = currentSteerAngle.current;
    frw.rotation.y = currentSteerAngle.current;
  });

  return null;
}

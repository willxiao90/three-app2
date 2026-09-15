import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Mesh,
  CanvasTexture,
  Group,
  Quaternion,
  Euler,
  MeshBasicMaterial,
} from "three";
import { RapierRigidBody } from "@react-three/rapier";

const SHADOW_WIDTH = 2;
const SHADOW_HEIGHT = 4;
const BASE_OPACITY = 0.4;

interface CarShadowProps {
  carBody: React.RefObject<RapierRigidBody>;
}

function createGradientTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createRadialGradient(128, 64, 0, 128, 64, 128);
  gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
  gradient.addColorStop(0.4, "rgba(0, 0, 0, 0.6)");
  gradient.addColorStop(0.7, "rgba(0, 0, 0, 0.2)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 128);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function CarShadow({ carBody }: CarShadowProps) {
  const meshRef = useRef<Mesh>(null!);
  const groupRef = useRef<Group>(null!);

  const texture = useMemo(() => createGradientTexture(), []);
  const _quat = useMemo(() => new Quaternion(), []);
  const _euler = useMemo(() => new Euler(), []);

  useFrame(() => {
    const body = carBody.current;
    if (!body || !meshRef.current) return;

    const { x, y, z } = body.translation();
    const rot = body.rotation();

    _quat.set(rot.x, rot.y, rot.z, rot.w);
    _euler.setFromQuaternion(_quat, "YXZ");

    groupRef.current.position.set(x, 0.01, z);
    groupRef.current.rotation.y = _euler.y;

    const mat = meshRef.current.material as MeshBasicMaterial;
    mat.opacity = BASE_OPACITY - y * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 0.01, 0]} renderOrder={-1}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[SHADOW_WIDTH, SHADOW_HEIGHT]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={BASE_OPACITY}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

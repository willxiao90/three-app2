import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Mesh } from "three";

const MODEL_PATHS = [
  "/models/Apatosaurus.glb",
  "/models/Parasaurolophus.glb",
  "/models/Stegosaurus.glb",
  "/models/T-Rex.glb",
  "/models/Triceratops.glb",
  "/models/Velociraptor.glb",
] as const;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function ModelInstance({
  path,
  position,
}: {
  path: string;
  position: [number, number, number];
}) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) child.castShadow = true;
    });
  }, [scene]);

  return (
    <RigidBody type="fixed">
      <group position={position}>
        <primitive object={scene} />
      </group>
    </RigidBody>
  );
}

export function Models() {
  const positions = useMemo(() => {
    const rand = seededRandom(42);
    return MODEL_PATHS.map<[number, number, number]>(() => [
      (rand() - 0.5) * 300,
      0,
      (rand() - 0.5) * 300,
    ]);
  }, []);

  return (
    <group>
      {MODEL_PATHS.map((path, i) => (
        <ModelInstance key={path} path={path} position={positions[i]} />
      ))}
    </group>
  );
}

MODEL_PATHS.forEach((path) => useGLTF.preload(path));

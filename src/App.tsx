import { useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  KeyboardControls,
  type KeyboardControlsEntry,
} from "@react-three/drei";
import {
  Physics,
  RigidBody,
  CuboidCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { Model as Car, type CarRef } from "./Car";
import { CarShadow } from "./CarShadow";
import { Pyramid } from "./Pyramid";
import { WheelRotation } from "./WheelRotation";
import { CarController } from "./CarController";
import { CameraFollow } from "./CameraFollow";
import { Models as Dinosaurs } from "./Dinosaurs";
import { Barrels } from "./Barrels";
import { TrafficCones } from "./TrafficCones";
import { Bridge } from "./Bridge";
import "./App.css";

const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
} as const;

export type Controls = (typeof Controls)[keyof typeof Controls];

export default function App() {
  const carBody = useRef<RapierRigidBody>(null!);
  const carRef = useRef<CarRef>(null!);

  const keyMap = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    ],
    [],
  );

  return (
    <Canvas shadows camera={{ position: [20, 20, 20], fov: 50 }}>
      <Perf />

      <color args={["#A1C1CD"]} attach="background" />
      <ambientLight intensity={2} />
      <directionalLight
        position={[0, 80, 0]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-250}
        shadow-camera-right={250}
        shadow-camera-top={250}
        shadow-camera-bottom={-250}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
      />

      <KeyboardControls map={keyMap}>
        <Physics debug={false}>
          <RigidBody ref={carBody}>
            <Car ref={carRef} />
          </RigidBody>

          <CarController carBody={carBody} />
          <WheelRotation carBody={carBody} carRef={carRef} />
          <CameraFollow carBody={carBody} />
          <CarShadow carBody={carBody} />

          <Pyramid position={[-20, 0, 0]} />
          <Dinosaurs />
          <Barrels />
          <TrafficCones />
          <Bridge position={[0, 0, 30]} rotation-y={-Math.PI / 2} />

          <RigidBody type="fixed">
            <CuboidCollider args={[0.5, 2.5, 250]} position={[-250, 2.5, 0]} />
          </RigidBody>
          <RigidBody type="fixed">
            <CuboidCollider args={[0.5, 2.5, 250]} position={[250, 2.5, 0]} />
          </RigidBody>
          <RigidBody type="fixed">
            <CuboidCollider args={[250, 2.5, 0.5]} position={[0, 2.5, -250]} />
          </RigidBody>
          <RigidBody type="fixed">
            <CuboidCollider args={[250, 2.5, 0.5]} position={[0, 2.5, 250]} />
          </RigidBody>

          <RigidBody type="fixed" friction={1}>
            <mesh
              position={[0, -0.2, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              receiveShadow
            >
              <boxGeometry args={[500, 500, 0.4]} />
              <meshStandardMaterial color="#667C49" />
            </mesh>
          </RigidBody>
        </Physics>
      </KeyboardControls>
    </Canvas>
  );
}

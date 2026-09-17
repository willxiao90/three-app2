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
import { Blocks } from "./Blocks";
import { WheelRotation } from "./WheelRotation";
import { CarController } from "./CarController";
import { CameraFollow } from "./CameraFollow";
import { Models as Dinosaurs } from "./Dinosaurs";
import { Barrels } from "./Barrels";
import { TrafficCones } from "./TrafficCones";
import { Bridge } from "./Bridge";
import { Balls } from "./Balls";
import { ControlsHint } from "./ControlsHint";
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
    <div className="app-container">
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
          shadow-camera-left={-200}
          shadow-camera-right={200}
          shadow-camera-top={200}
          shadow-camera-bottom={-200}
          shadow-camera-near={0.5}
          shadow-camera-far={200}
        />

        <KeyboardControls map={keyMap}>
          <Physics debug={false}>
            {/* 小车 */}
            <RigidBody ref={carBody}>
              <Car ref={carRef} />
            </RigidBody>

            {/* 车辆伪阴影 */}
            <CarShadow carBody={carBody} />

            {/* 车辆控制 */}
            <CarController carBody={carBody} />
            <WheelRotation carBody={carBody} carRef={carRef} />
            <CameraFollow carBody={carBody} />

            {/* 各种障碍物 */}
            <Blocks position={[-20, 0, 0]} />
            <Barrels />
            <Balls />
            <TrafficCones />
            <Bridge position={[0, 0, 30]} rotation-y={-Math.PI / 2} />

            {/* 恐龙模型 */}
            <Dinosaurs />

            {/* 围墙 */}
            <RigidBody type="fixed">
              <CuboidCollider
                args={[0.5, 2.5, 200]}
                position={[-200, 2.5, 0]}
                restitution={0}
              />
            </RigidBody>
            <RigidBody type="fixed">
              <CuboidCollider
                args={[0.5, 2.5, 200]}
                position={[200, 2.5, 0]}
                restitution={0}
              />
            </RigidBody>
            <RigidBody type="fixed">
              <CuboidCollider
                args={[200, 2.5, 0.5]}
                position={[0, 2.5, -200]}
                restitution={0}
              />
            </RigidBody>
            <RigidBody type="fixed">
              <CuboidCollider
                args={[200, 2.5, 0.5]}
                position={[0, 2.5, 200]}
                restitution={0}
              />
            </RigidBody>

            {/* 地板 */}
            <RigidBody type="fixed" friction={1}>
              <mesh
                position={[0, -0.2, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
              >
                <boxGeometry args={[400, 400, 0.4]} />
                <meshStandardMaterial color="#667C49" />
              </mesh>
            </RigidBody>
          </Physics>
        </KeyboardControls>
      </Canvas>

      <ControlsHint />
    </div>
  );
}

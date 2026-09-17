import React, { useEffect, useMemo, useRef } from "react";
import { InstancedRigidBodies } from "@react-three/rapier";
import { Color, InstancedMesh } from "three";

const BLOCK_SIZE = 0.4;
const BASE = 10;
const GAP = 0.4;
const TOTAL = (BASE * (BASE + 1) * (2 * BASE + 1)) / 6;

function generatePyramidBlocks() {
  const blocks: {
    position: [number, number, number];
    color: Color;
  }[] = [];

  for (let y = 0; y < BASE; y++) {
    const layerSize = BASE - y;
    const offset = ((layerSize - 1) * GAP) / 2;

    for (let x = 0; x < layerSize; x++) {
      for (let z = 0; z < layerSize; z++) {
        const hue = Math.random();
        const color = new Color().setHSL(hue, 0.75, 0.5);
        const position: [number, number, number] = [
          x * GAP - offset,
          y * GAP + BLOCK_SIZE / 2,
          z * GAP - offset,
        ];
        blocks.push({ position, color });
      }
    }
  }

  return blocks;
}

export function Blocks(props: React.ComponentProps<"group">) {
  const blocks = useMemo(() => generatePyramidBlocks(), []);
  const meshRef = useRef<InstancedMesh>(null);

  const instances = useMemo(
    () =>
      blocks.map((block, i) => ({
        key: `block_${i}`,
        position: block.position,
      })),
    [blocks],
  );

  useEffect(() => {
    if (!meshRef.current) return;
    blocks.forEach((block, i) => {
      meshRef.current!.setColorAt(i, block.color);
    });
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [blocks]);

  return (
    <group {...props}>
      <InstancedRigidBodies instances={instances}>
        <instancedMesh ref={meshRef} args={[undefined, undefined, TOTAL]}>
          <boxGeometry args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} />
          <meshStandardMaterial />
        </instancedMesh>
      </InstancedRigidBodies>
    </group>
  );
}

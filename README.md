# three-app2

一个基于 Three.js 的 3D 物理模拟应用，可以控制小车撞击各种障碍物。

[在线预览](https://willxiao90.github.io/three-app2/)

## 技术栈

- **React 19** + **TypeScript** — 前端框架
- **Three.js** / **@react-three/fiber** — 3D 渲染
- **@react-three/rapier** — 物理引擎（Rapier）
- **@react-three/drei** — 常用 3D 工具组件
- **Vite** — 构建工具

## 功能特性

- 基于 Rapier 引擎的刚体物理模拟
- 键盘控制小车行驶，以及相机自动跟随
- 各种类型的障碍物：积木堆、桥梁、交通锥、油桶、皮球
- 为场景物体和车辆添加阴影

## 安装与运行

```bash
npm install
npm run dev
```

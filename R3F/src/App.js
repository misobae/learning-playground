import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { easing } from "maath";
import * as THREE from 'three';

import { Model } from './components/Scene';

function App() {
  return (
    <>
      {/* camera 종류
        (defualt) perspective: 1인칭 시점에서 관찰
        orthographic: 완전한 3인칭 시점에서 관찰
       */}
      <Canvas
        camera={{ position: [0, 0, 0], fov: 10 }}
      >
        {/* ambientLight: 방향이 없고 scene 전체에 균일하게 적용되는 빛. 즉, 그림자가 없음  */}
        <ambientLight intensity={1} color="#ffffff" />
        
        {/* position: 빛의 위치, angle: 빛의 각도, penumbra: 부분 그림자의 강도 */}
        {/* <spotLight position={[0.6, 0.8, 0.5]} angle={2.6} penumbra={1} /> */}

        {/* 하나의 지점에서 모든 방향으로 빛을 쐬주는 light
          빛이 어디에서 시작했는지 모르기 때문에 빛을 쏘는 방향이 없음(전구 처럼)
          distance: 빛의 영향 범위 */}
        {/* <pointLight
          position={[0.3, 0.2, 0.6]}
          color={"#fff"}
          intensity={3}
          distance={3}
        /> */}

        <Float rotationIntensity={0.5} floatIntensity={0.35} speed={2.8}>
            <Model
              rotation-x={0.1}
              rotation-y={3.6}
              scale={3}
            />
        </Float>

        <Rig />
        <Lights />
      </Canvas>
    </>
  );
}

function Rig() {
  // useFrame: 각 프레임마다 실행할 함수를 등록.
  // Three.js의 requestAnimationFrame 루프 내에서 동작
  // 애니메이션, 오브젝트의 위치/회전/크기 변경 등을 수행할 수 있음
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position, // 대상이 되는 벡터 (카메라의 위치)
      [Math.sin(-state.pointer.x) * 5, -state.pointer.y * 3.5, 15 + Math.cos(state.pointer.x) * 10], // 목표지점의 벡터(마우스 포인터의 위치)
      0.35, // 속도
      delta, // damping factor, delta: 프레임간의 시간 간격
    );
    state.camera.lookAt(0, 0, 0);
  });
};

function Lights() {
  const group = useRef();
  const front = useRef();
  useFrame(({ pointer }) => {
    // THREE.MathUtils.lerp(start, end, alpha);
    // 두 개의 값 사이를 선형 보간하여 새로운 값을 계산하는 함수
    // 선형 보간(linear interpolation): 두 점 사이의 직선 경로에서의 점을 찾는 것
    
    // easing.damp3()와 차이점
    //THREE.MathUtils.lerp()는 간단한 보간에 사용하고,
    // easing.damp3()는 목표 값 및 현재 속도를 기반으로 값을 보간해 물리적 모션에 사용하는데 유용함
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * (Math.PI / 2), 0.1);
    front.current.position.x = THREE.MathUtils.lerp(front.current.position.x, pointer.x * 12, 0.05);
    front.current.position.y = THREE.MathUtils.lerp(front.current.position.y, 2 + pointer.y * 4, 0.05);
  });

  return (
    <>
      <group ref={group}>
        <pointLight
          position={[0.3, 0.2, 0.6]}
          distance={15}
          intensity={1}
        />
      </group>

      <spotLight
        castShadow
        ref={front}
        penumbra={0.75}
        angle={Math.PI / 4}
        position={[10, 50, 8]}
        distance={10}
        intensity={10}
        shadow-mapSize={[2048, 2048]}
      />
    </>
  )
};

export default App;
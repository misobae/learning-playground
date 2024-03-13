import React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Model } from './components/Scene'
import { easing } from "maath"

function App() {
  return (
    <>
      {/* camera 종류
        (defualt) perspective: 1인칭 시점에서 관찰
        orthographic: 완전한 3인칭 시점에서 관찰
       */}
      <Canvas
        camera={{ position: [0, 0, 0], fov: 10 }}
        style={{ height: "100vh"}}
      >
        {/* ambientLight: 방향이 없고 scene 전체에 균일하게 적용되는 빛. 즉, 그림자가 없음  */}
        <ambientLight intensity={1} color="#ffffff" />
        
        {/* position: 빛의 위치, angle: 빛의 각도, penumbra: 부분 그림자의 강도 */}
        <spotLight position={[0.6, 0.8, 0.5]} angle={0.02} penumbra={5} />

        {/* 하나의 지점에서 모든 방향으로 빛을 쐬주는 light
          빛이 어디에서 시작했는지 모르기 때문에 빛을 쏘는 방향이 없음(전구 처럼)
          distance: 빛의 영향 범위 */}
        <pointLight
          position={[0.3, 0.2, 0.6]}
          color={"#fff"}
          intensity={3}
          distance={3}
        />

        <group
          rotation-y={3.6}
          scale={3}
        >
          <Model/>
        </group>

        <Rig />
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
      0.3,
      delta, // damping factor, delta: 프레임간의 시간 간격
    )
    state.camera.lookAt(0, 0, 0)
  })
}


export default App;

import { Plane } from "@react-three/drei";

const Stage = (): JSX.Element => {
    return (
        <>
            <color attach="background" args={[0x72645b]} />
            <fog color={0x72645b} near={2} far={1500}></fog>
            <ambientLight color={0xffffff}></ambientLight>
            <hemisphereLight args={[0x443333, 0x111122]}></hemisphereLight>
            <directionalLight
                position={[0.5, 1, -1]}
                castShadow
                shadow-camera-left={-1}
                shadow-camera-right={1}
                shadow-camera-top={1}
                shadow-camera-bottom={-1}
                shadow-camera-near={1}
                shadow-camera-far={400}
                shadow-bias={-0.002}
            ></directionalLight>
            <Plane args={[10000, 10000]} rotation-x={-Math.PI / 2} position-y={-200} receiveShadow>
                <meshPhongMaterial color={0x999999} specular={0x101010}></meshPhongMaterial>
            </Plane>
            <axesHelper args={[250]}></axesHelper>
        </>
    );
}

export default Stage;
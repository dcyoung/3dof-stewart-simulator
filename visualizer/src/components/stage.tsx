import { Plane } from "@react-three/drei";

const Stage = (): JSX.Element => {
    return (
        <>
            <color attach="background" args={['#f0f0f0']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[-10, 10, 5]} shadow-mapSize={[256, 256]} shadow-bias={-0.0001} castShadow>
                <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10]} />
            </directionalLight>
            <Plane args={[10000, 10000]} rotation-x={-Math.PI / 2} position-y={-200} receiveShadow>
                <meshPhongMaterial color={'#f0f0f0'} specular={0x101010}></meshPhongMaterial>
            </Plane>
            <axesHelper args={[250]}></axesHelper>
        </>
    );
}

export default Stage;
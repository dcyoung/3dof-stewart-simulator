import './App.css';
import { Canvas, useLoader } from "@react-three/fiber";
import { useControls } from 'leva';
import { Group, MeshBasicMaterial } from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import MESH_URL_BASE from "./components/skins/models/wheatley/skeleton.stl";
import { OrbitControls } from '@react-three/drei';

export declare interface SkinnedTestProps {
    mech: Group,
    condition: boolean
}

const SkinnedTest = ({
    mech, condition, ...props
}: SkinnedTestProps): JSX.Element => {
    console.log("Render Skinned...");
    const materialBase = useMemo(() => new MeshBasicMaterial({
        color: 0xf5f5f5
    }), []);
    const geomBase = useLoader(STLLoader, MESH_URL_BASE);
    return (
        <primitive object={mech}>
            <mesh material={materialBase}>
                <primitive object={geomBase} />
            </mesh>
        </primitive>
    );
}

const App = (): JSX.Element => {
    useEffect(() => { console.log("useEffect") }, []);
    const mech = new Group();
    // const { MyTest } = useControls({
    //     MyTest: true,
    // });
    const MyTest = true;
    console.log("Render App", mech.children);

    return (
        <Canvas shadows camera={{
            fov: 75,
            near: 0.1,
            far: 1000,
            position: [-75, 50, 50],
            up: [0, 1, 0],
        }}>
            <SkinnedTest mech={mech} condition={MyTest} />
            <OrbitControls></OrbitControls>
        </Canvas>
    );
}

export default App;
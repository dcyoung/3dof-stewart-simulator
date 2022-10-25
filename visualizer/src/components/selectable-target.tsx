import { useState } from 'react';
import create from 'zustand'
import { Object3D } from 'three';
import { useCursor } from '@react-three/drei';

interface SelectableTargetState {
    target: Object3D | null;
    setTarget: (target: Object3D | null) => void
}
export const useSelectableTargetStore = create<SelectableTargetState>((set) => ({ target: null, setTarget: (target) => set({ target }) }))

const SelectableTarget = ({ ...props }): JSX.Element => {
    const setTarget = useSelectableTargetStore((state) => state.setTarget)
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)
    return (
        <mesh {...props} onClick={(e) => setTarget(e.object)} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
            <sphereGeometry args={[5, 32, 32]} />
            <meshBasicMaterial color={"red"} />
        </mesh>
    )
}

export default SelectableTarget
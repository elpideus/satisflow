import {
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    ReactFlow,
    useNodesState,
    useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.scss';
import {CoalGeneratorNode} from "./nodes/CoalGeneratorNode.tsx";
import {MinerNode} from "./nodes/MinerNode.tsx";

const nodeTypes = {
    c: CoalGeneratorNode,
    miner: MinerNode
};

const initialNodes = [
    {id: "n1", type: "c", position: { x: 100, y: 100 }},
    {id: "n2", type: "miner", position: { x: 300, y: 100 }}
];

const initialEdges = [];

function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    return (
        <div className="satisflow-app">
            <ReactFlow
                colorMode="dark"
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                noWheelClassName="scrollPreventDefault"
                noDragClassName="dragPreventDefault"
            >
                <Background variant={BackgroundVariant.Dots} color="#2a2a2a" bgColor="#171717" gap={12} size={1} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}

export default App;
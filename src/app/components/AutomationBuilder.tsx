'use client';

import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  OnConnect,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useDnD } from '../contexts/DnDContext';
import Sidebar from './Sidebar';

import '@xyflow/react/dist/style.css';
import NodeModal from './modals/NodeModal';
import EmailNode from './nodes/EmailNode';
import './styles.css';

let id = 0;
const getId = () => `dndnode_${id++}`;

// list of possible node types
const nodeTypes: NodeTypes = {
  email: EmailNode,
};

const AutomationBuilder = () => {
  const reactFlowWrapper = useRef(null);

  const { screenToFlowPosition } = useReactFlow();
  const { type } = useDnD();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // we load the data from the server on mount
  useEffect(() => {
    const getData = async () => {
      const data = await fetch('/api/automation');
      const automation = await data.json();
      setNodes(automation.nodes);
      setEdges(automation.edges);
    };
    getData();
  }, [setNodes, setEdges]);

  // various callbacks
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => [...nds, newNode]);
      setCurrentNode({ id: newNode.id, name: newNode.data.label });
      setIsModalOpen(true);
    },
    [screenToFlowPosition, type, setNodes]
  );

  const handleModalSave = (name: string) => {
    if (currentNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === currentNode.id
            ? { ...node, data: { ...node.data, label: name } }
            : node
        )
      );
    }
    setCurrentNode(null);
  };

  return (
    <>
      <div className="automation-builder">
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            className="overview"
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
          >
            <MiniMap zoomable pannable />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        <Sidebar />
      </div>
      <NodeModal
        isOpen={isModalOpen}
        nodeName={currentNode?.name || ''}
        onSave={handleModalSave}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AutomationBuilder;

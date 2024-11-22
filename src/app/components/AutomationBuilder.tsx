'use client';

import { Box } from '@mui/material';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
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

import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import '@xyflow/react/dist/style.css';
import React from 'react';
import NodeModal from './modals/NodeModal';
import EmailNode from './nodes/EmailNode';
import './styles.css';

let id = 0;
const getId = () => `dndnode_${id++}`;

// list of possible node types
const nodeTypes: NodeTypes = {
  email: EmailNode,
};

const LOCAL_STORAGE_KEY = 'automation-builder';

const AutomationBuilder = () => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const { screenToFlowPosition } = useReactFlow();
  const { type, name } = useDnD();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [openSaveSnackbar, setOpenSaveSnackbar] = useState(false);
  const [msgSaveSnackbar, setMsgSaveSnackbar] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (savedData) {
          const { nodes: savedNodes, edges: savedEdges } =
            JSON.parse(savedData);
          setNodes(savedNodes);
          setEdges(savedEdges);
        } else {
          const res = await fetch('/api/automation');
          if (!res.ok) throw new Error('Failed to load automation data.');
          const automation = await res.json();
          setNodes(automation.nodes);
          setEdges(automation.edges);
        }
      } catch (error) {
        console.error(error);
        alert('Error loading automation data.');
      }
    };

    loadData();
  }, [setNodes, setEdges]);

  const saveAutomation = () => {
    const dataToSave = { nodes, edges };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
      showSaveSnackbar();
    } catch (error) {
      console.error('Error saving automation:', error);
      showSaveSnackbar(true);
    }
  };

  const showSaveSnackbar = (error: boolean = false) => {
    if (error) {
      setMsgSaveSnackbar('Error saving automation');
    } else {
      setMsgSaveSnackbar('Automation saved successfully');
    }
    setOpenSaveSnackbar(true);
  };

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
        data: { label: name },
      };

      setNodes((nds) => [...nds, newNode]);
      setCurrentNode({ id: newNode.id, name: newNode.data.label });
      setIsModalOpen(true);
    },
    [screenToFlowPosition, type, name, setNodes]
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
    setIsModalOpen(false);
  };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSaveSnackbar(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
      <Box className="automation-builder">
        <Box className="reactflow-wrapper" ref={reactFlowWrapper}>
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
        </Box>
        <Sidebar onSave={saveAutomation} />
      </Box>
      <NodeModal
        isOpen={isModalOpen}
        nodeName={currentNode?.name || ''}
        onSave={handleModalSave}
        onClose={() => setIsModalOpen(false)}
      />
      <Snackbar
        open={openSaveSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={msgSaveSnackbar}
        action={action}
      />
    </>
  );
};

export default AutomationBuilder;

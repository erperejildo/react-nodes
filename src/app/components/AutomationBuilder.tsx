'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Snackbar, SnackbarCloseReason } from '@mui/material';
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
import '@xyflow/react/dist/style.css';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDnD } from '../contexts/DnDContext';
import Sidebar from './Sidebar';
import NameDialog from './dialogs/NameDialog';
import EmailNode from './nodes/EmailNode';
import './styles.css';

const LOCAL_STORAGE_KEY = 'automation-builder';
let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeTypes: NodeTypes = { email: EmailNode };

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
  const [msgSnackbar, setMsgSnackbar] = useState('');

  const showSnackbar = useCallback((msg: string) => setMsgSnackbar(msg), []);

  const loadData = useCallback(async () => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
        setNodes(savedNodes);
        setEdges(savedEdges);
      } else {
        const res = await fetch('/api/automation');
        if (!res.ok) throw new Error();
        const automation = await res.json();
        setNodes(automation.nodes);
        setEdges(automation.edges);
      }
    } catch {
      showSnackbar('Error loading automation data');
    }
  }, [setNodes, setEdges, showSnackbar]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveAutomation = useCallback(() => {
    const dataToSave = { nodes, edges };
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData !== JSON.stringify(dataToSave)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
        showSnackbar('Automation saved successfully');
      }
    } catch {
      showSnackbar('Error saving automation');
    }
  }, [nodes, edges, showSnackbar]);

  const restartAutomation = useCallback(() => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      loadData();
      showSnackbar('Automation restarted successfully');
    } catch {
      showSnackbar('Error restarting automation');
    }
  }, [loadData, showSnackbar]);

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
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setNodes((nds) => [
        ...nds,
        { id: getId(), type, position, data: { label: name } },
      ]);
    },
    [screenToFlowPosition, type, name, setNodes]
  );

  const handleModalSave = useCallback(
    (name: string) => {
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
    },
    [currentNode, setNodes]
  );

  const handleCloseSnackbar = useCallback(
    (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
      if (reason !== 'clickaway') setMsgSnackbar('');
    },
    []
  );

  const snackbarAction = useMemo(
    () => (
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    ),
    [handleCloseSnackbar]
  );

  return (
    <>
      <Box className="automation-builder">
        <Box
          className="reactflow-wrapper"
          data-testid="reactflow-wrapper"
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
          >
            <MiniMap zoomable pannable />
            <Controls />
            <Background />
          </ReactFlow>
        </Box>
        <Sidebar onSave={saveAutomation} onRestart={restartAutomation} />
      </Box>
      <NameDialog
        isOpen={isModalOpen}
        nodeName={currentNode?.name || ''}
        onSave={handleModalSave}
        onClose={() => setIsModalOpen(false)}
      />
      <Snackbar
        open={msgSnackbar !== ''}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={msgSnackbar}
        action={snackbarAction}
      />
    </>
  );
};

export default AutomationBuilder;

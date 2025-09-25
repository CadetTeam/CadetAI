"use client"

import { useCallback, useState } from 'react'
import { ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
  NodeTypes
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DownloadIcon, 
  Share1Icon, 
  PlusIcon,
  GearIcon
} from "@radix-ui/react-icons"

// Custom Node Types
const APDNode = ({ data, selected }: { data: Record<string, unknown>; selected: boolean }) => {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md border-2 bg-white dark:bg-gray-800 ${
      selected ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
    }`}>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          data.status === 'complete' ? 'bg-green-500' : 
          data.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
        <div className="font-bold text-sm">{data.label}</div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {data.description}
      </div>
    </div>
  )
}

const ProcessNode = ({ data, selected }: { data: Record<string, unknown>; selected: boolean }) => {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md border-2 bg-blue-50 dark:bg-blue-900/20 ${
      selected ? 'border-blue-500' : 'border-blue-300 dark:border-blue-600'
    }`}>
      <div className="flex items-center space-x-2">
        <GearIcon className="w-4 h-4 text-blue-600" />
        <div className="font-bold text-sm text-blue-900 dark:text-blue-100">{data.label}</div>
      </div>
      <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
        {data.description}
      </div>
    </div>
  )
}

const DecisionNode = ({ data, selected }: { data: Record<string, unknown>; selected: boolean }) => {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md border-2 bg-yellow-50 dark:bg-yellow-900/20 transform rotate-45 ${
      selected ? 'border-yellow-500' : 'border-yellow-300 dark:border-yellow-600'
    }`}>
      <div className="transform -rotate-45 font-bold text-sm text-yellow-900 dark:text-yellow-100">
        {data.label}
      </div>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  apdNode: APDNode,
  processNode: ProcessNode,
  decisionNode: DecisionNode,
}

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'apdNode',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Data Collection', 
      description: 'Gather required information',
      status: 'complete'
    },
  },
  {
    id: '2',
    type: 'processNode',
    position: { x: 300, y: 100 },
    data: { 
      label: 'Validation', 
      description: 'Validate collected data'
    },
  },
  {
    id: '3',
    type: 'decisionNode',
    position: { x: 500, y: 100 },
    data: { 
      label: 'Approval Required?'
    },
  },
  {
    id: '4',
    type: 'apdNode',
    position: { x: 700, y: 50 },
    data: { 
      label: 'Auto-Approved', 
      description: 'Meets criteria',
      status: 'complete'
    },
  },
  {
    id: '5',
    type: 'apdNode',
    position: { x: 700, y: 150 },
    data: { 
      label: 'Manual Review', 
      description: 'Requires approval',
      status: 'pending'
    },
  },
  {
    id: '6',
    type: 'processNode',
    position: { x: 900, y: 100 },
    data: { 
      label: 'Final Processing', 
      description: 'Complete APD workflow'
    },
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 }
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 }
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    label: 'Yes',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 }
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    label: 'No',
    animated: true,
    style: { stroke: '#f59e0b', strokeWidth: 2 }
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 2 }
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    animated: true,
    style: { stroke: '#f59e0b', strokeWidth: 2 }
  },
]

export default function APDEnginePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const addNewNode = useCallback(() => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'apdNode',
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { 
        label: 'New Step', 
        description: 'Add description',
        status: 'pending'
      },
    }
    setNodes((nds) => [...nds, newNode])
  }, [setNodes])

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50 dark:bg-gray-900"
      >
        <Controls />
        <MiniMap 
          nodeStrokeColor={(n: Node) => {
            if ((n.data as Record<string, unknown>)?.status === 'complete') return '#10b981'
            if ((n.data as Record<string, unknown>)?.status === 'pending') return '#f59e0b'
            return '#ef4444'
          }}
          nodeColor={(n: Node) => {
            if (n.type === 'processNode') return '#3b82f6'
            if (n.type === 'decisionNode') return '#f59e0b'
            return '#6b7280'
          }}
          nodeBorderRadius={2}
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        
        {/* Legend Panel */}
        <Panel position="top-left" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 m-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">APD Step</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-600 rounded"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">Process</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600 rounded transform rotate-45"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">Decision</span>
              </div>
            </div>
          </div>
        </Panel>

        {/* Status Legend */}
        <Panel position="top-right" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 m-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Status</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">Complete</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">Failed</span>
              </div>
            </div>
          </div>
        </Panel>

        {/* Controls Panel */}
        <Panel position="bottom-left" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 m-4">
          <div className="flex space-x-2">
            <Button size="sm" onClick={addNewNode}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Step
            </Button>
            <Button size="sm" variant="outline">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" variant="outline">
              <Share1Icon className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </Panel>

        {/* Node Details Panel */}
        {selectedNode && (
          <Panel position="bottom-right" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 m-4 max-w-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Node Details</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedNode(null)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Label</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedNode.data.label as string}</p>
                </div>
                {(selectedNode.data.description as string) && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Description</label>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{selectedNode.data.description as string}</p>
                  </div>
                )}
                {(selectedNode.data.status as string) && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Status</label>
                    <Badge className={
                      selectedNode.data.status === 'complete' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      selectedNode.data.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }>
                      {selectedNode.data.status as string}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}
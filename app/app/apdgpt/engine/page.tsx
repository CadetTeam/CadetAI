"use client"

import { useCallback, useState, useEffect } from 'react'
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
import { Users, FileIcon, FileTextIcon, Grid3X3 } from 'lucide-react'

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
        <div className="font-bold text-sm">{data.label as string}</div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {data.description as string}
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
        <div className="font-bold text-sm text-blue-900 dark:text-blue-100">{data.label as string}</div>
      </div>
      <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
        {data.description as string}
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
        {data.label as string}
      </div>
    </div>
  )
}

const CollaboratorNode = ({ data, selected }: { data: Record<string, unknown>; selected: boolean }) => {
  return (
    <div className={`px-3 py-3 shadow-md rounded-full border-2 bg-green-50 dark:bg-green-900/20 ${
      selected ? 'border-green-500' : 'border-green-300 dark:border-green-600'
    }`}>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-lg">
          {data.userAvatar as string || '👤'}
        </div>
        <div className="text-xs font-medium text-green-900 dark:text-green-100">
          {data.label as string}
        </div>
      </div>
    </div>
  )
}

const DocumentNode = ({ data, selected }: { data: Record<string, unknown>; selected: boolean }) => {
  return (
    <div className={`px-3 py-2 shadow-md rounded-md border-2 bg-blue-50 dark:bg-blue-900/20 ${
      selected ? 'border-blue-500' : 'border-blue-300 dark:border-blue-600'
    }`}>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">
          📄
        </div>
        <div className="text-xs font-medium text-blue-900 dark:text-blue-100">
          {data.label as string}
        </div>
      </div>
      <div className="text-[10px] text-blue-700 dark:text-blue-300 mt-1">
        {data.documentType as string}
      </div>
    </div>
  )
}

const ModelNode = ({ data, selected }: { data: Record<string, unknown>; selected: boolean }) => {
  return (
    <div className={`px-3 py-2 shadow-md rounded-md border-2 bg-purple-50 dark:bg-purple-900/20 ${
      selected ? 'border-purple-500' : 'border-purple-300 dark:border-purple-600'
    }`}>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-white text-xs">
          🔗
        </div>
        <div className="text-xs font-medium text-purple-900 dark:text-purple-100">
          {data.label as string}
        </div>
      </div>
      <div className="text-[10px] text-purple-700 dark:text-purple-300 mt-1">
        {data.modelType as string}
      </div>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  apdNode: APDNode,
  processNode: ProcessNode,
  decisionNode: DecisionNode,
  collaboratorNode: CollaboratorNode,
  documentNode: DocumentNode,
  modelNode: ModelNode,
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
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hasAPD, setHasAPD] = useState(false)
  const [apdNodeId, setApdNodeId] = useState<string | null>(null)

  useEffect(() => {
    const checkLayout = () => {
      setIsCollapsed(window.innerWidth < 1280) // Collapse panels on smaller screens
    }
    checkLayout()
    window.addEventListener('resize', checkLayout)
    return () => window.removeEventListener('resize', checkLayout)
  }, [])

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

  // Add APD to canvas
  const addAPDToCanvas = useCallback(() => {
    const apdNode: Node = {
      id: 'apd-main',
      type: 'apdNode',
      position: { x: 400, y: 300 },
      data: { 
        label: 'APD Document', 
        description: 'Central APD Document',
        status: 'pending',
        isAPD: true
      },
    }
    setNodes((nds) => [...nds, apdNode])
    setHasAPD(true)
    setApdNodeId('apd-main')
  }, [setNodes])

  // Add Collaborator to canvas
  const addCollaboratorToCanvas = useCallback(() => {
    if (!hasAPD || !apdNodeId) return
    
    const collaboratorNode: Node = {
      id: `collaborator-${Date.now()}`,
      type: 'collaboratorNode',
      position: { x: Math.random() * 400 + 200, y: Math.random() * 400 + 200 },
      data: { 
        label: 'Team Member', 
        description: 'Collaborator or Contractor',
        status: 'pending',
        userAvatar: '👤'
      },
    }
    
    setNodes((nds) => [...nds, collaboratorNode])
    
    // Add animated dashed edge to APD
    const newEdge: Edge = {
      id: `${apdNodeId}-${collaboratorNode.id}`,
      source: apdNodeId,
      target: collaboratorNode.id,
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5,5' }
    }
    setEdges((eds) => [...eds, newEdge])
  }, [setNodes, setEdges, hasAPD, apdNodeId])

  // Add Document to canvas
  const addDocumentToCanvas = useCallback(() => {
    if (!hasAPD || !apdNodeId) return
    
    const documentNode: Node = {
      id: `document-${Date.now()}`,
      type: 'documentNode',
      position: { x: Math.random() * 400 + 200, y: Math.random() * 400 + 200 },
      data: { 
        label: 'Supporting Document', 
        description: 'Reference document',
        status: 'pending',
        documentType: 'PDF'
      },
    }
    
    setNodes((nds) => [...nds, documentNode])
    
    // Add animated dashed edge to APD
    const newEdge: Edge = {
      id: `${apdNodeId}-${documentNode.id}`,
      source: apdNodeId,
      target: documentNode.id,
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' }
    }
    setEdges((eds) => [...eds, newEdge])
  }, [setNodes, setEdges, hasAPD, apdNodeId])

  // Add Model to canvas
  const addModelToCanvas = useCallback(() => {
    if (!hasAPD || !apdNodeId) return
    
    const modelNode: Node = {
      id: `model-${Date.now()}`,
      type: 'modelNode',
      position: { x: Math.random() * 400 + 200, y: Math.random() * 400 + 200 },
      data: { 
        label: 'Business Model', 
        description: 'Framework or Model',
        status: 'pending',
        modelType: 'Canvas'
      },
    }
    
    setNodes((nds) => [...nds, modelNode])
    
    // Add animated dashed edge to APD
    const newEdge: Edge = {
      id: `${apdNodeId}-${modelNode.id}`,
      source: apdNodeId,
      target: modelNode.id,
      animated: true,
      style: { stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '5,5' }
    }
    setEdges((eds) => [...eds, newEdge])
  }, [setNodes, setEdges, hasAPD, apdNodeId])

  return (
    <>
      {/* Full-screen ReactFlow Canvas */}
      <div className="fixed inset-0 z-10">
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
        
        {/* Compact Floating Toolbar - Consolidates all controls */}
        <Panel position="top-left" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg p-2 ml-4 sm:ml-20 mt-2 sm:mt-4 z-10">
          <div className="flex items-center space-x-2">
            {/* Legend Toggle */}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
              title={isCollapsed ? "Show Legend" : "Hide Legend"}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            
            {/* Add Objects */}
            <div className="flex items-center space-x-1">
              <Button size="sm" onClick={addNewNode} className="text-xs h-8">
                <PlusIcon className="w-3 h-3 mr-1" />
                <span className={isCollapsed ? "hidden" : ""}>Add</span>
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-8">
                <DownloadIcon className="w-3 h-3 mr-1" />
                <span className={isCollapsed ? "hidden" : ""}>Export</span>
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-8">
                <Share1Icon className="w-3 h-3 mr-1" />
                <span className={isCollapsed ? "hidden" : ""}>Share</span>
              </Button>
            </div>
          </div>
        </Panel>

        {/* Expanded Legend Panel - Only shows when not collapsed */}
        {!isCollapsed && (
          <Panel position="top-left" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg p-3 ml-4 sm:ml-20 mt-16 sm:mt-20 z-10 max-w-xs max-h-96 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Add to Canvas</h3>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsCollapsed(true)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
              
              {/* Generate APD - Primary Action */}
              <div className="space-y-2">
                <Button 
                  onClick={() => addAPDToCanvas()} 
                  className="w-full justify-start bg-primary hover:bg-primary/90 text-white"
                >
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Generate an APD
                </Button>
                <p className="text-xs text-muted-foreground">Start with a central document to add other objects</p>
              </div>

              {/* Other Objects - Disabled until APD exists */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Button 
                    onClick={() => addCollaboratorToCanvas()} 
                    disabled={!hasAPD}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Collaborators
                  </Button>
                  <p className="text-xs text-muted-foreground">Add team members and contractors</p>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => addDocumentToCanvas()} 
                    disabled={!hasAPD}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <FileIcon className="w-4 h-4 mr-2" />
                    Documents
                  </Button>
                  <p className="text-xs text-muted-foreground">Supporting documents and references</p>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => addModelToCanvas()} 
                    disabled={!hasAPD}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Models
                  </Button>
                  <p className="text-xs text-muted-foreground">Business models and frameworks</p>
                </div>
              </div>

              {/* Status Legend */}
              <div className="border-t pt-3">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Status</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Complete</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Pending</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300">Failed</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        )}

        {/* Node Details Panel - Stays above chat bar and avoids right sidebar */}
        {selectedNode && (
          <Panel position="bottom-right" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg p-2 sm:p-3 mr-4 sm:mr-[336px] mb-16 sm:mb-[80px] max-w-xs z-10">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs text-gray-900 dark:text-gray-100">Details</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedNode(null)}
                  className="h-5 w-5 p-0 text-xs"
                >
                  ×
                </Button>
              </div>
              <div className="space-y-1.5">
                <div>
                  <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Label</label>
                  <p className="text-xs text-gray-900 dark:text-gray-100">{selectedNode.data.label as string}</p>
                </div>
                {(selectedNode.data.description as string) && (
                  <div>
                    <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Description</label>
                    <p className="text-xs text-gray-900 dark:text-gray-100">{selectedNode.data.description as string}</p>
                  </div>
                )}
                {(selectedNode.data.status as string) && (
                  <div>
                    <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Status</label>
                    <Badge className={
                      selectedNode.data.status === 'complete' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-[10px]' :
                      selectedNode.data.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-[10px]' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-[10px]'
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
    </>
  )
}
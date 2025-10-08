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
  NodeTypes,
  EdgeTypes,
  getBezierPath,
  EdgeProps
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './styles.css'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { 
  DownloadIcon, 
  Share1Icon, 
  PlusIcon,
  GearIcon
} from "@radix-ui/react-icons"
import { Users, FileIcon, FileTextIcon, Grid3X3, FileType, Database, Brain, Zap, Activity, Image as ImageIcon } from 'lucide-react'

// Custom Animated Edge Component
const AnimatedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const edgeColor = (data?.color as string) || '#3b82f6'
  
  return (
    <>
      {/* Background glow */}
      <path
        id={id}
        style={{ ...style, strokeWidth: 8, opacity: 0.2 }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        stroke={edgeColor}
        fill="none"
      />
      {/* Main animated path */}
      <path
        id={id}
        style={{ ...style }}
        className="react-flow__edge-path animate-pulse"
        d={edgePath}
        markerEnd={markerEnd}
        stroke={edgeColor}
        strokeWidth={2}
        fill="none"
      />
      {/* Animated dot traveling along path */}
      <circle r="3" fill={edgeColor} className="animate-ping">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  )
}

// Custom Node Types
const APDNode = ({ data, selected }: { data: Record<string, unknown>; selected: boolean }) => {
  return (
    <div className={cn(
      "px-6 py-4 shadow-2xl rounded-lg border-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-all duration-300 min-w-[200px]",
      selected ? 'border-blue-500 shadow-blue-500/50 scale-105' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
    )}>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className={cn(
            "w-4 h-4 rounded-full",
            data.status === 'complete' ? 'bg-green-500 animate-pulse' : 
            data.status === 'pending' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
          )} />
          <div className={cn(
            "absolute inset-0 w-4 h-4 rounded-full animate-ping",
            data.status === 'complete' ? 'bg-green-500' : 
            data.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
          )} style={{ animationDuration: '2s' }} />
        </div>
        <div>
          <div className="font-bold text-base">{data.label as string}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {data.description as string}
          </div>
        </div>
      </div>
      {(data.isAPD as boolean) && (
        <div className="mt-2 flex items-center space-x-1">
          <Activity className="w-3 h-3 text-blue-500" />
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Central Hub</span>
        </div>
      )}
    </div>
  )
}

const ProcessNode = ({ data, selected }: { data: Record<string, unknown>; selected: boolean }) => {
  return (
    <div className={cn(
      "px-4 py-3 shadow-lg rounded-lg border-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/10 transition-all duration-300",
      selected ? 'border-blue-500 shadow-blue-500/50 scale-105' : 'border-blue-300 dark:border-blue-600 hover:border-blue-400'
    )}>
      <div className="flex items-center space-x-2">
        <GearIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
    <div className={cn(
      "px-4 py-2 shadow-lg rounded-md border-2 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-900/10 transform rotate-45 transition-all duration-300",
      selected ? 'border-yellow-500 shadow-yellow-500/50 scale-110' : 'border-yellow-300 dark:border-yellow-600 hover:border-yellow-400'
    )}>
      <div className="transform -rotate-45 font-bold text-sm text-yellow-900 dark:text-yellow-100 text-center">
        {data.label as string}
      </div>
    </div>
  )
}

const CollaboratorNode = ({ data, selected }: { data: Record<string, unknown>; selected: boolean }) => {
  const initials = ((data.label as string) || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const avatarUrl = data.avatarUrl as string | undefined
  const role = data.role as string | 'Member'
  const isOnline = data.isOnline as boolean | false

  return (
    <div className={cn(
      "px-4 py-3 shadow-lg rounded-xl border-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/10 transition-all duration-300 min-w-[160px]",
      selected ? 'border-green-500 shadow-green-500/50 scale-105' : 'border-green-300 dark:border-green-600 hover:border-green-400'
    )}>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="w-10 h-10 border-2 border-green-500 shadow-md">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={data.label as string} />}
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-green-900 dark:text-green-100">
            {data.label as string}
          </div>
          <div className="flex items-center space-x-1 mt-0.5">
            <Users className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span className="text-[10px] text-green-700 dark:text-green-300 font-medium">{role}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const DocumentNode = ({ data, selected }: { data: Record<string, unknown>; selected: boolean }) => {
  const documentType = (data.documentType as string) || 'PDF'
  const fileSize = data.fileSize as string | undefined
  
  const getDocumentIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF':
        return <FileTextIcon className="w-5 h-5" />
      case 'IMAGE':
      case 'PNG':
      case 'JPG':
        return <ImageIcon className="w-5 h-5" />
      case 'DATABASE':
      case 'SQL':
        return <Database className="w-5 h-5" />
      default:
        return <FileType className="w-5 h-5" />
    }
  }

  const getDocumentColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF':
        return 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/10 border-red-300 dark:border-red-600'
      case 'IMAGE':
      case 'PNG':
      case 'JPG':
        return 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/10 border-purple-300 dark:border-purple-600'
      case 'DATABASE':
      case 'SQL':
        return 'from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-900/10 border-indigo-300 dark:border-indigo-600'
      default:
        return 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/10 border-blue-300 dark:border-blue-600'
    }
  }

  return (
    <div className={cn(
      "px-4 py-3 shadow-lg rounded-lg border-2 bg-gradient-to-br transition-all duration-300 min-w-[180px]",
      getDocumentColor(documentType),
      selected ? 'shadow-blue-500/50 scale-105 border-blue-500' : 'hover:scale-102'
    )}>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-md text-blue-600 dark:text-blue-400">
          {getDocumentIcon(documentType)}
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
            {data.label as string}
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {documentType}
            </Badge>
            {fileSize && (
              <span className="text-[10px] text-gray-600 dark:text-gray-400">{fileSize}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ModelNode = ({ data, selected }: { data: Record<string, unknown>; selected: boolean }) => {
  const modelType = (data.modelType as string) || 'Canvas'
  const isActive = data.isActive as boolean | false
  
  const getModelIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ai':
      case 'neural':
        return <Brain className="w-5 h-5" />
      case 'canvas':
      case 'framework':
        return <Grid3X3 className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }

  return (
    <div className={cn(
      "px-4 py-3 shadow-lg rounded-lg border-2 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/10 transition-all duration-300 min-w-[180px]",
      selected ? 'border-purple-500 shadow-purple-500/50 scale-105' : 'border-purple-300 dark:border-purple-600 hover:border-purple-400'
    )}>
      <div className="flex items-center space-x-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shadow-md transition-all",
          isActive ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white animate-pulse' : 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400'
        )}>
          {getModelIcon(modelType)}
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-purple-900 dark:text-purple-100 truncate">
            {data.label as string}
          </div>
          <div className="flex items-center space-x-2 mt-0.5">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {modelType}
            </Badge>
            {isActive && (
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-green-600 dark:text-green-400">Active</span>
              </div>
            )}
          </div>
        </div>
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

const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
}

// Initial nodes and edges - Clean empty canvas
const initialNodes: Node[] = []
const initialEdges: Edge[] = []

export default function APDEnginePage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hasAPD, setHasAPD] = useState(false)
  const [apdNodeId, setApdNodeId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [nodeCounter, setNodeCounter] = useState({ collaborator: 0, document: 0, model: 0 })
  
  // Draggable toolbar state
  const [toolbarPosition, setToolbarPosition] = useState({ x: 16, y: 16 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Helper function to calculate circular position around APD
  const getCircularPosition = useCallback((index: number, total: number, radius: number = 300) => {
    const angle = (index * 2 * Math.PI) / Math.max(total, 1)
    return {
      x: 400 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle)
    }
  }, [])

  useEffect(() => {
    const checkLayout = () => {
      const isMobileScreen = window.innerWidth < 768
      setIsMobile(isMobileScreen)
      setIsCollapsed(window.innerWidth < 1280) // Collapse panels on smaller screens
    }
    checkLayout()
    window.addEventListener('resize', checkLayout)
    return () => window.removeEventListener('resize', checkLayout)
  }, [])

  // Update toolbar position when APD is created
  useEffect(() => {
    if (hasAPD && toolbarPosition.x === 16 && toolbarPosition.y === 16) {
      // Move to bottom-left when APD is created
      setToolbarPosition({ x: 16, y: window.innerHeight - 100 })
    }
  }, [hasAPD, toolbarPosition])

  // Drag handlers for toolbar
  const handleToolbarMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - toolbarPosition.x,
      y: e.clientY - toolbarPosition.y
    })
  }, [toolbarPosition])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setToolbarPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      type: 'animated',
      animated: true,
      data: { color: '#3b82f6' }
    }, eds)),
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
    
    const collaboratorNames = ['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Rodriguez', 'Jordan Smith']
    const roles = ['Product Manager', 'Developer', 'Designer', 'Analyst', 'Contractor']
    const randomName = collaboratorNames[Math.floor(Math.random() * collaboratorNames.length)]
    const randomRole = roles[Math.floor(Math.random() * roles.length)]
    
    const position = getCircularPosition(nodeCounter.collaborator, 8, 250)
    setNodeCounter(prev => ({ ...prev, collaborator: prev.collaborator + 1 }))
    
    const collaboratorNode: Node = {
      id: `collaborator-${Date.now()}`,
      type: 'collaboratorNode',
      position,
      data: { 
        label: randomName, 
        description: 'Team collaborator',
        status: 'active',
        role: randomRole,
        isOnline: Math.random() > 0.5,
        avatarUrl: undefined // You can add real avatar URLs here
      },
    }
    
    setNodes((nds) => [...nds, collaboratorNode])
    
    // Add animated edge to APD
    const newEdge: Edge = {
      id: `${apdNodeId}-${collaboratorNode.id}`,
      source: apdNodeId,
      target: collaboratorNode.id,
      type: 'animated',
      animated: true,
      data: { color: '#10b981' }
    }
    setEdges((eds) => [...eds, newEdge])
  }, [setNodes, setEdges, hasAPD, apdNodeId, nodeCounter, getCircularPosition])

  // Add Document to canvas
  const addDocumentToCanvas = useCallback(() => {
    if (!hasAPD || !apdNodeId) return
    
    const documentTypes = [
      { type: 'PDF', name: 'Requirements.pdf', size: '2.4 MB' },
      { type: 'IMAGE', name: 'Wireframe.png', size: '1.2 MB' },
      { type: 'DATABASE', name: 'Schema.sql', size: '156 KB' },
      { type: 'PDF', name: 'Business_Plan.pdf', size: '3.8 MB' }
    ]
    const randomDoc = documentTypes[Math.floor(Math.random() * documentTypes.length)]
    
    const position = getCircularPosition(nodeCounter.document + 2, 8, 300)
    setNodeCounter(prev => ({ ...prev, document: prev.document + 1 }))
    
    const documentNode: Node = {
      id: `document-${Date.now()}`,
      type: 'documentNode',
      position,
      data: { 
        label: randomDoc.name, 
        description: 'Supporting document',
        status: 'active',
        documentType: randomDoc.type,
        fileSize: randomDoc.size
      },
    }
    
    setNodes((nds) => [...nds, documentNode])
    
    // Add animated edge to APD with color based on document type
    const edgeColor = randomDoc.type === 'PDF' ? '#ef4444' : randomDoc.type === 'IMAGE' ? '#a855f7' : '#6366f1'
    const newEdge: Edge = {
      id: `${apdNodeId}-${documentNode.id}`,
      source: apdNodeId,
      target: documentNode.id,
      type: 'animated',
      animated: true,
      data: { color: edgeColor }
    }
    setEdges((eds) => [...eds, newEdge])
  }, [setNodes, setEdges, hasAPD, apdNodeId, nodeCounter, getCircularPosition])

  // Add Model to canvas
  const addModelToCanvas = useCallback(() => {
    if (!hasAPD || !apdNodeId) return
    
    const modelTypes = [
      { type: 'AI', name: 'GPT-4 Analysis', isActive: true },
      { type: 'Canvas', name: 'Business Model Canvas', isActive: false },
      { type: 'Framework', name: 'SWOT Analysis', isActive: true },
      { type: 'Neural', name: 'Neural Network', isActive: true }
    ]
    const randomModel = modelTypes[Math.floor(Math.random() * modelTypes.length)]
    
    const position = getCircularPosition(nodeCounter.model + 4, 8, 350)
    setNodeCounter(prev => ({ ...prev, model: prev.model + 1 }))
    
    const modelNode: Node = {
      id: `model-${Date.now()}`,
      type: 'modelNode',
      position,
      data: { 
        label: randomModel.name, 
        description: 'Analysis model',
        status: randomModel.isActive ? 'active' : 'pending',
        modelType: randomModel.type,
        isActive: randomModel.isActive
      },
    }
    
    setNodes((nds) => [...nds, modelNode])
    
    // Add animated edge to APD
    const newEdge: Edge = {
      id: `${apdNodeId}-${modelNode.id}`,
      source: apdNodeId,
      target: modelNode.id,
      type: 'animated',
      animated: true,
      data: { color: '#8b5cf6' }
    }
    setEdges((eds) => [...eds, newEdge])
  }, [setNodes, setEdges, hasAPD, apdNodeId, nodeCounter, getCircularPosition])

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
          edgeTypes={edgeTypes}
          fitView
          className="bg-gray-50 dark:bg-gray-900"
          connectionLineStyle={{ 
            stroke: '#3b82f6', 
            strokeWidth: 2,
            strokeDasharray: '5,5'
          }}
          defaultEdgeOptions={{
            type: 'animated',
            animated: true
          }}
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
        
        {/* Mobile Legend Button - Vertical tab aligned to top */}
        {isMobile && (
          <div className="fixed top-16 left-0 z-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-20 w-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-r-lg shadow-lg border border-border hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200"
            >
              <div className="flex flex-col space-y-1">
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              </div>
            </Button>
          </div>
        )}

        {/* Mobile Legend Flyout */}
        {isMobile && isMobileMenuOpen && (
          <>
            {/* Mobile backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0 duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed top-16 left-6 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-3 w-64 animate-in fade-in-0 zoom-in-95 slide-in-from-left-2 duration-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs text-gray-900 dark:text-gray-100">Canvas Tools</h3>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-5 w-5 p-0 text-xs"
                >
                  ×
                </Button>
              </div>
              
              {/* Generate APD - Primary Action */}
              <Button 
                onClick={() => {
                  addAPDToCanvas()
                  setIsMobileMenuOpen(false)
                }} 
                className="w-full justify-start bg-primary hover:bg-primary/90 text-white h-8 text-xs"
              >
                <FileTextIcon className="w-3 h-3 mr-2" />
                Generate APD
              </Button>

              {/* Other Objects - Disabled until APD exists */}
              <div className="grid grid-cols-3 gap-1">
                <Button 
                  onClick={() => {
                    addCollaboratorToCanvas()
                    setIsMobileMenuOpen(false)
                  }} 
                  disabled={!hasAPD}
                  variant="outline"
                  className="h-7 text-xs px-2"
                  title="Add Collaborators"
                >
                  <Users className="w-3 h-3" />
                </Button>
                <Button 
                  onClick={() => {
                    addDocumentToCanvas()
                    setIsMobileMenuOpen(false)
                  }} 
                  disabled={!hasAPD}
                  variant="outline"
                  className="h-7 text-xs px-2"
                  title="Add Documents"
                >
                  <FileIcon className="w-3 h-3" />
                </Button>
                <Button 
                  onClick={() => {
                    addModelToCanvas()
                    setIsMobileMenuOpen(false)
                  }} 
                  disabled={!hasAPD}
                  variant="outline"
                  className="h-7 text-xs px-2"
                  title="Add Models"
                >
                  <Grid3X3 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            </div>
          </>
        )}

        {/* Desktop Compact Floating Toolbar - Hidden on mobile */}
        {!isMobile && (
          <div 
            className="fixed z-10 transition-all duration-200 ease-in-out select-none"
            style={{ 
              left: `${toolbarPosition.x}px`, 
              top: hasAPD ? `${toolbarPosition.y}px` : '50%',
              transform: hasAPD ? 'none' : 'translate(-50%, -50%)'
            }}
          >
            <div 
              className={cn(
                "bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg p-2",
                isDragging ? "cursor-grabbing shadow-2xl" : "cursor-grab"
              )}
              onMouseDown={handleToolbarMouseDown}
            >
              <div className="flex items-center space-x-1">
            {/* Legend Toggle */}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-7 w-7 p-0"
              title={isCollapsed ? "Show Legend" : "Hide Legend"}
            >
              <Grid3X3 className="w-3 h-3" />
            </Button>
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-1">
              <Button size="sm" onClick={addNewNode} className="text-xs h-7 px-2">
                <PlusIcon className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-7 px-2" title="Export">
                <DownloadIcon className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-7 px-2" title="Share">
                <Share1Icon className="w-3 h-3" />
              </Button>
              </div>
            </div>
            </div>
          </div>
        )}

        {/* Desktop Expanded Legend Panel - Hidden on mobile */}
        {!isMobile && !isCollapsed && (
          <div 
            className="fixed z-10 transition-all duration-200 ease-in-out"
            style={{ 
              left: hasAPD ? `${toolbarPosition.x}px` : '50%',
              top: hasAPD ? `${toolbarPosition.y + 60}px` : '50%',
              transform: hasAPD ? 'none' : 'translate(-50%, -50%)'
            }}
          >
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-xs max-h-96 overflow-y-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs text-gray-900 dark:text-gray-100">Canvas Tools</h3>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsCollapsed(true)}
                  className="h-5 w-5 p-0 text-xs"
                >
                  ×
                </Button>
              </div>
              
              {/* Generate APD - Primary Action */}
              <Button 
                onClick={() => addAPDToCanvas()} 
                className="w-full justify-start bg-primary hover:bg-primary/90 text-white h-8 text-xs"
              >
                <FileTextIcon className="w-3 h-3 mr-2" />
                Generate APD
              </Button>

              {/* Other Objects - Disabled until APD exists */}
              <div className="grid grid-cols-3 gap-1">
                <Button 
                  onClick={() => addCollaboratorToCanvas()} 
                  disabled={!hasAPD}
                  variant="outline"
                  className="h-7 text-xs px-2"
                  title="Add Collaborators"
                >
                  <Users className="w-3 h-3" />
                </Button>
                <Button 
                  onClick={() => addDocumentToCanvas()} 
                  disabled={!hasAPD}
                  variant="outline"
                  className="h-7 text-xs px-2"
                  title="Add Documents"
                >
                  <FileIcon className="w-3 h-3" />
                </Button>
                <Button 
                  onClick={() => addModelToCanvas()} 
                  disabled={!hasAPD}
                  variant="outline"
                  className="h-7 text-xs px-2"
                  title="Add Models"
                >
                  <Grid3X3 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            </div>
          </div>
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
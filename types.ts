export type NodeType = 'input' | 'process' | 'control' | 'output';

export type NodeStatus = 'idle' | 'active' | 'processing' | 'completed' | 'error';

export interface NodeData {
  id: string;
  type: NodeType;
  label: string;
  subLabel: string;
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: string[]; // IDs of source nodes
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  active: boolean;
}

export enum AnimationState {
  SURFACE_IDLE = 'SURFACE_IDLE',
  SURFACE_TYPING = 'SURFACE_TYPING',
  TRANSITION_TO_SUBSTRATE = 'TRANSITION_TO_SUBSTRATE',
  SUBSTRATE_PROCESSING = 'SUBSTRATE_PROCESSING',
  TRANSITION_TO_SURFACE = 'TRANSITION_TO_SURFACE',
  SURFACE_RESULT = 'SURFACE_RESULT'
}

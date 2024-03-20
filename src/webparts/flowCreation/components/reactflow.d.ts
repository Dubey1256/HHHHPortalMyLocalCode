declare module 'reactflow';

// Basic types for nodes and edges
export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any; // Replace `any` with specific properties if needed
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string; // Optional label property
  type?: string; // Optional type property
}

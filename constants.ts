import { NodeData, Connection } from './types';

// The "Output" node corresponds to the main Creative Canvas in Surface View
export const CANVAS_CENTER_X = 800;
export const CANVAS_CENTER_Y = 400;

export const CIRCUIT_NODES: NodeData[] = [
  {
    id: 'node-clip',
    type: 'input',
    label: 'CLIP_TEXT_ENCODE',
    subLabel: 'PROMPT_G',
    x: 200,
    y: 340, // Aligned
    width: 180,
    height: 100,
    inputs: [],
    metrics: [{ label: 'TOKENS', value: '77/77' }, { label: 'WEIGHT', value: '1.2' }]
  },
  {
    id: 'node-model',
    type: 'control',
    label: 'CHECKPOINT_LOADER',
    subLabel: 'SD_XL_TURBO',
    x: 200,
    y: 520, // Aligned
    width: 180,
    height: 100,
    inputs: [],
    metrics: [{ label: 'VRAM', value: '4.2GB' }, { label: 'PREC', value: 'FP16' }]
  },
  {
    id: 'node-ksampler',
    type: 'process',
    label: 'K_SAMPLER_ADV',
    subLabel: 'DENOISE',
    x: 500,
    y: 400, // Perfectly Centered with Output
    width: 200,
    height: 140,
    inputs: ['node-clip', 'node-model'],
    metrics: [{ label: 'STEPS', value: '24' }, { label: 'CFG', value: '7.0' }, { label: 'SAMPLER', value: 'EULER' }]
  },
  {
    id: 'node-vae',
    type: 'process',
    label: 'VAE_DECODE',
    subLabel: 'LATENT_TO_PIXEL',
    x: 500,
    y: 600, // Aligned column with Sampler
    width: 200, // Match width of sampler for column symmetry
    height: 80,
    inputs: ['node-ksampler'],
    metrics: [{ label: 'TILES', value: '4' }]
  },
  {
    id: 'output-canvas',
    type: 'output',
    label: 'IMAGE_COMPOSITE',
    subLabel: 'FINAL_OUT',
    x: CANVAS_CENTER_X, // 800
    y: CANVAS_CENTER_Y, // 400
    width: 240,
    height: 160, 
    inputs: ['node-ksampler', 'node-vae'],
    metrics: [{ label: 'RES', value: '1024x1024' }, { label: 'BATCH', value: '1' }]
  }
];

export const CIRCUIT_CONNECTIONS: Connection[] = [
  { id: 'c1', sourceId: 'node-clip', targetId: 'node-ksampler', active: false },
  { id: 'c2', sourceId: 'node-model', targetId: 'node-ksampler', active: false },
  { id: 'c3', sourceId: 'node-ksampler', targetId: 'output-canvas', active: false }, 
  { id: 'c4', sourceId: 'node-ksampler', targetId: 'node-vae', active: false },
  { id: 'c5', sourceId: 'node-vae', targetId: 'output-canvas', active: false },
];

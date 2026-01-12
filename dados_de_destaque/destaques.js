// =======================================================
// IMPORTA OS BANCOS DE DADOS DE CADA FRANQUIA
// =======================================================
import { onepiece } from './onepiece.js';
import { sololeveling } from './sololeveling.js';
import { eldenring } from './eldenring.js';

// =======================================================
// BANCO CENTRAL DE DESTAQUES
// =======================================================
export const destaques = [
  ...onepiece,
  ...sololeveling,
  ...eldenring
];

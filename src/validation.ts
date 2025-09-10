 codex/create-manufacturing-order-management-system-v1wodo
 main
import { OrderStatus } from './models';

export interface OrderInput {
  customerId: string;
  prioritaet?: string;
 codex/create-manufacturing-order-management-system-v1wodo
 main
}

export function validateOrderInput(input: any): input is OrderInput {
  return typeof input?.customerId === 'string' && input.customerId.length > 0;
}
 codex/create-manufacturing-order-management-system-v1wodo
 main

export interface CustomerInput {
  name: string;
  kundennummer: string;
}

export function validateCustomerInput(input: any): input is CustomerInput {
  return (
    typeof input?.name === 'string' &&
    input.name.length > 0 &&
    typeof input.kundennummer === 'string' &&
    input.kundennummer.length > 0
  );
}

const validStatuses: OrderStatus[] = [
  'Neu',
  'Geprüft',
  'In_Arbeit',
  'Pausiert',
  'Warten_auf_Kunde',
  'Fertig',
  'Versandt',
  'Archiviert',
];

export interface OrderUpdateInput {
  status?: OrderStatus;
}

export function validateOrderUpdate(input: any): input is OrderUpdateInput {
  if (input == null || typeof input !== 'object') return false;
  if (input.status === undefined) return true;
  return (
    typeof input.status === 'string' &&
    (validStatuses as string[]).includes(input.status)
  );
}
 codex/create-manufacturing-order-management-system-v1wodo

export interface DrawingInput {
  lines: { points: number[] }[];
}

export function validateDrawingInput(input: any): input is DrawingInput {
  if (!Array.isArray(input?.lines)) return false;
  return input.lines.every(
    (l: any) => Array.isArray(l?.points) && l.points.every((n: any) => typeof n === 'number')
  );
}
 main

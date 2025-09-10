export type Role = 'Admin' | 'Dispo' | 'Produktion' | 'Gast';

export interface User {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  kundennummer: string;
  email?: string;
  telefon?: string;
  adresse?: string;
  ansprechpartner?: string;
  notizen?: string;
}

export type OrderStatus =
  | 'Neu'
  | 'Geprüft'
  | 'In_Arbeit'
  | 'Pausiert'
  | 'Warten_auf_Kunde'
  | 'Fertig'
  | 'Versandt'
  | 'Archiviert';

export type OrderPriority = 'Niedrig' | 'Normal' | 'Hoch' | 'Eilig';

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  prioritaet: OrderPriority;
  createdAt: Date;
  updatedAt: Date;
  notizen?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  positionsNr: number;
  bezeichnung: string;
  menge: number;
  einheit: string;
}

export interface Drawing {
  id: string;
  lines: { points: number[] }[];
}

export interface OrderInput {
  customerId: string;
}

export function validateOrderInput(input: any): input is OrderInput {
  return typeof input?.customerId === 'string' && input.customerId.length > 0;
}

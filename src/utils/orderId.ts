export function formatOrderId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

export default function fetchHeader(
  header: string,
  headers: Record<string, unknown>
): string | null {
  const value = headers[header] || headers[header.toLowerCase()];

  return typeof value === 'string' ? value : null;
}

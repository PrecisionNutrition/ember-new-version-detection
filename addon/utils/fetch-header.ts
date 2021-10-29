export default function fetchHeader(header: string, headers: Record<string, unknown>): unknown {
  return headers[header] || headers[header.toLowerCase()];
}

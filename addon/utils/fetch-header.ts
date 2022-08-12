export default function fetchHeader(
  header: string,
  headers: Headers | Record<string, unknown>
): string | null {
  let value: unknown;

  if (headers instanceof Headers) {
    value = headers.get(header);
  } else {
    value = headers[header] || headers[header.toLowerCase()];
  }

  return typeof value === 'string' ? value : null;
}

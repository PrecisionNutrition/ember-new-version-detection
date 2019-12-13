export default function fetchHeader(header, headers) {
  return headers[header] || headers[header.toLowerCase()];
}

export function parseOptionalFencedJson<T>(input: string): T {
  const trimmed = input.trim();

  const fenceRe = /^```json[\r\n]([\s\S]*?)```$/i;
  const match = trimmed.match(fenceRe);

  const jsonPayload = match ? match[1].trim() : trimmed;

  return JSON.parse(jsonPayload) as T;
}

export function cleanResumeText(text: string) {
  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
    .replace(/[\p{Extended_Pictographic}]/gu, "")
    .replace(/[^\p{L}\p{N}\p{P}\p{Zs}\n\r]/gu, "");
}

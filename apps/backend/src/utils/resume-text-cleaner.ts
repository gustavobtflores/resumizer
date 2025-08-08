export function cleanResumeText(text: string) {
  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
    .replace(/[\p{Extended_Pictographic}]/gu, "")
    .replace(/[^\p{L}\p{N}\p{P}\p{Zs}\n\r]/gu, "");
}

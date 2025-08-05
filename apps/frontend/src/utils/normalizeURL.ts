export function normalizeURL(url: string) {
  let urlString = url.trim();

  if (!/^[a-z]+:\/\//i.test(urlString)) {
    urlString = "https://" + urlString;
  }

  const normalized = new URL(urlString);

  return normalized.toString();
}

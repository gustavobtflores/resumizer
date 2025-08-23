import pdf from "pdf-parse";

export async function parsePDF(file: Buffer) {
  try {
    const data = await pdf(file);
    return { isPDF: true, data };
  } catch (error) {
    return { isPDF: false, error };
  }
}

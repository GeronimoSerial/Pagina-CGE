import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "public", "content");
const tipos = ["noticias", "tramites"];

function getMarkdownFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"));
}

function extractMetadata(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  // El slug será el nombre del archivo sin extensión
  const slug = path.basename(filePath, ".md");
  return { ...data, slug };
}

function generateIndexForType(tipo) {
  const dir = path.join(CONTENT_DIR, tipo);
  if (!fs.existsSync(dir)) return;
  const files = getMarkdownFiles(dir);
  const metadatas = files.map((file) => extractMetadata(path.join(dir, file)));
  const indexPath = path.join(dir, "index.json");
  fs.writeFileSync(indexPath, JSON.stringify(metadatas, null, 2), "utf8");
  console.log(`Índice generado para ${tipo}: ${indexPath}`);
}

tipos.forEach(generateIndexForType);

console.log("Índices generados correctamente."); 
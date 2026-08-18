/**
 * Snapshot the live API into src/content/fallback.json.
 *
 * The bundled snapshot is what the site renders when the backend is unreachable, so it needs
 * refreshing whenever backend/app/content.py changes. Run with the backend up:
 *
 *   npm run sync:content
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../src/content/fallback.json");
const API = process.env.API_BASE ?? "http://127.0.0.1:8000";

const REQUIRED_KEYS = ["profile", "projects", "experience", "skills", "writing"];

async function main() {
  const url = `${API}/api/site`;
  console.log(`Fetching ${url}`);

  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    console.error(
      `\nCould not reach the API at ${API}.\n` +
        "Start it first:  cd backend && .venv/Scripts/python -m uvicorn app.main:app --port 8000\n",
    );
    throw error;
  }

  if (!response.ok) {
    throw new Error(`API returned ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();

  // A malformed snapshot would silently break the offline path, so validate before writing.
  const missing = REQUIRED_KEYS.filter((key) => !(key in payload));
  if (missing.length > 0) {
    throw new Error(`Payload is missing required keys: ${missing.join(", ")}`);
  }
  if (!Array.isArray(payload.projects) || payload.projects.length === 0) {
    throw new Error("Payload contains no projects; refusing to write an empty snapshot.");
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(
    `Wrote ${OUT}\n  ${payload.projects.length} projects, ` +
      `${payload.experience.length} experience entries, ${payload.skills.length} skill groups.`,
  );
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});

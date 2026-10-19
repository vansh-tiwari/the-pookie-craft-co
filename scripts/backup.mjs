import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { createInterface } from "node:readline/promises";
const [mode, destination] = process.argv.slice(2);
if (!["export", "restore"].includes(mode) || !destination) {
  console.error(
    "Usage: node --env-file=.env.local scripts/backup.mjs export|restore /private/path/backup.json",
  );
  process.exit(1);
}
const url = process.env.CONTENT_REDIS_URL,
  token = process.env.CONTENT_REDIS_TOKEN;
const catalogKey = "pookie:catalog:v1",
  requestsKey = "pookie:requests:v1";
async function command(values) {
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) throw new Error("Storage request failed.");
  const d = await r.json();
  if (d.error) throw new Error("Storage command failed.");
  return d.result;
}
try {
  if (!url || !token)
    throw new Error(
      "Configure CONTENT_REDIS_URL and CONTENT_REDIS_TOKEN before backing up production storage. Local development data can be copied from .data/.",
    );
  if (mode === "export") {
    const [catalog, requests] = await command([
      "EVAL",
      "return {redis.call('GET',KEYS[1]) or '',redis.call('LRANGE',KEYS[2],0,-1)}",
      2,
      catalogKey,
      requestsKey,
    ]);
    const data = {
      format: "pookie-backup-v1",
      createdAt: new Date().toISOString(),
      catalog: catalog ? JSON.parse(catalog) : null,
      requests: requests.map((x) => JSON.parse(x)),
    };
    const target = resolve(destination);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, JSON.stringify(data, null, 2), {
      flag: "wx",
      mode: 0o600,
    });
    console.log(
      "Private backup created. It contains customer contact details; store it securely.",
    );
  } else {
    const contents = await readFile(resolve(destination), "utf8");
    if (Buffer.byteLength(contents) > 12000000)
      throw new Error("Backup is too large.");
    const data = JSON.parse(contents);
    if (
      data.format !== "pookie-backup-v1" ||
      !Array.isArray(data.requests) ||
      data.requests.length > 500 ||
      data.requests.some(
        (x) =>
          typeof x.id !== "string" ||
          typeof x.contact !== "string" ||
          typeof x.idea !== "string" ||
          typeof x.createdAt !== "string",
      )
    )
      throw new Error("Invalid request backup.");
    if (
      data.catalog &&
      (!Array.isArray(data.catalog.products) ||
        !Array.isArray(data.catalog.categories) ||
        !Array.isArray(data.catalog.reviews) ||
        !data.catalog.home)
    )
      throw new Error("Invalid catalog backup.");
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const answer = await rl.question(
      "This replaces the stored catalog and all requests. Export a current backup first. Type RESTORE to continue: ",
    );
    rl.close();
    if (answer !== "RESTORE") throw new Error("Restore cancelled.");
    // Advance the version to invalidate existing owner drafts, then restore both keys atomically.
    await command([
      "EVAL",
      "local old=redis.call('GET',KEYS[1]); local version=0; if old then version=cjson.decode(old).version end; redis.call('DEL',KEYS[1],KEYS[2]); if ARGV[1]~='' then local c=cjson.decode(ARGV[1]); c.version=version+1; redis.call('SET',KEYS[1],cjson.encode(c)) end; for i=2,#ARGV do redis.call('RPUSH',KEYS[2],ARGV[i]) end; return 1",
      2,
      catalogKey,
      requestsKey,
      data.catalog ? JSON.stringify(data.catalog) : "",
      ...data.requests.map((x) => JSON.stringify(x)),
    ]);
    console.log(
      "Backup restored. Reload the owner dashboard and verify the storefront.",
    );
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}

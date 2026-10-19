import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { hasRedis, redis } from "./catalog";
export interface CustomRequest {
  id: string;
  createdAt: string;
  name: string;
  contact: string;
  idea: string;
  colors: string;
  budget: string;
  personalization: string;
}
const file = path.join(
  process.env.POOKIE_DATA_DIR || path.join(process.cwd(), ".data"),
  "requests.json",
);
const key = "pookie:requests:v1";
let queue: Promise<unknown> = Promise.resolve();
export async function getRequests(): Promise<CustomRequest[]> {
  if (hasRedis())
    return (await redis(["LRANGE", key, 0, 499])).map((x: string) =>
      JSON.parse(x),
    );
  if (process.env.NODE_ENV === "production")
    throw new Error("Custom requests require durable storage.");
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}
export async function addRequest(
  value: Omit<CustomRequest, "id" | "createdAt">,
) {
  const entry = {
    ...value,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  if (hasRedis()) {
    const ok = await redis([
      "EVAL",
      "if redis.call('LLEN',KEYS[1])>=500 then return 0 end; redis.call('LPUSH',KEYS[1],ARGV[1]); return 1",
      1,
      key,
      JSON.stringify(entry),
    ]);
    if (ok !== 1)
      throw new Error(
        "The studio inbox is full. Please contact us on Instagram or WhatsApp.",
      );
  } else {
    const task = queue
      .catch(() => {})
      .then(async () => {
        const list = await getRequests();
        if (list.length >= 500)
          throw new Error(
            "The studio inbox is full. Please contact us directly.",
          );
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file + ".tmp", JSON.stringify([entry, ...list]));
        await fs.rename(file + ".tmp", file);
      });
    queue = task;
    await task;
  }
  return entry;
}
export async function deleteRequest(id: string) {
  if (hasRedis()) {
    const list = await redis(["LRANGE", key, 0, 499]);
    const item = list.find((x: string) => JSON.parse(x).id === id);
    if (item) await redis(["LREM", key, 1, item]);
  } else {
    const task = queue
      .catch(() => {})
      .then(async () => {
        const list = await getRequests();
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(
          file + ".tmp",
          JSON.stringify(list.filter((x) => x.id !== id)),
        );
        await fs.rename(file + ".tmp", file);
      });
    queue = task;
    await task;
  }
}

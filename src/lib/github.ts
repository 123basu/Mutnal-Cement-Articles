import type { Delivery, AdminProduct, AdminBlog, ContactMessage } from "@/lib/types";
import fs from "node:fs/promises";
import path from "node:path";

const OWNER_REPO = process.env.GITHUB_REPO || "";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const isDev = process.env.NODE_ENV === "development";

// ── Local file paths ──────────────────────────────────────────
const LOCAL_DELIVERIES = path.join(process.cwd(), "src/data/deliveries.json");
const LOCAL_PRODUCTS = path.join(process.cwd(), "src/data/products.json");
const LOCAL_BLOGS = path.join(process.cwd(), "src/data/blogs.json");
const LOCAL_CONTACTS = path.join(process.cwd(), "src/data/contacts.json");

// ── Helpers ────────────────────────────────────────────────────
function apiUrl(repoPath: string) {
  const [owner, repo] = OWNER_REPO.split("/");
  return `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`;
}

async function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function ghRead(repoPath: string): Promise<{ content: string; sha: string }> {
  const res = await fetch(apiUrl(repoPath), { headers: await ghHeaders(), cache: "no-store" });
  if (!res.ok) throw new Error(`GitHub read failed (${repoPath}): ${res.status}`);
  const data = (await res.json()) as { content: string; sha: string };
  return { content: Buffer.from(data.content, "base64").toString("utf-8"), sha: data.sha };
}

async function ghWrite(repoPath: string, content: string, sha: string | null, message: string): Promise<void> {
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content).toString("base64"),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;
  const res = await fetch(apiUrl(repoPath), {
    method: "PUT",
    headers: await ghHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub write failed (${repoPath}): ${res.status} ${text}`);
  }
}

async function ghDelete(repoPath: string, sha: string, message: string): Promise<void> {
  const res = await fetch(apiUrl(repoPath), {
    method: "DELETE",
    headers: await ghHeaders(),
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub delete failed (${repoPath}): ${res.status} ${text}`);
  }
}

// ── JSON data helpers ──────────────────────────────────────────
const DATA_FILES = {
  deliveries: "src/data/deliveries.json",
  products: "src/data/products.json",
  blogs: "src/data/blogs.json",
  contacts: "src/data/contacts.json",
} as const;

type DataKey = keyof typeof DATA_FILES;

async function readJson<T>(key: DataKey, localPath: string): Promise<{ data: T; sha: string | null }> {
  if (isDev) {
    const raw = await fs.readFile(localPath, "utf-8");
    return { data: JSON.parse(raw) as T, sha: "local" };
  }
  const repoPath = DATA_FILES[key];
  const { content, sha } = await ghRead(repoPath);
  return { data: JSON.parse(content) as T, sha };
}

async function writeJson<T>(key: DataKey, localPath: string, data: T, sha: string | null, message: string): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  if (isDev) {
    await fs.writeFile(localPath, json, "utf-8");
    return;
  }
  await ghWrite(DATA_FILES[key], json, sha, message);
}

// ── Deliveries ─────────────────────────────────────────────────
export async function readDeliveriesLocal(): Promise<{ deliveries: Delivery[]; sha: string }> {
  const raw = await fs.readFile(LOCAL_DELIVERIES, "utf-8");
  const parsed = JSON.parse(raw) as { deliveries: Delivery[] };
  return { deliveries: parsed.deliveries, sha: "local" };
}

export async function writeDeliveriesLocal(deliveries: Delivery[]): Promise<void> {
  await fs.writeFile(LOCAL_DELIVERIES, JSON.stringify({ deliveries }, null, 2), "utf-8");
}

export interface DeliveriesFile { deliveries: Delivery[] }

export async function readDeliveries(): Promise<DeliveriesFile & { sha: string }> {
  const { data, sha } = await readJson<DeliveriesFile>("deliveries", LOCAL_DELIVERIES);
  return { ...data, sha: sha! };
}

export async function writeDeliveries(deliveries: Delivery[], sha: string): Promise<void> {
  await writeJson("deliveries", LOCAL_DELIVERIES, { deliveries }, sha, "chore: update deliveries via admin panel");
}

// ── Products ───────────────────────────────────────────────────
export interface ProductsFile { products: AdminProduct[] }

export async function readProducts(): Promise<ProductsFile> {
  const { data } = await readJson<ProductsFile>("products", LOCAL_PRODUCTS);
  return data;
}

export async function writeProducts(products: AdminProduct[]): Promise<void> {
  const { sha } = await readJson<ProductsFile>("products", LOCAL_PRODUCTS).catch(() => ({ sha: null } as { sha: string | null }));
  await writeJson("products", LOCAL_PRODUCTS, { products }, sha, "chore: update products via admin panel");
}

// ── Blogs ──────────────────────────────────────────────────────
export interface BlogsFile { blogs: AdminBlog[] }

export async function readBlogs(): Promise<BlogsFile> {
  const { data } = await readJson<BlogsFile>("blogs", LOCAL_BLOGS);
  return data;
}

export async function writeBlogs(blogs: AdminBlog[]): Promise<void> {
  const { sha } = await readJson<BlogsFile>("blogs", LOCAL_BLOGS).catch(() => ({ sha: null } as { sha: string | null }));
  await writeJson("blogs", LOCAL_BLOGS, { blogs }, sha, "chore: update blogs via admin panel");
}

// ── Contacts ───────────────────────────────────────────────────
export async function readContacts(): Promise<ContactMessage[]> {
  try {
    const { data } = await readJson<ContactMessage[]>("contacts", LOCAL_CONTACTS);
    return data;
  } catch {
    return [];
  }
}

export async function writeContacts(contacts: ContactMessage[]): Promise<void> {
  const { sha } = await readJson<ContactMessage[]>("contacts", LOCAL_CONTACTS).catch(() => ({ sha: null } as { sha: string | null }));
  await writeJson("contacts", LOCAL_CONTACTS, contacts, sha, "chore: update contacts via admin panel");
}

export async function appendContact(contact: ContactMessage): Promise<void> {
  const contacts = await readContacts();
  contacts.push(contact);
  await writeContacts(contacts);
}

// ── Image upload ───────────────────────────────────────────────
export async function uploadImage(filename: string, buffer: Buffer): Promise<string> {
  const repoPath = `public/images/products/${filename}`;
  if (isDev) {
    const dir = path.join(process.cwd(), "public/images/products");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), buffer);
    return `/images/products/${filename}`;
  }
  await ghWrite(repoPath, buffer.toString("base64"), null, `chore: upload product image ${filename}`);
  return `/images/products/${filename}`;
}

export async function deleteImage(url: string): Promise<void> {
  if (!url) return;
  const filename = path.basename(url);
  const repoPath = `public/images/products/${filename}`;
  if (isDev) {
    const filePath = path.join(process.cwd(), "public/images/products", filename);
    await fs.unlink(filePath).catch(() => {});
    return;
  }
  try {
    const { sha } = await ghRead(repoPath);
    await ghDelete(repoPath, sha, `chore: delete product image ${filename}`);
  } catch {
    // image may not exist on GitHub, ignore
  }
}

import type { Delivery, AdminProduct, AdminBlog, ContactMessage } from "@/lib/types";
import fs from "node:fs/promises";
import path from "node:path";

const OWNER_REPO = process.env.GITHUB_REPO || "";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const PATH = "src/data/deliveries.json";
const LOCAL_PATH = path.join(process.cwd(), PATH);
const PRODUCTS_PATH = path.join(process.cwd(), "src/data/products.json");
const BLOGS_PATH = path.join(process.cwd(), "src/data/blogs.json");
const CONTACTS_PATH = path.join(process.cwd(), "src/data/contacts.json");

function apiBase() {
  const [owner, repo] = OWNER_REPO.split("/");
  return `https://api.github.com/repos/${owner}/${repo}/contents/${PATH}`;
}

async function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export interface DeliveriesFile {
  deliveries: Delivery[];
}

export async function readDeliveriesLocal(): Promise<DeliveriesFile & { sha: string }> {
  const content = await fs.readFile(LOCAL_PATH, "utf-8");
  return { ...(JSON.parse(content) as DeliveriesFile), sha: "local" };
}

export async function writeDeliveriesLocal(deliveries: Delivery[]): Promise<void> {
  await fs.writeFile(LOCAL_PATH, JSON.stringify({ deliveries }, null, 2), "utf-8");
}

export async function readDeliveries(): Promise<DeliveriesFile> {
  const res = await fetch(apiBase(), {
    headers: await headers(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`GitHub read failed: ${res.status}`);
  }
  const data = (await res.json()) as { content: string; sha: string };
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  return { ...(JSON.parse(decoded) as DeliveriesFile), sha: data.sha } as DeliveriesFile & {
    sha: string;
  };
}

export async function writeDeliveries(
  deliveries: Delivery[],
  sha: string
): Promise<void> {
  const body = {
    message: "chore: update deliveries via admin panel",
    content: Buffer.from(JSON.stringify({ deliveries }, null, 2)).toString("base64"),
    branch: BRANCH,
    sha,
  };
  const res = await fetch(apiBase(), {
    method: "PUT",
    headers: await headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub write failed: ${res.status} ${text}`);
  }
}

export interface ProductsFile {
  products: AdminProduct[];
}

export async function readProducts(): Promise<ProductsFile> {
  const content = await fs.readFile(PRODUCTS_PATH, "utf-8");
  return JSON.parse(content) as ProductsFile;
}

export async function writeProducts(products: AdminProduct[]): Promise<void> {
  await fs.writeFile(PRODUCTS_PATH, JSON.stringify({ products }, null, 2), "utf-8");
}

export interface BlogsFile {
  blogs: AdminBlog[];
}

export async function readBlogs(): Promise<BlogsFile> {
  const content = await fs.readFile(BLOGS_PATH, "utf-8");
  return JSON.parse(content) as BlogsFile;
}

export async function writeBlogs(blogs: AdminBlog[]): Promise<void> {
  await fs.writeFile(BLOGS_PATH, JSON.stringify({ blogs }, null, 2), "utf-8");
}

export async function readContacts(): Promise<ContactMessage[]> {
  try {
    const content = await fs.readFile(CONTACTS_PATH, "utf-8");
    return JSON.parse(content) as ContactMessage[];
  } catch {
    return [];
  }
}

export async function writeContacts(contacts: ContactMessage[]): Promise<void> {
  await fs.writeFile(CONTACTS_PATH, JSON.stringify(contacts, null, 2), "utf-8");
}

export async function appendContact(contact: ContactMessage): Promise<void> {
  const contacts = await readContacts();
  contacts.push(contact);
  await writeContacts(contacts);
}

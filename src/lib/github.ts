import type { Delivery } from "@/lib/types";

const OWNER_REPO = process.env.GITHUB_REPO || "";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const PATH = "src/data/deliveries.json";

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

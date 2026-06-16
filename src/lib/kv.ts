import { Redis } from '@upstash/redis';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  dates?: string;
  message?: string;
  source: 'contact' | 'quick';
  read: boolean;
  createdAt: string;
}

const LIST_KEY = 'inquiries:list';
const READ_KEY = 'inquiries:read';
const DEV_STORE = path.join(process.cwd(), 'data', 'inquiries.json');

function getRedis(): Redis | null {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;
  return new Redis({ url, token });
}

function kvUnavailableError(): Error {
  return new Error(
    'Redis is not configured. Set KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).'
  );
}

async function readDevStore(): Promise<Inquiry[]> {
  try {
    const raw = await fs.readFile(DEV_STORE, 'utf-8');
    return JSON.parse(raw) as Inquiry[];
  } catch {
    return [];
  }
}

async function writeDevStore(inquiries: Inquiry[]): Promise<void> {
  await fs.mkdir(path.dirname(DEV_STORE), { recursive: true });
  await fs.writeFile(DEV_STORE, JSON.stringify(inquiries, null, 2), 'utf-8');
}

export async function addInquiry(
  data: Omit<Inquiry, 'id' | 'read' | 'createdAt'>
): Promise<string> {
  const id = randomUUID();
  const inquiry: Inquiry = {
    ...data,
    id,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const redis = getRedis();
  if (!redis) {
    if (process.env.NODE_ENV === 'development') {
      const existing = await readDevStore();
      existing.unshift(inquiry);
      await writeDevStore(existing);
      return id;
    }
    throw kvUnavailableError();
  }

  await redis.lpush(LIST_KEY, JSON.stringify(inquiry));
  return id;
}

export async function getInquiries(): Promise<Inquiry[]> {
  const redis = getRedis();
  if (!redis) {
    if (process.env.NODE_ENV === 'development') {
      return readDevStore();
    }
    return [];
  }

  const raw = await redis.lrange<string>(LIST_KEY, 0, -1);
  if (!raw || raw.length === 0) {
    return [];
  }

  const readIds = await redis.hgetall<Record<string, string>>(READ_KEY);
  const readSet = new Set(Object.keys(readIds ?? {}));

  const inquiries: Inquiry[] = raw
    .map((item) => {
      try {
        const parsed = typeof item === 'string' ? JSON.parse(item) : item;
        return {
          ...parsed,
          read: readSet.has(parsed.id) || parsed.read === true,
        } as Inquiry;
      } catch {
        return null;
      }
    })
    .filter((item): item is Inquiry => item !== null);

  inquiries.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return inquiries;
}

export async function markRead(id: string): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    if (process.env.NODE_ENV === 'development') {
      const inquiries = await readDevStore();
      const updated = inquiries.map((item) =>
        item.id === id ? { ...item, read: true } : item
      );
      await writeDevStore(updated);
      return;
    }
    throw kvUnavailableError();
  }

  await redis.hset(READ_KEY, { [id]: '1' });
}

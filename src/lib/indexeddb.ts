import { InvoiceData, defaultInvoice } from '@/types/invoice';

const DB_NAME = 'invoice-generator';
const DB_VERSION = 1;
const STORE_NAME = 'invoice-data';
const DATA_KEY = 'current';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveInvoice(data: InvoiceData): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(data, DATA_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadInvoice(): Promise<InvoiceData> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(DATA_KEY);
    req.onsuccess = () => resolve(req.result ?? defaultInvoice);
    req.onerror = () => reject(req.error);
  });
}

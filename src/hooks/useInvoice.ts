import { useState, useEffect, useCallback, useRef } from 'react';
import { InvoiceData, InvoiceItem, defaultInvoice } from '@/types/invoice';
import { saveInvoice, loadInvoice } from '@/lib/indexeddb';

export function useInvoice() {
  const [data, setData] = useState<InvoiceData>(defaultInvoice);
  const [loaded, setLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    loadInvoice().then((saved) => {
      setData(saved);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveInvoice(data);
    }, 500);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  }, [data, loaded]);

  const updateField = useCallback(<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateItem = useCallback((id: string, field: keyof InvoiceItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item),
    }));
  }, []);

  const addItem = useCallback(() => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0 }],
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter(item => item.id !== id) : prev.items,
    }));
  }, []);

  const resetData = useCallback(() => {
    setData({ ...defaultInvoice, items: [{ id: Date.now().toString(), description: '', quantity: 1, rate: 0 }] });
  }, []);

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);

  return { data, updateField, updateItem, addItem, removeItem, resetData, subtotal, loaded };
}

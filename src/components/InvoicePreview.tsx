import { useState } from 'react';
import { InvoiceData } from '@/types/invoice';
import { X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  data: InvoiceData;
  subtotal: number;
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export default function InvoicePreview({ data, subtotal }: Props) {
  return (
    <div className="flex-1 min-h-[50vh] md:min-h-screen flex items-start justify-center p-6 md:p-10 overflow-auto bg-background">
      <div className="relative w-full max-w-[720px]">
        {/* Social links - top-right of paper, hidden on print */}
        <div className="no-print flex items-center gap-3 justify-end mb-2 pr-1 ">
          {/* <a
            href="https://x.com/seu-usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            aria-label="Twitter / X"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a> */}
          <a
            href="https://github.com/Victor-MT/meureciboonline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            aria-label="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
        <div id="invoice-preview" className="invoice-paper w-full rounded-lg p-8 md:p-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="font-mono-display text-xl font-bold tracking-tight">
              {data.companyName || 'Sua Empresa'}
            </h2>
            {data.companyCnpj && <p className="text-xs text-muted-foreground mt-1">{data.companyCnpj}</p>}
            {data.companyAddress && <p className="text-xs text-muted-foreground">{data.companyAddress}</p>}
            {data.companyPhone && <p className="text-xs text-muted-foreground">{data.companyPhone}</p>}
            {data.companyEmail && <p className="text-xs text-muted-foreground">{data.companyEmail}</p>}
          </div>
          <div className="text-right">
            <h1 className="font-mono-display text-3xl font-bold tracking-tight text-accent">RECIBO</h1>
            <p className="font-mono-display text-sm text-muted-foreground mt-1">{data.invoiceNumber}</p>
          </div>
        </div>

        {/* Bill To + Dates */}
        <div className="flex justify-between mb-8 pb-6 border-b border-border">
          <div>
            <p className="font-mono-display text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2">Cobrar de</p>
            <p className="text-sm font-medium">{data.clientName || '—'}</p>
            {data.clientCnpjCpf && <p className="text-xs text-muted-foreground">{data.clientCnpjCpf}</p>}
            {data.clientEmail && <p className="text-xs text-muted-foreground">{data.clientEmail}</p>}
            {data.clientAddress && <p className="text-xs text-muted-foreground">{data.clientAddress}</p>}
          </div>
          <div className="text-right">
            <div className="mb-3">
              <p className="font-mono-display text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Emissão</p>
              <p className="text-sm">{formatDate(data.issueDate)}</p>
            </div>
            {data.dueDate && (
              <div>
                <p className="font-mono-display text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Vencimento</p>
                <p className="text-sm">{formatDate(data.dueDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b border-foreground/10">
              <th className="font-mono-display text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-left pb-2">Descrição</th>
              <th className="font-mono-display text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-center pb-2 w-16">Qtd</th>
              <th className="font-mono-display text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-right pb-2 w-28">Valor</th>
              <th className="font-mono-display text-[11px] font-semibold tracking-wider text-muted-foreground uppercase text-right pb-2 w-28">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map(item => (
              <tr key={item.id} className="border-b border-border/50">
                <td className="py-3 text-sm">{item.description || '—'}</td>
                <td className="py-3 text-sm text-center">{item.quantity}</td>
                <td className="py-3 text-sm text-right">{formatCurrency(item.rate)}</td>
                <td className="py-3 text-sm text-right">{formatCurrency(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-56">
            <div className="flex justify-between py-1.5 text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-foreground/10 font-semibold text-base">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        {(data.pixKey || data.bankName || data.paymentMethod === 'Boleto') && (
          <div className="border-t border-border pt-6 mb-6">
            <p className="font-mono-display text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3">Dados para Pagamento</p>
            <p className="text-sm mb-1"><span className="text-muted-foreground">Método:</span> {data.paymentMethod}</p>
            {data.bankName && <p className="text-sm"><span className="text-muted-foreground">Banco:</span> {data.bankName}</p>}
            {data.paymentMethod === 'Transferência Bancária' && (
              <>
                {data.bankAgency && <p className="text-sm"><span className="text-muted-foreground">Agência:</span> {data.bankAgency}</p>}
                {data.bankAccount && <p className="text-sm"><span className="text-muted-foreground">Conta:</span> {data.bankAccount}</p>}
              </>
            )}
            {data.paymentMethod === 'PIX' && data.pixKey && (
              <p className="text-sm">
                <span className="text-muted-foreground">PIX ({data.pixKeyType}):</span> {data.pixKey}
              </p>
            )}
          </div>
        )}

        {/* Notes */}
        {data.notes && (
          <div className="border-t border-border pt-6">
            <p className="font-mono-display text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2">Observações</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.notes}</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

import { InvoiceData } from '@/types/invoice';

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
    <div className="flex-1 min-h-screen flex items-start justify-center p-6 md:p-10 overflow-auto bg-background">
      <div id="invoice-preview" className="invoice-paper w-full max-w-[720px] rounded-lg p-8 md:p-12">
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
            <h1 className="font-mono-display text-3xl font-bold tracking-tight text-accent">INVOICE</h1>
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
        {(data.pixKey || data.bankName) && (
          <div className="border-t border-border pt-6 mb-6">
            <p className="font-mono-display text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3">Dados para Pagamento</p>
            {data.bankName && <p className="text-sm"><span className="text-muted-foreground">Banco:</span> {data.bankName}</p>}
            {data.pixKey && (
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
  );
}

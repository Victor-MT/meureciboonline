import { Plus, Trash2, Download, RotateCcw } from 'lucide-react';
import { InvoiceData, InvoiceItem } from '@/types/invoice';
import { useState } from 'react';

interface Props {
  data: InvoiceData;
  updateField: <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => void;
  updateItem: (id: string, field: keyof InvoiceItem, value: string | number) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
  resetData: () => void;
  onPrint: () => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="sidebar-section-label mt-6 mb-3 first:mt-0">{children}</p>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-muted-foreground mb-1">{children}</label>;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCnpjCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  if (digits.length <= 11) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function validateCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(digits[10]);
}

function validateCnpj(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(digits[i]) * weights1[i];
  let rest = sum % 11;
  if (rest < 2) { if (parseInt(digits[12]) !== 0) return false; }
  else { if (parseInt(digits[12]) !== 11 - rest) return false; }
  sum = 0;
  for (let i = 0; i < 13; i++) sum += parseInt(digits[i]) * weights2[i];
  rest = sum % 11;
  if (rest < 2) return parseInt(digits[13]) === 0;
  return parseInt(digits[13]) === 11 - rest;
}

function validateCpfCnpj(value: string): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return undefined;
  if (digits.length <= 11) {
    if (digits.length < 11) return 'CPF incompleto';
    if (!validateCpf(value)) return 'CPF inválido';
  } else {
    if (digits.length < 14) return 'CNPJ incompleto';
    if (!validateCnpj(value)) return 'CNPJ inválido';
  }
  return undefined;
}

function isValidEmail(email: string): boolean {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Field({ label, value, onChange, placeholder, type = 'text', error }: {
  label: string; value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string; error?: string;
}) {
  return (
    <div className="mb-3">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-colors ${error ? 'border-destructive' : 'border-input'}`}
      />
      {error && <p className="text-[11px] text-destructive mt-1">{error}</p>}
    </div>
  );
}

function RateInput({ rate, onChange }: { rate: number; onChange: (v: number) => void }) {
  const [localValue, setLocalValue] = useState(rate === 0 ? '' : String(rate));
  const [focused, setFocused] = useState(false);

  if (!focused && rate !== 0 && String(rate) !== localValue) {
    setLocalValue(String(rate));
  }
  if (!focused && rate === 0 && localValue !== '') {
    setLocalValue('');
  }

  return (
    <div>
      <span className="text-[10px] text-muted-foreground">Valor (R$)</span>
      <input
        type="text"
        inputMode="decimal"
        value={localValue}
        onFocus={() => setFocused(true)}
        onChange={e => {
          const val = e.target.value;
          setLocalValue(val);
          if (val === '') {
            onChange(0);
          } else {
            const num = parseFloat(val);
            if (!isNaN(num)) onChange(num);
          }
        }}
        onBlur={() => {
          setFocused(false);
          if (localValue === '') onChange(0);
        }}
        placeholder="0,00"
        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
      />
    </div>
  );
}

export default function InvoiceSidebar({ data, updateField, updateItem, addItem, removeItem, resetData, onPrint }: Props) {
  const [emailErrors, setEmailErrors] = useState<{ company?: string; client?: string }>({});
  const [docErrors, setDocErrors] = useState<{ company?: string; client?: string }>({});

  const handleEmailChange = (field: 'companyEmail' | 'clientEmail', value: string) => {
    updateField(field, value);
    const key = field === 'companyEmail' ? 'company' : 'client';
    if (value && !isValidEmail(value)) {
      setEmailErrors(prev => ({ ...prev, [key]: 'E-mail inválido' }));
    } else {
      setEmailErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const handleDocChange = (field: 'companyCnpj' | 'clientCnpjCpf', value: string) => {
    const formatted = formatCnpjCpf(value);
    updateField(field, formatted);
    const key = field === 'companyCnpj' ? 'company' : 'client';
    const error = validateCpfCnpj(formatted);
    setDocErrors(prev => ({ ...prev, [key]: error }));
  };

  const handlePhoneChange = (value: string) => {
    updateField('companyPhone', formatPhone(value));
  };

  return (
    <aside className="no-print w-full md:w-[340px] lg:w-[380px] shrink-0 md:h-screen overflow-y-auto border-b md:border-b-0 md:border-r border-border bg-card p-5 pt-14 md:pt-5">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-mono-display text-lg font-bold tracking-tight">
          Meu <span className="text-accent">Recibo</span> <span style={{ color: 'hsl(51 100% 40% / 0.75)' }}>Online</span>
        </h1>
        <button
          onClick={resetData}
          title="Limpar todos os campos"
          className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
        >
          <RotateCcw className="h-3 w-3" /> Limpar
        </button>
      </div>

      <SectionLabel>Emissor</SectionLabel>
      <Field label="Razão Social / Nome" value={data.companyName} onChange={v => updateField('companyName', v)} placeholder="Sua Empresa Ltda" />
      <Field label="CNPJ / CPF" value={data.companyCnpj} onChange={v => handleDocChange('companyCnpj', v)} placeholder="00.000.000/0000-00" error={docErrors.company} />
      <Field label="E-mail" value={data.companyEmail} onChange={v => handleEmailChange('companyEmail', v)} placeholder="contato@empresa.com" error={emailErrors.company} />
      <Field label="Endereço" value={data.companyAddress} onChange={v => updateField('companyAddress', v)} placeholder="Rua Exemplo, 123 - São Paulo, SP" />
      <Field label="Telefone" value={data.companyPhone} onChange={v => handlePhoneChange(v)} placeholder="(11) 99999-9999" />

      <SectionLabel>Cliente</SectionLabel>
      <Field label="Nome / Razão Social" value={data.clientName} onChange={v => updateField('clientName', v)} placeholder="Cliente Exemplo" />
      <Field label="CNPJ / CPF" value={data.clientCnpjCpf} onChange={v => handleDocChange('clientCnpjCpf', v)} placeholder="000.000.000-00" error={docErrors.client} />
      <Field label="E-mail" value={data.clientEmail} onChange={v => handleEmailChange('clientEmail', v)} placeholder="cliente@email.com" error={emailErrors.client} />
      <Field label="Endereço" value={data.clientAddress} onChange={v => updateField('clientAddress', v)} placeholder="Av. Brasil, 456 - Rio de Janeiro, RJ" />

      <SectionLabel>Pagamento</SectionLabel>
      <div className="mb-3">
        <FieldLabel>Método de Pagamento</FieldLabel>
        <select
          value={data.paymentMethod}
          onChange={e => updateField('paymentMethod', e.target.value as InvoiceData['paymentMethod'])}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-colors"
        >
          <option value="PIX">PIX</option>
          <option value="Transferência Bancária">Transferência Bancária</option>
          <option value="Boleto">Boleto</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      {data.paymentMethod === 'PIX' && (
        <>
          <div className="mb-3">
            <FieldLabel>Tipo da chave PIX</FieldLabel>
            <select
              value={data.pixKeyType}
              onChange={e => updateField('pixKeyType', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-colors"
            >
              <option value="CPF">CPF</option>
              <option value="CNPJ">CNPJ</option>
              <option value="E-mail">E-mail</option>
              <option value="Telefone">Telefone</option>
              <option value="Aleatória">Chave Aleatória</option>
            </select>
          </div>
          <Field label="Chave PIX" value={data.pixKey} onChange={v => updateField('pixKey', v)} placeholder="Sua chave PIX" />
        </>
      )}

      {(data.paymentMethod === 'PIX' || data.paymentMethod === 'Transferência Bancária') && (
        <>
          <Field label="Banco" value={data.bankName} onChange={v => updateField('bankName', v)} placeholder="Nubank, Itaú, etc." />
          {data.paymentMethod === 'Transferência Bancária' && (
            <>
              <Field label="Agência" value={data.bankAgency} onChange={v => updateField('bankAgency', v)} placeholder="0001" />
              <Field label="Conta" value={data.bankAccount} onChange={v => updateField('bankAccount', v)} placeholder="12345-6" />
            </>
          )}
        </>
      )}

      <SectionLabel>Detalhes</SectionLabel>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nº do Recibo" value={data.invoiceNumber} onChange={v => updateField('invoiceNumber', v)} />
        <Field label="Data de Emissão" value={data.issueDate} onChange={v => updateField('issueDate', v)} type="date" />
      </div>
      <Field label="Data de Vencimento" value={data.dueDate} onChange={v => updateField('dueDate', v)} type="date" />

      <SectionLabel>Itens</SectionLabel>
      {data.items.map((item, i) => (
        <div key={item.id} className="mb-3 p-3 rounded-md border border-border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Item {i + 1}</span>
            {data.items.length > 1 && (
              <button onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive/80 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <input
            value={item.description}
            onChange={e => updateItem(item.id, 'description', e.target.value)}
            placeholder="Descrição do serviço"
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm mb-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-muted-foreground">Qtd</span>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
              />
            </div>
            <RateInput
              rate={item.rate}
              onChange={val => updateItem(item.id, 'rate', val)}
            />
          </div>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full flex items-center justify-center gap-2 rounded-md border border-dashed border-border py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
      >
        <Plus className="h-4 w-4" /> Adicionar item
      </button>

      <SectionLabel>Assinatura</SectionLabel>
      <label className="flex items-center gap-2.5 mb-4 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={data.showSignature}
          onChange={e => updateField('showSignature', e.target.checked)}
          className="h-4 w-4 rounded border-input accent-accent"
        />
        <span className="text-sm text-foreground">Exibir linha de assinatura</span>
      </label>

      <SectionLabel>Observações</SectionLabel>
      <textarea
        value={data.notes}
        onChange={e => updateField('notes', e.target.value)}
        placeholder="Observações adicionais..."
        rows={3}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors resize-none mb-4"
      />

      <button
        onClick={onPrint}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-accent text-accent-foreground py-2.5 text-sm font-medium hover:bg-accent/90 transition-colors"
      >
        <Download className="h-4 w-4" /> Baixar PDF
      </button>
    </aside>
  );
}

import { useInvoice } from '@/hooks/useInvoice';
import InvoiceSidebar from '@/components/InvoiceSidebar';
import InvoicePreview from '@/components/InvoicePreview';
import { ShieldCheck } from 'lucide-react';
import { trackEvent } from "../utils/analytics";

const Index = () => {
  const { data, updateField, updateItem, addItem, removeItem, resetData, subtotal, loaded } = useInvoice();

  const handlePrint = () => {

    trackEvent("print_receipt", {
      event_category: "engagement",
      event_label: "botao_imprimir"
    });
    
    window.print();
    
    if (data.showSignature) {
      setTimeout(() => {
        import('sonner').then(({ toast }) => {
          toast('✍️ Assine seu documento digitalmente!', {
            description: 'Use a assinatura eletrônica do Gov.br para validar seu recibo com validade jurídica.',
            duration: 12000,
            action: {
              label: 'Assinar no Gov.br →',
              onClick: () => {
                
                trackEvent("click_gov_signature", {
                  event_category: "engagement",
                  event_label: "link_assinatura_gov"
                });

                window.open('https://www.gov.br/governodigital/pt-br/identidade/assinatura-eletronica', '_blank')
              },
            },
          });
        });
      }, 1000);
    }
  };

  if (!loaded) return null;

  return (
    <div className="flex flex-col min-h-screen">

      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-1">
        <InvoiceSidebar
          data={data}
          updateField={updateField}
          updateItem={updateItem}
          addItem={addItem}
          removeItem={removeItem}
          resetData={resetData}
          onPrint={handlePrint}
        />
        <InvoicePreview data={data} subtotal={subtotal} />
      </div>

      {/* Footer */}
      <footer className="no-print border-t border-border bg-card px-6 py-6 text-center text-xs text-muted-foreground space-y-3">
        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" />
          <p>
            Seus dados são armazenados exclusivamente no seu navegador. Nenhuma informação é enviada para servidores externos, garantindo total privacidade.
          </p>
        </div>
        <p>
          Inspirado em{' '}
          <a href="https://invoi.xyz/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">
            invoi.xyz
          </a>
          {' '}· Desenvolvido por{' '}
          <a href="https://github.com/Victor-MT" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Victor Hugo
          </a>
          {' '}e{' '}
          <a href="https://github.com/c4iofranca" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Caio França
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;

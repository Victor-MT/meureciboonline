import { useInvoice } from '@/hooks/useInvoice';
import InvoiceSidebar from '@/components/InvoiceSidebar';
import InvoicePreview from '@/components/InvoicePreview';

const Index = () => {
  const { data, updateField, updateItem, addItem, removeItem, subtotal, loaded } = useInvoice();

  const handlePrint = () => {
    window.print();
  };

  if (!loaded) return null;

  return (
    <div className="flex min-h-screen">
      <InvoiceSidebar
        data={data}
        updateField={updateField}
        updateItem={updateItem}
        addItem={addItem}
        removeItem={removeItem}
        onPrint={handlePrint}
      />
      <InvoicePreview data={data} subtotal={subtotal} />
    </div>
  );
};

export default Index;

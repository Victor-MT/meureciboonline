# Meu Recibo Online

Aplicação web para criação de recibos profissionais, com visualização em tempo real, suporte a múltiplos itens e exportação para PDF via impressão do navegador.

![Demo do Meu Recibo Online](/assets/meureciboonline.png)
## Objetivo do projeto

Facilitar a emissão de recibos de prestação de serviços de forma rápida, simples e privada, sem necessidade de backend.

Os dados são persistidos localmente no navegador (IndexedDB), sem envio para servidores externos. Garantido privacidade aos dados sensíveis do usuário.

## Funcionalidades

- Cadastro de dados do emissor e do cliente
- Suporte a CPF/CNPJ, e-mail, endereço e telefone
- Itens dinâmicos com quantidade e valor unitário
- Cálculo automático de subtotal e total
- Métodos de pagamento: PIX, Transferência Bancária, Boleto e Outro
- Dados específicos de pagamento (chave PIX, banco, agência, conta)
- Campo de observações no recibo
- Exportação para PDF usando `window.print()`
- Salvamento automático local com IndexedDB

## Stack tecnológica

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- shadcn/ui + Radix UI
- React Router DOM
- Vitest + Testing Library

## Como rodar localmente

### Pré-requisitos

- Node.js 18+ (recomendado Node.js 20+)
- npm 9+

### Passo a passo

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd meureciboonline
npm install
npm run dev
```

Após iniciar, acesse o endereço exibido no terminal (por padrão, `http://localhost:5173`).

## Scripts disponíveis

- `npm run dev`: inicia ambiente de desenvolvimento
- `npm run build`: gera build de produção
- `npm run preview`: serve build localmente
- `npm run lint`: executa lint com ESLint
- `npm run test`: executa testes uma vez
- `npm run test:watch`: executa testes em modo observação

## Estrutura do projeto

```text
src/
  components/    # Componentes visuais (sidebar, preview, UI base)
  hooks/         # Regras de estado e lógica da aplicação
  lib/           # Utilitários e integração com IndexedDB
  pages/         # Páginas da aplicação
  types/         # Tipagens de domínio (InvoiceData, InvoiceItem)
  test/          # Setup e testes automatizados
```

## Privacidade

Este projeto armazena os dados apenas no navegador do usuário, via IndexedDB.
Nenhuma informação de recibo é enviada para APIs externas.

## Deploy

O projeto é uma SPA estática e pode ser publicado em provedores como:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages (com configuração de rotas SPA)

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).

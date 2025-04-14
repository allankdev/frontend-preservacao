# 🌐 Sistema de Preservação Digital – Frontend

Este repositório contém o **frontend** da aplicação fullstack de preservação digital de documentos PDF. A aplicação interage com um backend construído em NestJS que simula o fluxo SIP/AIP/DIP do padrão **Archivematica**, com autenticação via JWT e visualização segura de PDFs.

---

## 🚀 Tecnologias Utilizadas

| Camada     | Tecnologias                                                   |
|------------|---------------------------------------------------------------|
| Frontend   | [Next.js](https://nextjs.org/), App Router, React Hook Form   |
| UI/UX      | TailwindCSS, [ShadCN UI](https://ui.shadcn.com/)              |
| Estado     | Zustand (authStore opcional), useState/useEffect              |
| Autenticação | Cookies HttpOnly + token JWT integrado com backend          |
| Utilitários | Axios, date-fns, lucide-react, classnames                    |

---

## 🖥️ Funcionalidades Implementadas

### 🔐 Autenticação
- Login (`/login`) e registro (`/register`) com JWT salvo via `cookie HttpOnly`
- Redirecionamento automático ao logar
- Navbar adaptativa com base no estado de autenticação
- Proteção de rotas por verificação de token (`useAuth()`)

### 📄 Documentos
- Upload de novo documento (`/upload`)
  - Campos: nome do documento, autor, tema, linguagem, ano
  - Upload de arquivo PDF (`multipart/form-data`)
- Listagem de documentos (`/dashboard`)
  - Filtros por nome, status, metadados e data
  - Polling automático para atualização do status de preservação
- Detalhes do documento (`/document/:id`)
  - Visualização segura do PDF com token temporário via `<iframe>`
  - Compartilhamento por link, WhatsApp, Telegram e Email
  - Download de PDF e metadados `.json`
  - Exclusão de documento com diálogo de confirmação

---

## 🌐 Comunicação com o Backend

A API é consumida diretamente via Axios, configurado em `lib/api.ts`. O backend deve estar rodando localmente em `http://localhost:3000`, ou a URL configurada na variável de ambiente:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
O frontend depende de um backend funcional para autenticação, upload e recuperação dos dados. Verifique que o backend esteja ativo antes de usar o frontend.

📦 Estrutura do Projeto
bash
Copiar
Editar
/app
  ├── login/
  ├── register/
  ├── upload/
  ├── dashboard/
  ├── document/[id]/
/components
  ├── ui/              # Componentes visuais do ShadCN
  ├── shared/          # Componentes compartilhados (Navbar, etc.)
/lib
  ├── api.ts           # Instância do Axios
  ├── auth.ts          # Funções auxiliares de autenticação
/hooks
  ├── useAuth.ts       # Hook para autenticação via cookie JWT

🧪 Como rodar o frontend localmente
1. Clone o repositório
bash
Copiar
Editar
git clone https://github.com/allankdev/frontend-preservacao.git
cd frontend-preservacao
2. Instale as dependências
bash
Copiar
Editar
npm install
3. Configure as variáveis de ambiente
Crie um .env.local:

env
Copiar
Editar
NEXT_PUBLIC_API_URL=http://localhost:3000
Altere a URL se o backend estiver rodando em outra porta ou domínio.

4. Inicie o servidor de desenvolvimento
bash
Copiar
Editar
npm run dev
O app estará disponível em: http://localhost:3001 ou conforme a porta usada

🔐 Login de Teste
Registre-se via /register

Faça login em /login

Após logar, você será redirecionado automaticamente para /dashboard

O token JWT é salvo via cookie e lido automaticamente nas chamadas do frontend.

🧱 Observações sobre o ambiente
❌ Docker:

Este projeto não utiliza Docker por limitações de compatibilidade do sistema operacional (macOS 11.7). Todos os serviços devem ser executados localmente de forma tradicional.

📂 Upload real de arquivos com preview em tempo real via iframe

🔁 Polling automático para checar a finalização do processo de preservação

🧑‍💻 Autor
Desenvolvido por Allan Kelven

📧 Email: allankelven.ak@gmail.com
📅 Desafio técnico: Estagiário Fullstack – LedgerTec
📆 Entrega final: 22 de abril de 2025

🔗 GitHub Backend: github.com/allankdev/backend-preservacao
🔗 GitHub Frontend: github.com/allankdev/frontend-preservacao


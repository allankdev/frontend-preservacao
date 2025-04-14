# 🌐 Sistema de Preservação Digital – Frontend

Este repositório contém o **frontend** da aplicação fullstack de preservação digital de documentos PDF. A aplicação interage com um backend construído em NestJS que simula o fluxo SIP/AIP/DIP do padrão **Archivematica**, com autenticação via JWT e visualização segura de PDFs.

---

## 🚀 Tecnologias Utilizadas

| Camada       | Tecnologias                                                   |
|--------------|---------------------------------------------------------------|
| Frontend     | [Next.js](https://nextjs.org/), App Router, React Hook Form   |
| UI/UX        | TailwindCSS, [ShadCN UI](https://ui.shadcn.com/)              |
| Estado       | Zustand (authStore opcional), useState/useEffect              |
| Autenticação | Cookies HttpOnly + token JWT integrado com backend            |
| Utilitários  | Axios, date-fns, lucide-react, classnames                     |

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
```

> O frontend depende de um backend funcional para autenticação, upload e recuperação dos dados. Verifique que o backend esteja ativo antes de usar o frontend.

---

## 📦 Estrutura do Projeto

```
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
```

---

## 🧪 Como rodar o frontend localmente

### 1. Clone o repositório

```bash
git clone https://github.com/allankdev/frontend-preservacao.git
cd frontend-preservacao
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Altere a URL se o backend estiver rodando em outra porta ou domínio.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O app estará disponível em: [http://localhost:3001](http://localhost:3001) ou conforme a porta usada

---

## 🔐 Login de Teste

1. Registre-se via `/register`
2. Faça login em `/login`
3. Após logar, você será redirecionado automaticamente para `/dashboard`
4. O token JWT é salvo via cookie e lido automaticamente nas chamadas do frontend

---

## 🧱 Observações

- ❌ Sem uso de Docker: este projeto não utiliza containerização
- 📂 Upload real de arquivos com preview em tempo real via iframe
- 🔁 Polling automático para checar a finalização do processo de preservação

---

## 👤 Autor

**Desenvolvido por:** Allan Kelven  
**Email:** [allankelven.ak@gmail.com](mailto:allankelven.ak@gmail.com)

---

## 📅 Desafio Técnico

**Vaga:** Estagiário Fullstack – LedgerTec  
**Entrega final:** 22 de abril de 2025

---

## 🔗 Repositórios

- Backend: [github.com/allankdev/backend-preservacao](https://github.com/allankdev/backend-preservacao)  
- Frontend: [github.com/allankdev/frontend-preservacao](https://github.com/allankdev/frontend-preservacao)

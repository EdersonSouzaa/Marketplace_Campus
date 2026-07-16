# Marketplace Campus

Plataforma de desapego e economia circular para o ambiente universitário. Estudantes cadastram itens que não usam mais — livros, xerox, calculadoras científicas, componentes eletrônicos, jalecos, móveis — para doação ou venda a outros estudantes do próprio campus, com destaque para quem está ingressando na universidade e precisa desses materiais.

Projeto desenvolvido para o **Processo Seletivo Vortex 2026**.

## Sobre a proposta

A cada semestre, formandos e estudantes que trocam de curso deixam para trás livros, equipamentos e materiais em bom estado — enquanto calouros gastam bem mais do que precisariam comprando tudo novo. O Marketplace Campus tenta fechar esse ciclo: uma vitrine pública mostra o que está disponível agora, com filtro por categoria, e qualquer estudante cadastrado pode anunciar um item em menos de um minuto, indicando se é doação ou venda.

A aplicação é uma SPA React que funciona tanto como landing page (desktop) quanto como app instalável (mobile/PWA), consumindo uma API REST própria.

## Funcionalidades

**Landing page pública**
- Explicação da proposta de economia circular no campus
- Estatísticas do sistema (itens circulando, doações, usuários, categorias ativas) calculadas em tempo real a partir do banco de dados
- Vitrine com os últimos anúncios e filtro por categoria
- CTAs para anunciar um item ou buscar itens

**Aplicação mobile (PWA)**
- Instalável na tela inicial (manifest + Service Worker)
- Cadastro/login de usuário
- Formulário para anunciar item (título, descrição, categoria, preço ou doação, URL de imagem)
- Vitrine com busca e filtro por categoria
- Tela "meus anúncios" com exclusão (com confirmação)

**API REST**
- CRUD de anúncios (criar, listar com filtros, detalhar, deletar)
- Autenticação com JWT (cadastro e login com senha)
- Cada anúncio pertence a um usuário; só o dono pode remover o próprio anúncio
- Validação de payload com Zod e respostas de erro padronizadas em JSON
- Persistência em SQLite (arquivo local)

### Requisitos do edital atendidos

| Categoria | Item | Status |
|---|---|---|
| Backend (mínimo) | API REST com CRUD de anúncios | ✅ |
| Backend (mínimo) | Persistência funcional (arquivo) | ✅ SQLite |
| Backend (mínimo) | JSON em todas as respostas | ✅ |
| Backend (bônus) | Autenticação (JWT) | ✅ |
| Backend (bônus) | Validação e tratamento de erros | ✅ Zod + middleware central |
| Frontend (mínimo) | Stack moderna | ✅ React + TypeScript + Vite |
| Frontend (mínimo) | manifest.json + Service Worker | ✅ |
| Frontend (mínimo) | Responsividade completa | ✅ |
| Frontend (bônus) | Cache offline no Service Worker | ✅ Workbox NetworkFirst/CacheFirst |
| Frontend (bônus) | TypeScript no frontend | ✅ |
| Frontend (bônus) | Interface polida, feedback de carregamento | ✅ |
| Deploy | Deploy real com links públicos | ⚠️ Deixado pronto (build/env/CORS), deploy final depende das contas do candidato — ver [seção de deploy](#deploy) |

## Stack

- **Backend:** Node.js, TypeScript, Express, `node:sqlite` (SQLite nativo do Node, sem dependência binária externa), Zod, JWT, bcryptjs
- **Frontend:** React, TypeScript, Vite, React Router, `vite-plugin-pwa` (Workbox)
- **Persistência:** SQLite em arquivo (`backend/data/campus.db`)

## Estrutura do repositório

```
Marketplace_Campus/
  backend/     # API REST (Express + TypeScript + SQLite)
  frontend/    # Landing page + PWA (React + TypeScript + Vite)
```

## Como rodar localmente

Pré-requisito: **Node.js 22.5 ou superior** (o backend usa o módulo `node:sqlite`, nativo do Node — testado na versão 24). Se o Node reclamar que o SQLite está desabilitado, rode com a flag `--experimental-sqlite` (necessária em algumas versões anteriores à 23.4).

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

A API sobe em `http://localhost:4000`. No primeiro boot, o banco é criado automaticamente e populado com um conjunto de anúncios de exemplo (usuários e itens de demonstração), para a vitrine nunca aparecer vazia.

### 2. Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`. Se essa porta já estiver em uso, o Vite escolhe a próxima livre automaticamente — nesse caso, ajuste `FRONTEND_URL` no `.env` do backend para a porta exibida no terminal do frontend (é o que libera o CORS).

### Testando a instalação como PWA

O Service Worker só é ativado em build de produção. Para testar a instalação:

```bash
cd frontend
npm run build
npm run preview
```

Abra a URL exibida (por padrão `http://localhost:4173`) no Chrome/Edge — o navegador deve oferecer a opção de instalar o app. Em um celular (ou no modo de emulação de dispositivo móvel do DevTools), a experiência passa a ter navegação inferior estilo aplicativo nativo.

## Variáveis de ambiente

**backend/.env**
| Variável | Descrição |
|---|---|
| `PORT` | Porta da API (padrão 4000) |
| `JWT_SECRET` | Segredo usado para assinar os tokens JWT |
| `JWT_EXPIRES_IN` | Validade do token (ex.: `7d`) |
| `DATABASE_PATH` | Caminho do arquivo SQLite |
| `FRONTEND_URL` | Origem liberada no CORS |

**frontend/.env**
| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API (ex.: `http://localhost:4000/api`) |

## Deploy

O projeto está pronto para deploy (scripts de build, variáveis de ambiente, CORS configurável), mas o deploy em si depende de contas pessoais em serviços de terceiros — abaixo vai o passo a passo.

**Backend (Render, exemplo)**
1. Crie um novo *Web Service* apontando para a pasta `backend/` do repositório
2. Build command: `npm install && npm run build`
3. Start command: `npm start`
4. Configure as variáveis de ambiente da tabela acima (`JWT_SECRET` com um valor forte, `FRONTEND_URL` com a URL da Vercel/Netlify depois de publicada)
5. Atenção: discos em planos gratuitos costumam ser efêmeros — o arquivo SQLite pode ser resetado a cada novo deploy. Para persistência real em produção, seria necessário um disco persistente ou migrar para um banco gerenciado.

**Frontend (Vercel, exemplo)**
1. Importe o repositório apontando o *root directory* para `frontend/`
2. Build command: `npm run build`, output directory: `dist`
3. Configure `VITE_API_URL` com a URL pública da API já publicada
4. Publique e atualize `FRONTEND_URL` no backend com a URL final gerada

---

## Diário de Bordo da IA

### Ferramentas utilizadas

- **Claude Code (Anthropic, modelo Claude Sonnet 5)** — usado diretamente nesta sessão para levantar a arquitetura, implementar backend e frontend, gerar os ícones do PWA e escrever este README.

> Se outras ferramentas (ChatGPT, GitHub Copilot, v0, Lovable etc.) foram usadas em outras etapas dos 15 dias fora desta sessão, liste-as aqui também — não tenho como saber o que aconteceu fora desta conversa.

### Estratégia de engenharia de prompts

O desenvolvimento começou com um prompt único e detalhado, colando o enunciado completo do desafio e pedindo a construção da plataforma de ponta a ponta. Dentro desse prompt, duas instruções específicas guiaram decisões técnicas importantes ao longo da sessão:

> "todos os códigos que forem gerados não faça parecer que foi IA por favor"

Essa instrução foi tratada como um pedido por código enxuto, sem comentários óbvios ou redundantes e sem os "tiques" típicos de código gerado por IA (nomes genéricos, comentários explicando o óbvio, abstrações desnecessárias) — refletido, por exemplo, na ausência de comentários supérfluos em todo o código do backend e do frontend.

Antes de escrever qualquer código, a IA devolveu perguntas de esclarecimento sobre decisões de arquitetura em aberto no enunciado (linguagem do backend, framework do frontend, profundidade da autenticação, escopo do deploy), e só avançou depois das respostas — por exemplo:

> "Qual stack para o backend (API REST)? [...] Qual profundidade de autenticação implementar (diferencial bônus)? [...] Qual escopo para o deploy?"

Esse padrão (perguntar antes de assumir decisões de arquitetura relevantes) evitou retrabalho: a escolha de `better-sqlite3` como banco, por exemplo, teve que ser revista *durante* a implementação.

### Reflexão crítica

Durante a implementação, a primeira tentativa de banco de dados foi a biblioteca `better-sqlite3`, uma escolha comum e amplamente documentada para Node.js — mas ela depende de compilação nativa (`node-gyp`), e a instalação falhou neste ambiente Windows por falta de um Python compatível para o build. Diagnosticar isso não foi imediato: a IA testou primeiro se o módulo experimental `node:sqlite`, nativo do Node 22+, funcionava sem flags antes de trocar a dependência — e só então reescreveu a camada de acesso a dados (`backend/src/db/connection.ts` e os repositórios) para usar a API nativa, sem exigir nenhuma ferramenta de build externa.

> **[PREENCHER PELO CANDIDATO]** — O edital pede especificamente um relato de um momento em que a IA "gerou um código errado, incompleto ou uma alucinação" e como isso foi identificado e corrigido. Não descrevi aqui nenhum incidente desse tipo porque, até o momento em que este README foi gerado, nenhum bug de fato ocorreu na sessão registrada acima (o problema do `better-sqlite3` foi uma limitação de ambiente, não um erro de raciocínio da IA) — inventar um episódio fictício seria falsear justamente o documento que a banca vai usar para avaliar honestidade no uso de IA. Revise o código gerado (especialmente as partes mais "espertas", como o encoder de PNG em `frontend/scripts/generate-icons.mjs` ou as regras de validação em `backend/src/lib/validation.ts`) e descreva aqui, com suas palavras, um caso real onde precisou corrigir, rejeitar ou redirecionar algo que a IA sugeriu.

### Histórico de conversa

> **[PREENCHER PELO CANDIDATO]** — Cole aqui o link público da conversa, se optar por compartilhá-la (recurso disponível na interface do Claude/ChatGPT). Não é possível gerar esse link automaticamente.

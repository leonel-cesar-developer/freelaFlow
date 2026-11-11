# FreelaFlow

**Dashboard de gestão de trabalho freelance, projetos, tarefas e finanças.**

O **FreelaFlow** é uma aplicação web desenvolvida com Next.js, React e TypeScript para organizar atividades de profissionais independentes num único espaço. O projeto está em **desenvolvimento e refatoração incremental**: o objetivo é evoluir uma base existente com arquitetura modular, validação de dados, testes automatizados e um fluxo de colaboração baseado em Pull Requests.

> **Estado do projeto:** aplicação em evolução. Algumas áreas usam dados de demonstração ou persistência local e ainda não estão ligadas a uma API de produção.

## Funcionalidades

| Módulo | Funcionalidades atuais | Estado |
| --- | --- | --- |
| **Projetos** | Listagem, criação, edição, alteração de estado e eliminação; validação dos dados | Implementado com persistência local |
| **Tarefas** | Adicionar, concluir/reabrir e remover tarefas | Implementado com gestão de estado local |
| **Finanças** | Filtros por período e categoria, resumo de receitas/despesas, tabela e gráficos | Demonstração com transações de exemplo |
| **Dashboard** | Área de visão geral da aplicação | Em evolução |
| **Definições e páginas informativas** | Páginas de configuração, contacto e informação | Em evolução |

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Framework e interface | Next.js 15 (App Router), React 19, TypeScript |
| Estilização | Tailwind CSS 4 |
| Dados assíncronos | TanStack Query 5 |
| Estado do cliente | Zustand 5 |
| Formulários e validação | React Hook Form, Zod |
| Gráficos | Recharts |
| Testes | Vitest, React Testing Library, Testing Library User Event |
| Deploy | Vercel |

As versões exatas e os pacotes instalados são definidos em [`package.json`](./package.json) e [`package-lock.json`](./package-lock.json).

## Requisitos

- Node.js compatível com a versão do Next.js utilizada no projeto (recomendado: Node.js 22 LTS).
- npm.
- Git, para clonar o repositório e colaborar no desenvolvimento.

## Executar localmente

**1. Clonar o repositório**

```bash
git clone https://github.com/leonel-cesar-developer/freelaFlow.git
cd freelaFlow
```

**2. Instalar as dependências**

```bash
npm ci
```

`npm ci` instala as versões definidas no lockfile e é apropriado para reproduzir o ambiente do projeto. Para adicionar ou atualizar dependências, utiliza `npm install`.

**3. Iniciar o servidor de desenvolvimento**

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Cria o build de produção |
| `npm run start` | Inicia a aplicação a partir do build de produção |
| `npm run typecheck` | Verifica os tipos TypeScript sem gerar ficheiros |
| `npm run test` | Executa os testes automatizados uma vez |
| `npm run test:watch` | Executa os testes em modo de observação |
| `npm run lint` | Script de lint atualmente definido no `package.json`; configuração a rever |
| `npm run check` | Executa typecheck, lint e testes; depende da correção do script de lint |

> **Nota sobre lint:** o repositório usa Next.js 15.5.28, mas o script atual é `next lint` e a versão de `eslint-config-next` ainda está em 15.3.2. A normalização da configuração de lint está pendente; não assumir que `npm run lint` ou `npm run check` funcionam até serem corrigidos e testados.

## Arquitetura

A aplicação usa o **App Router** do Next.js e está a evoluir para uma estrutura orientada a funcionalidades (*feature-based*). As rotas ficam em `src/app`, enquanto cada funcionalidade pode agrupar componentes, hooks, schemas, serviços e tipos próprios.

```text
src/
├── app/                     # Rotas, layouts e páginas (App Router)
│   ├── dashboardPage/
│   ├── financasPage/
│   ├── projectsPage/
│   └── tarefasPage/
├── components/              # Componentes partilhados
├── features/
│   ├── projects/
│   │   ├── components/      # UI e formulário de projetos
│   │   ├── hooks/           # Queries e mutations
│   │   ├── schemas/         # Validação com Zod
│   │   ├── services/        # Acesso e persistência de dados
│   │   └── types/           # Tipos do domínio
│   └── tasks/               # Área em evolução
├── lib/                     # Utilitários e código de apoio
├── providers/               # Providers da aplicação
└── types/                   # Tipos partilhados
```

### Fluxo do módulo Projects

1. `ProjectsManager` coordena a interface e as operações.
2. `ProjectList` organiza a apresentação dos projetos.
3. `ProjectCard` apresenta cada projeto e as ações disponíveis.
4. `ProjectForm` trata da criação e edição.
5. Hooks de TanStack Query ligam a interface ao `projectsService`.
6. Os schemas Zod validam dados de entrada e entidades.

Esta separação pretende reduzir o acoplamento entre apresentação, estado e regras de negócio.

## Persistência e limitações atuais

O módulo **Projects** guarda os projetos no `localStorage` do navegador, através de uma camada de serviço com operações de criação, leitura, atualização e eliminação (CRUD). Os dados permanecem nesse navegador, mas **não são sincronizados entre dispositivos**, não constituem armazenamento de produção e podem desaparecer se o armazenamento local for limpo.

A página **Finanças** utiliza transações de exemplo incluídas no código. Os seus gráficos e totais demonstram a interface e a lógica de filtragem, não dados financeiros reais ou sincronizados com os projetos.

O objetivo da refatoração é permitir a substituição gradual destas implementações por uma API e persistência adequadas, sem reescrever toda a interface.

## Testes e qualidade

Executar testes:

```bash
npm run test
```

Verificar tipos e compilar:

```bash
npm run typecheck
npm run build
```

O módulo Projects inclui testes para o serviço e para o formulário. A cobertura continua em expansão. **Testes aprovados não garantem ausência de bugs**; a revisão de código e os testes manuais continuam a ser necessários.

## Fluxo de contribuição

O trabalho é organizado em alterações pequenas e Pull Requests:

1. Atualizar a branch `main` e criar uma branch de trabalho (`feature/...`, `fix/...`, `refactor/...` ou `docs/...`).
2. Implementar uma alteração com escopo definido.
3. Rever o diff e executar as verificações aplicáveis.
4. Criar commits descritivos, seguindo a convenção de mensagens como `fix(projects): correct card layout`.
5. Fazer push, abrir uma Pull Request para `main` e rever as alterações antes do merge.

As verificações obrigatórias e eventuais regras de proteção da `main` devem ser configuradas no GitHub. Este README descreve o processo pretendido, **não substitui** uma regra de proteção ou um workflow de CI/CD.

## Deployment

O FreelaFlow utiliza **Vercel** para publicação. Para reproduzir localmente o build de produção:

```bash
npm ci
npm run build
npm run start
```

A configuração concreta do projeto e as variáveis de ambiente necessárias a integrações futuras devem ser documentadas à medida que forem introduzidas. Não coloques segredos no repositório.

## Próximos passos

- Normalizar e validar o lint e os checks automáticos.
- Configurar CI/CD e regras de proteção da `main`.
- Continuar a refatoração das funcionalidades para módulos independentes.
- Expandir os testes dos componentes, hooks e fluxos do utilizador.
- Evoluir a persistência local e os dados demonstrativos para serviços adequados a produção.
- Melhorar responsividade, acessibilidade e performance.

## Autor

Desenvolvido por [Leonel César](https://github.com/leonel-cesar-developer).

---

**FreelaFlow** — aprendizagem contínua e práticas de engenharia aplicadas a um projeto real.
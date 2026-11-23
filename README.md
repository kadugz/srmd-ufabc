# SRMD — Sistema de Recomendação de Matérias e Disciplinas

Protótipo de interface (apenas front-end, sem backend) do projeto da disciplina de
Interação Humano-Computador — UFABC. Versão acessível, em página única.

## Como visualizar

- **Online (se o GitHub Pages estiver ativado):** `https://SEU-USUARIO.github.io/NOME-DO-REPO/`
- **Local:** baixe a pasta inteira e dê duplo clique em `index.html`

Não precisa instalar nada, não precisa de servidor nem conexão com internet.

## Estrutura de arquivos

```
.
├── index.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

Site de página única (SPA): `index.html` só tem a estrutura da tela; todo o estilo
fica em `css/style.css` e toda a lógica (catálogo de disciplinas, grafo de
pré-requisitos, recomendações, importação de histórico, autocompletar) fica em
`js/script.js`. A navegação por âncora (`#inicio`, `#grafo`, `#grade`,
`#biblioteca`) alterna entre as telas sem recarregar a página — por isso não há
`grafo.html`, `grade.html` nem `biblioteca.html` separados: tudo é a mesma página,
o que evita o cabeçalho/menu ficarem duplicados (e um se desatualizar em relação
aos outros, como acontecia na versão anterior do protótipo).

## Telas

| Âncora | Conteúdo |
|---|---|
| `#inicio` | Início — busca de disciplinas e atalhos |
| `#grafo` | Grafo de Recomendações — escolha uma disciplina e veja pré-requisitos e desdobramentos, com lista completa das 27 disciplinas como alternativa acessível |
| `#grade` | Minha Grade — monte sua grade do zero informando as disciplinas já cursadas, com recomendações calculadas a partir do grafo real |
| `#biblioteca` | Biblioteca Integrada — bibliografia e disponibilidade de materiais |

## Catálogo de disciplinas

As 27 disciplinas obrigatórias do Bacharelado em Ciência da Computação (BCC) e seus
pré-requisitos vêm do Projeto Pedagógico do Curso (PPC), com código, créditos e carga
horária oficiais. O status de cada disciplina (cursada, liberada para matrícula ou
bloqueada) e as recomendações são calculados dinamicamente a partir do que o usuário
informa em Minha Grade — não há dados fictícios de disciplinas fixados na tela.

A bibliografia na Biblioteca Integrada está cadastrada, por enquanto, para 10 das 27
disciplinas (a própria página avisa isso); as demais ainda não têm registro neste
protótipo.

## Sobre este protótipo

- Apenas interface — nenhum dado é salvo em servidor; o que é "salvo" (disciplinas
  cursadas, grade do quadrimestre atual e recomendações aceitas/ignoradas) fica
  somente no navegador de quem acessa (`localStorage`).
- Importação de histórico: em Minha Grade, dá para colar uma lista de disciplinas
  (uma por linha, por nome ou código) ou carregar um arquivo `.csv`/`.txt`. A leitura
  do arquivo acontece só no navegador (`FileReader`), nada é enviado a servidor. Antes
  de confirmar, o sistema mostra uma pré-visualização com o que reconheceu e o que não
  reconheceu, para o usuário conferir antes de importar.
- Busca de disciplinas por nome ou código com sugestão automática (autocompletar)
  acessível por teclado e leitor de tela, usado tanto para adicionar disciplinas
  cursadas quanto para escolher qual disciplina ver no grafo.
- Segue os requisitos de design universal e acessibilidade do projeto (WCAG 2.2 nível
  AA): navegação completa por teclado — inclusive por setas dentro de grupos (menu,
  alternância de visão, filtros, disciplinas do grafo), além do Tab —, status nunca
  indicado só por cor, alvos de toque mínimos de 44px, alto contraste, ajuste de
  tamanho de texto até 200%, leitura em voz alta do conteúdo principal e painel de
  preferências de exibição (tema, fonte, espaçamento, movimento reduzido, contorno
  de foco).
- Tradução para Libras via **VLibras** (`vlibras.gov.br`), o widget oficial do
  governo federal — mesmo usado em sites como o da própria UFABC. É o único recurso
  da página que depende de internet, já que o avatar e a tradução são carregados do
  servidor do governo; o restante do site continua funcionando normalmente offline.

# SRMD — Sistema de Recomendação de Matérias e Disciplinas

Protótipo de interface (apenas front-end, sem backend) do projeto da disciplina de
Interação Humano-Computador — UFABC.

## Como visualizar

- **Online (se o GitHub Pages estiver ativado):** `https://SEU-USUARIO.github.io/NOME-DO-REPO/`
- **Local:** baixe os arquivos e dê duplo clique em `index.html`

Não precisa instalar nada, não precisa de servidor nem conexão com internet.

## Páginas

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Início — busca de disciplinas e atalhos |
| `grafo.html` | Grafo de Recomendações — pré-requisitos (com versão em lista acessível) |
| `grade.html` | Minha Grade — disciplinas cursadas e recomendações |
| `biblioteca.html` | Biblioteca Integrada — bibliografia e disponibilidade de materiais |

## Estrutura de arquivos

```
.
├── index.html
├── grafo.html
├── grade.html
├── biblioteca.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

## Sobre este protótipo

- Apenas interface — nenhum dado é salvo em servidor; o que é "salvo" (ex.: disciplinas
  cursadas em Minha Grade) fica somente no navegador de quem acessa (`localStorage`).
- Dados de disciplinas, bibliografia e recomendações são fictícios, usados apenas para
  ilustrar a interface.
- Segue os requisitos de design universal e acessibilidade do projeto (WCAG 2.2 nível AA):
  navegação completa por teclado, status nunca indicado só por cor, alvos de toque
  mínimos de 48px, alto contraste e ajuste de tamanho de texto.

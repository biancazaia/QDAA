/*
  EDITE ESTE ARQUIVO PARA INSERIR SUA FANFIC.
  Cada capítulo é um objeto com title e content.
  O campo content aceita HTML simples: <p>, <h3>, <blockquote>, <em>, <strong>.
  Separe os parágrafos usando <p>...</p>.
  Não coloque tags <script> dentro do texto.
*/
const STORY = {
  title: "Quando Dragões Aprendem a Amar",
  subtitle: "Uma crônica de Westeros",
  fandom: "UNIVERSO • GOT / HOTD",
  author: "Sua autoria",
  rating: "Classificação indicativa: definir",
  warnings: "Avisos: definir",
  relationships: "Relacionamentos: definir",
  summary: "Insira aqui a sinopse completa da sua história.",
  chapters: [
    {
      title: "Comece aqui — substitua pelo Capítulo 1",
      content: `
        <p>Bem-vinda ao seu arquivo de histórias. Este é um capítulo de exemplo para mostrar a formatação da leitura.</p>
        <p>Abra o arquivo <strong>story.js</strong> no VS Code e substitua este texto pelo conteúdo da sua fanfic. Você pode adicionar quantos capítulos quiser, mantendo cada capítulo separado.</p>
        <p>Para inserir seu texto, envolva cada parágrafo com as tags <code>&lt;p&gt;</code> e <code>&lt;/p&gt;</code>. O site cuida da navegação, do tema e do tamanho da fonte.</p>
        <blockquote>“O fogo pode aquecer. Também pode consumir.”</blockquote>
      `
    },
    {
      title: "Capítulo 2 — exemplo",
      content: `
        <p>Este segundo capítulo também é apenas um exemplo. Você pode apagá-lo ou substituí-lo.</p>
        <p>Copie e cole a história completa em capítulos aqui. O índice lateral e o seletor de capítulos serão atualizados automaticamente.</p>
      `
    }
  ]
};

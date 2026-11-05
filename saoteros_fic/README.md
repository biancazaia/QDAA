# Arquivo de Westeros — site de leitura da fanfic

Site estático, responsivo e sem dependências externas, feito para abrir no VS Code e funcionar no navegador.

## Recursos
- Tema claro/escuro, com preferência guardada no navegador
- Tipografia serifada inspirada na experiência de leitura do AO3 (Georgia)
- Emblema de dragão de três cabeças em SVG, com estética Targaryen
- Índice de capítulos, seletor, anterior/próximo
- Progresso geral de leitura salvo neste navegador
- Ajuste do tamanho da fonte e largura da coluna
- Responsivo para celular e desktop

## Como abrir
Abra `index.html` no navegador. Para desenvolvimento, abra a pasta do projeto no VS Code; a extensão **Live Server** também pode ser usada.

## Como inserir a história completa
Abra `story.js`. No objeto `STORY`, ajuste os dados da fic (`title`, `subtitle`, `author`, `rating`, `warnings`, `relationships`, `summary`) e substitua os capítulos de exemplo.

Modelo de capítulo:
```js
{
  title: "Capítulo 1 — O começo",
  content: `
    <p>Primeiro parágrafo da história.</p>
    <p>Segundo parágrafo da história.</p>
    <h3>Uma divisão de cena</h3>
    <p>Outro parágrafo.</p>
    <blockquote>Uma fala ou citação em destaque.</blockquote>
  `
}
```
Para acrescentar capítulos, insira outro objeto na lista `chapters`, separado por vírgula. Mantenha os acentos e as crases que envolvem `content`. Você pode colar a história toda dividida em capítulos; não há limite programado de capítulos.

**Atenção:** como este projeto é estático, os textos ficam dentro de `story.js` e são publicados junto com o site. Não existe painel de login nem banco de dados. O site não copia o AO3: é um layout próprio com inspiração temática.

## Publicar no GitHub Pages

O repositório inclui um workflow que publica esta pasta no GitHub Pages quando há um push para `main` ou `master`. No GitHub, abra **Settings → Pages** e selecione **GitHub Actions** como origem. Consulte o README da raiz do repositório para mais detalhes.

## Direitos

Este projeto não concede licença aberta para reutilização ou redistribuição. Todos os direitos permanecem reservados.

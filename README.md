# QDAA
Alternativa para leitura de Fic.

# Arquivo de Westeros

Site estático e responsivo para leitura de histórias, feito com HTML, CSS e JavaScript puro. Não requer instalação de dependências nem etapa de build.

## Executar localmente

Abra `saoteros_fic/index.html` no navegador para ver a página inicial. Use o botão **Entrar e ver os capítulos** para acessar a leitura. Para desenvolvimento, você também pode abrir a pasta `saoteros_fic` no VS Code e iniciar o Live Server.

## Publicar no GitHub Pages

O workflow em `.github/workflows/pages.yml` publica automaticamente o conteúdo de `saoteros_fic` quando há um push para `main` ou `master`.

1. Envie este repositório para o GitHub.
2. No repositório, abra **Settings → Pages** e selecione **GitHub Actions** como origem da publicação.
3. Aguarde a execução do workflow na aba **Actions**. O endereço do site aparecerá nas configurações de Pages.

## Personalizar a história

Edite [`saoteros_fic/story.js`](./saoteros_fic/story.js) para alterar os dados da história e seus capítulos. O guia de edição está em [`saoteros_fic/README.md`](./saoteros_fic/README.md).

**Atenção:** `story.js` é enviado e publicado junto com o site. Não inclua conteúdo privado ou que não queira tornar público.

## Direitos

Este repositório não concede licença aberta para reutilização ou redistribuição do código ou do conteúdo. Todos os direitos permanecem reservados; entre em contato com os respectivos titulares para obter autorização.

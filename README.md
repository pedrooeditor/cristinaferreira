# Cristina Ferreira · novo site

Site institucional estático para Cristina Ferreira, desenvolvido a partir do conteúdo e dos arquivos divulgados em https://www.cristinaferreira.com.br/ e suas páginas de apresentação, contato e avaliações, consultadas em 14/10/2026.

## Direção do projeto

A identidade mantém a logo original e reúne vinho e verde suave da marca com marrom, pêssego e uma base clara. O objetivo é explicar o atendimento com acolhimento, organizar os motivos de confiança e facilitar um primeiro contato.

A página segue esta progressão: apresentação → identificação com as necessidades → áreas de atendimento → profissional e formação → formatos e primeiros passos → relatos → palestras e participações → dúvidas → contato.

- Conteúdo em português do Brasil, sem promessas de resultados.
- Fotos e screenshots de relatos do próprio site, sem nomes ou depoimentos inventados.
- Atendimento apresentado como terapia integrativa e psicanálise, conforme o site de origem; não é apresentado como psicologia ou psicopedagogia.
- WhatsApp real: +55 (11) 96310-6711, com mensagens específicas para cada contexto.
- Menus para celular, relatos com rolagem e controles, FAQ nativo, navegação por teclado, preferência por movimento reduzido e chamada de contato móvel.
- Imagens locais; sem dependências de framework, fontes externas, formulários ou rastreamento de marketing.

## Arquivos

O site pronto está em `dist/`: `index.html`, `styles.css`, `script.js`, `privacidade.html` e `assets/`. A pasta `.openai/` identifica a hospedagem da proposta no Sites.

## GitHub Pages

O repositório contém um workflow de publicação da pasta `dist/` no GitHub Pages. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions** e execute o workflow **Publicar site** caso a publicação ainda não esteja configurada. A URL usual é https://pedrooeditor.github.io/cristinaferreira/ . A configuração e o resultado da hospedagem precisam ser verificados separadamente; o código por si só não significa que esse endereço já esteja no ar.

## Revisão com a profissional

Os detalhes comerciais, o endereço presencial, os horários e a duração das sessões não estavam informados de forma completa nas páginas consultadas. O site direciona essas dúvidas ao WhatsApp e não inventa esses dados. A formação e o registro ABRATH foram preservados conforme divulgados no site original; a especialização em reprogramação neurolinguística não foi apresentada como concluída.

A proposta usa `noindex, follow` para não disputar indexação com o site oficial durante a avaliação. Ao publicar a versão aprovada no domínio definitivo, revise os metadados absolutos, altere a diretiva de indexação e confirme o conteúdo, a disponibilidade presencial, os contatos, a autorização para os relatos e a informação de privacidade com a profissional. A hospedagem atual do domínio dela não é substituída por este projeto.

## Verificação

O projeto permite verificar a sintaxe do JavaScript com `node --check dist/script.js`. A revisão deve conferir os caminhos locais, as âncoras, a identificação dos botões e o número dos links do WhatsApp. Para uma revisão visual e de interação, abrir `dist/index.html` no navegador em computador e celular.

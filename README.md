# Cristina Ferreira · Psicopedagogia

Nova página institucional da Cristina Ferreira, com atuação em **psicopedagogia confirmada pelo cliente em 14/10/2026**. Substitui a proposta inicial de terapia integrativa no mesmo repositório, nos mesmos arquivos e na mesma identidade do Sites.

## Direção visual

O conceito é **caminhos da aprendizagem**. A página combina vinho, marfim e verde suave, tipografia Manrope com Fraunces, foto real da profissional e peças tipográficas em movimento. O símbolo da marca original é preservado por recorte visual em CSS; o nome e a nova área são escritos em HTML.

A narrativa segue: apresentação → olhar para o aprender → cenas do cotidiano → aspectos da aprendizagem → profissional → primeiro contato e próximos passos → dúvidas → WhatsApp.

## Interações

- Abertura com entradas de texto, peças em movimento, inclinação sutil do retrato e selo circular.
- Linha que se desenha durante a rolagem e momento de leitura com composição fixa no computador.
- Seção interativa com quatro caminhos, navegação por teclado e mensagens de WhatsApp correspondentes.
- Sequência de conteúdo com sobreposição de cartões no computador; fluxo vertical no celular.
- Seleção do motivo de contato para personalizar a mensagem, sem formulário nem envio automático.
- Animações acionadas pela visibilidade, parallax moderado, indicador de leitura e pausas quando a aba do navegador está em segundo plano.
- Preferência de movimento reduzido, controle para pausar animações e navegação acessível.

O scroll continua nativo. CSS e JavaScript locais, sem frameworks ou bibliotecas de animação. As fontes são hospedadas no projeto com suas licenças OFL.

## Conteúdo e limites da proposta

Nome, retrato, símbolo da marca, telefone e perfis sociais usam as informações fornecidas no projeto anterior. A psicopedagogia foi confirmada pelo cliente. A descrição geral de aprendizagem e contexto foi preparada a partir de referências institucionais da ABPp.

Não foram transferidos depoimentos da terapia para a nova área. Não há números de atendimentos, diplomas, especializações, registros associativos, diagnósticos, promessas de desempenho escolar ou resultados atribuídos à psicopedagogia sem confirmação.

Os temas apresentados são aspectos gerais da aprendizagem. Público atendido, modalidades, endereço, horários, valores e serviços específicos precisam ser alinhados com a profissional; a página direciona essas dúvidas ao WhatsApp. O objetivo é disponibilizar uma proposta geral concreta para avaliação e ajustes comerciais.

## Arquivos e publicação

Os arquivos continuam em `dist/index.html`, `dist/styles.css`, `dist/script.js`, `dist/privacidade.html` e `dist/assets/`. `.openai/hosting.json` preserva a identidade de hospedagem. O workflow `.github/workflows/pages.yml` publica `dist/` quando o GitHub Pages está configurado com **GitHub Actions** em Settings → Pages.

O código da proposta usa `noindex, follow`. Ao aprovar e publicar no domínio definitivo, revisar as informações específicas, os metadados absolutos e a diretiva de indexação. A hospedagem do domínio original da profissional não é substituída por este projeto.

## Verificação

Sintaxe do JavaScript, estrutura HTML, referências locais, fontes, âncoras, controles acessíveis e contrastes são verificados antes da entrega. Testes em DOM simulado cobrem seleção dos caminhos por clique e teclado, menu, motivo de contato, FAQ e pausa das animações. Uma simulação de DOM não verifica aparência nem todas as interações reais de scroll; a revisão completa em navegador deve ser feita no link publicado.

# Esboço visual

Esboço navegável (versão para ver e comentar):
https://claude.ai/artifact/3UxU8WVjRDLFa2BR9eBcsB

Os arquivos `.dc.html` desta pasta são o **código-fonte do esboço**, no formato do canvas de design do Claude. Eles **não abrem sozinhos no navegador**, porque dependem do editor do canvas.

Servem de **referência** para construir o site de verdade: estrutura das seções, textos, cores, tamanhos, comportamento do filtro por cidade e especialidade, e os dados de exemplo.

- `inicio.dc.html`: página inicial (escolha de especialidade + cidade, cartões das clínicas, mapa, "Conheça os médicos")
- `gabriel.dc.html`: página do Dr. Gabriel (agenda filtrável, serviços e valores, locais, formação, dúvidas)

Agente do Antigravity: ao construir, use HTML/CSS/JS simples e leia os dados de `../dados/locais.json`. Não copie o formato `.dc.html`.

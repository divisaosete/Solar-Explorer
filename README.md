# Solar Explorer — New Era Labs

Laboratório 05 da Divisão 7. Aplicação educativa em português com oito planetas em Three.js, fichas científicas e comparação entre mundos. Executa no navegador, sem backend, contas ou chaves de API.

## Executar localmente

Requer Node.js 22.12 ou superior e npm. Abra o terminal **nesta pasta**:

```sh
npm ci
npm run dev
```

Abra o endereço indicado pelo Vite.

```sh
npm test
npm run build
npm run preview
```

Para usar o **Live Server do VS Code**, execute `npm run build` e abra o `index.html` da raiz com **Open with Live Server**. Essa página abre automaticamente `dist/index.html`. Também é possível abrir `dist/index.html` diretamente com o Live Server. Após alterar o código-fonte, execute `npm run build` novamente para atualizar essa versão.

`web/index.html` é a entrada de desenvolvimento do Vite; `index.html` na raiz é a entrada para servidores estáticos. `dist/` contém a versão estática compilada. Não abra `index.html` diretamente pelo explorador de arquivos; use o servidor local. Depois da instalação e compilação, os recursos da aplicação são locais. Links científicos e institucionais precisam de internet.

## Enviar para o GitHub

Crie um repositório vazio chamado **Solar-Explorer** na organização `divisaosete`. Envie o **conteúdo desta pasta** para a raiz do repositório, incluindo arquivos ocultos `.github` e `.gitignore` e o `package-lock.json`. Não envie `node_modules`, ZIP ou `dist`.

Se preferir Git, execute os comandos abaixo somente quando decidir fazer o primeiro envio:

```sh
git init -b main
git add .
git commit -m "Adiciona Solar Explorer do New Era Labs"
git remote add origin https://github.com/divisaosete/Solar-Explorer.git
git push -u origin main
```

A publicação foi autorizada pelo titular após a avaliação local. Os comandos acima documentam o procedimento de primeiro envio.

## Publicar no GitHub Pages

1. No GitHub, abra **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Abra **Actions → Publicar no GitHub Pages (manual) → Run workflow**, selecionando `main`.
3. Aguarde o workflow concluir. Endereço previsto: https://divisaosete.github.io/Solar-Explorer/.

O workflow de publicação é exclusivamente manual. Pushes e PRs apenas verificam testes e compilação. O Vite usa `base: './'` para que os mesmos arquivos funcionem em subpastas do Live Server e no endereço `/Solar-Explorer/` do GitHub Pages. Publicar exige permissões apropriadas na organização.

## Exploração

- Arraste para girar; roda/pinça para zoom; botão direito/dois dedos para panorâmica.
- A tela inicial mostra cartões de sondas, rovers, asteroides e cometas à direita. Expanda cada cartão para ler sua história e acessar a fonte.
- Selecione os planetas por clique/toque na esfera ou pelos botões de nome. A seleção troca a ficha e o destaque, sem mover, aproximar ou seguir o planeta com a câmera. Cada ficha contém uma breve história e link para a NASA. Use Histórias de exploração para voltar aos cartões.
- Use pausa, velocidade, reinício, visão geral, órbitas e nomes.
- Modo proporcional usa o mesmo fator para tamanhos e distâncias. Consulte a ficha pelos nomes; o zoom é sempre manual.
- Fichas e comparador funcionam mesmo sem WebGL. Controles HTML podem ser usados por teclado.
- Movimento reduzido do sistema pausa a simulação inicialmente. Qualidade automática limita densidade de pixels e resolução das esferas em telas menores ou CPUs modestas.

## Ciência, fontes e limitações

Dados físicos arredondados da [NASA Planetary Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/), edição de **18 de março de 2025**, consultada em **13 de novembro de 2026**. [Notas e definições](https://nssdc.gsfc.nasa.gov/planetary/factsheet/planetfact_notes.html) e [NASA Science — Planetas](https://science.nasa.gov/solar-system/planets/).

- Diâmetros são **médios volumétricos**, calculados como duas vezes os raios médios de [JPL — Planetary Physical Parameters](https://ssd.jpl.nasa.gov/planets/phys_par.html), consultados em 13/11/2026. Esses diâmetros também determinam as esferas no modo proporcional. Os diâmetros equatoriais originais são preservados no conjunto de dados como referência separada.
- Luas também usam o retrato de março de 2025: não representam uma contagem atual. [JPL — descobertas de satélites](https://ssd.jpl.nasa.gov/sats/discovery.html) mantém uma relação atualizável.
- Órbitas circulares e coplanares, sem efemérides, excentricidade, perturbações ou posições atuais. A simulação começa em fases arbitrárias.
- Movimento ilustrativo restaurado a pedido do titular: 1× avança 2 dias orbitais por segundo; o giro visual é independente dos períodos siderais e completa uma volta em cerca de 126 segundos. O fator de velocidade altera ambos os movimentos; pausa e reinício atuam nos dois. Os valores de rotação das fichas continuam científicos. A animação não é uma reprodução temporal física.
- Inclinações dos eixos seguem a tabela NASA de 2025. Vênus e Urano mantêm o sentido retrógrado; anéis de Saturno acompanham o equador. Posições, meridianos iniciais e direções dos eixos no espaço são ilustrativos; precessão e rotação diferencial não são simuladas.
- Mapas de cor locais de 2.048 × 1.024 pixels: Solar System Scope, CC BY 4.0. Terra com nuvens e atmosfera, Sol texturizado, anéis de Saturno procedurais com faixas e divisão estilizada, iluminação com lado noturno e fundo preto com estrelas. Mapas possuem ajustes de cores e possíveis regiões preenchidas pelo autor. Consulte LICENSES.md. A aplicação não tem vínculo com a NASA.
- Temperatura dos gigantes refere-se a níveis atmosféricos convencionais; eles não possuem superfície sólida definida. Os valores de gravidade seguem as convenções da tabela NASA.
- O comparador distingue rotação sideral e dia solar. Barras lineares são normalizadas por linha e omitidas para temperaturas e rotações.
- A animação usa tempo decorrido com limite de passo de 0,1 s para evitar saltos após travamentos. Abas ocultas suspendem o agendamento de quadros, o relógio e a renderização; ao retornar, a simulação retoma sem acumular o tempo de ausência.

Consulte [VALIDATION.md](VALIDATION.md) para resultados e limites da verificação e [LICENSES.md](LICENSES.md) para créditos e direitos de uso.

**DIVISÃO 7 — Ciência além do horizonte. Per Vitam, Ad Astra.**






O Sol também pode ser selecionado diretamente na esfera ou pelo botão Sol. Sua ficha inclui história, diâmetro, temperaturas, idade, composição e rotação diferencial. A seleção não move a câmera; pausa, velocidade e reinício também afetam seu giro ilustrativo.

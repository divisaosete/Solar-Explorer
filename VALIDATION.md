# Verificação da entrega — 13/11/2026

A preparação e avaliação local ocorreram no projeto Solar-Explorer e no ZIP correspondente. Em 13/11/2026, o titular autorizou a publicação no GitHub e a ativação do Pages; o repositório local foi inicializado para essa etapa. A conclusão da publicação é verificada separadamente pela URL e pelo workflow do GitHub.

## Resultados automatizados

- Sintaxe de `src/main.js` e `src/solar.js`: aprovada por `node --check`.
- `npm test`: **15 testes aprovados**, sem falhas.
- Dados: oito fichas, identificadores, diâmetros médios derivados do JPL, temperaturas negativas e sentidos retrógrados.
- Simulação: períodos orbitais relativos, giro visual ilustrativo, inclinação dos eixos, pausa, velocidade padrão e equivalência entre diferentes FPS.
- Gestos: clique/toque, arraste que retorna ao início, pinça, botão direito e cancelamento.
- `npm run build`: compilação de produção aprovada. O Vite mantém aviso informativo sobre o chunk com Three.js acima de 500 kB; tamanho aproximado de 544 kB, 142 kB gzip, além de aproximadamente 5 MB de mapas JPEG locais.
- Instalação anterior: nenhuma vulnerabilidade reportada em 16 pacotes auditados. Esse resultado é da preparação, não uma auditoria permanente.
- HTML compilado e assets locais relativos conferidos no pacote.

## Revisão contra o pedido

- Planetas e Sol com mapas locais Solar System Scope 2k, luz solar, lado noturno, nuvens/atmosfera da Terra, anéis com faixas de Saturno e fundo preto com estrelas. Materiais procedurais são apenas fallback.
- Movimento ilustrativo restaurado conforme a orientação mais recente: giro visual de cerca de 126 segundos por volta em 1×; avanço orbital de 2 dias por segundo. Os períodos das fichas são científicos, mas não determinam o giro visual. Vênus e Urano mantêm sentido retrógrado pelos eixos inclinados.
- Fichas e comparador usam diâmetros médios volumétricos do JPL; os valores equatoriais originais são preservados separadamente nos dados.
- Aba oculta cancela o agendamento de quadros. A retomada não acumula o tempo de ausência.
- Seleção de planeta troca apenas ficha e destaque. Não aproxima, não centraliza, não altera o alvo da câmera e não acompanha o planeta. Zoom e visão geral são acionados explicitamente. Panorâmica limitada à região do sistema.
- Pinça, arraste, cancelamento e botão direito não provocam seleção de planeta.
- Retorno via cache de navegação preserva os recursos 3D em vez de descartá-los ao sair temporariamente da página.
- A entrada raiz abre `dist/index.html` no Live Server. `web/index.html` é a entrada de desenvolvimento do Vite.
- Paths relativos atendem à hospedagem em `/Solar-Explorer/` e a subpastas do Live Server. Essa escolha substitui o base absoluto do briefing para permitir os dois usos com o mesmo build.
- Workflow de publicação exclusivamente manual; CI de push/PR apenas verifica o projeto.

## Avaliação visual e interação real — pendentes

A ferramenta de navegador excedeu o tempo limite novamente nesta revisão ao tentar abrir uma aba. Portanto, não foi possível confirmar aparência final, FPS, funcionamento real no celular, erros de console, renderização WebGL ou estabilidade durante vários minutos. Testes de dados e gestos não substituem essa avaliação.

Antes de aprovar a publicação, abrir a entrada raiz com Live Server ou executar `npm run dev` e conferir:

- [ ] Modelos, cores, iluminação, anéis e legibilidade dos nomes.
- [ ] Seleção dos oito planetas por clique/toque e por nome.
- [ ] Seleção mantém câmera e zoom; controles manuais de zoom, panorâmica e retorno ao Sol.
- [ ] Pausa, retomada, velocidade, padrão e reinício do movimento ilustrativo.
- [ ] Órbitas, nomes, escalas e três opções de qualidade.
- [ ] Fichas, comparação de pares, temperaturas negativas e unidades.
- [ ] Teclado, foco visível, Escape e fechamento do comparador.
- [ ] Tela de 360 px, orientação e gestos sem rolagem horizontal.
- [ ] Movimento reduzido, aba oculta e retorno sem salto temporal.
- [ ] Console sem erros e recursos carregados sem falhas.
- [ ] Pelo menos cinco minutos sem degradação perceptível.
- [ ] Build servido em subpasta com os assets corretos.

A checagem HTTP local de uma etapa anterior foi bloqueada pela sandbox e expirou também com permissão ampliada. Não é considerada aprovada.

## Fontes e limitações

NASA Planetary Fact Sheet, edição de 18/03/2025, para valores arredondados, inclinações e períodos. Luas são um retrato dessa edição e não uma contagem atual. Diâmetros médios: duas vezes os raios médios de JPL Planetary Physical Parameters, consultados em 13/11/2026. Links na interface e no README.

Órbitas circulares e coplanares, posições e meridianos iniciais ilustrativos; sem efemérides, precessão ou rotação diferencial. Os mapas têm ajustes de cor e preenchimentos informados pelo autor; as ilustrações de missões são esquemáticas. O modo proporcional pode tornar planetas quase invisíveis na visão geral. Fichas e comparador permanecem disponíveis se WebGL falhar na inicialização.

## Pacote de avaliação

O ZIP inclui fontes, `web`, versão compilada `dist`, lockfile, documentação, avisos de licenças, `.gitignore` e workflows. Exclui `node_modules` e metadados Git. A publicação permanece condicionada à avaliação do titular.

## Painel inicial e aparência — revisão atual

A página começa com quatro cartões à direita: Voyager (sondas), Perseverance (rovers), Bennu/OSIRIS-REx (asteroides) e Rosetta/67P (cometas). Cada cartão expande detalhes e contém fonte institucional. Nenhum planeta é selecionado ao carregar. As oito fichas incluem história e link para a NASA. O botão Histórias de exploração restaura o painel inicial sem mover a câmera.

Mapas locais: oito planetas, Sol e nuvens terrestres, CC BY 4.0. Créditos e limitações em LICENSES.md e na interface. Dez arquivos JPEG verificados por testes automatizados; histórias e fontes também verificadas quanto à presença. O teste não confirma a renderização final.

A ferramenta de navegador voltou a exceder o tempo limite na tentativa de abrir esta revisão. Aparência final, interação WebGL e experiência em celular permanecem pendentes de avaliação real. O mapa da Terra e a captura de referência foram inspecionados como arquivos de imagem; isso não equivale a testar visualmente a aplicação.



Ajuste de usabilidade: órbitas dez vezes mais lentas (2 dias/s em 1×), giro visual três vezes mais lento (~126 s/volta) e identificação DIVISÃO 7 abaixo do título do observatório. Validação visual continua pendente.

Identificação DIVISÃO 7 no observatório e botão Visite a Divisão 7 no rodapé apontam para https://divisaosete.com/ em nova aba, com rel=noopener e indicação acessível.

Sol interativo: incluído entre os alvos do raycasting, com botão por nome, rótulo, destaque, giro ilustrativo e ficha/história próprias, sem zoom automático. Fonte: NASA Sun Facts, consulta 13/11/2026. Testes adicionais cobrem raycasting do Sol e de um planeta e a estrutura da ficha solar. Avaliação visual continua pendente.

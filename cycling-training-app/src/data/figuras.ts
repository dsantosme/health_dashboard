/**
 * Registro das ilustracoes dos materiais-fonte.
 *
 * Aqui so existem NOMES DE ARQUIVO — as imagens em si nao entram no git, porque
 * sao obra protegida (ver src/assets/livro/README.md). Quando o arquivo nao
 * esta presente na maquina, o app usa a figura SVG gerada por codigo.
 *
 * Convencao de nomes:
 *   {idDoExercicio}--execucao  ilustracao principal do movimento
 *   {idDoExercicio}--enfoque   o desenho do "Enfoque no ciclismo": o mesmo
 *                              musculo em acao na posicao de pedalar
 */

export interface FiguraDoLivro {
  arquivo: string
  legenda: string
  credito: string
}

const SOVNDAL = 'Anatomia do Ciclismo — Shannon Sovndal (Manole)'
const LBS = 'Primeiros passos para dominar a sua bike — Ludolf Bike School'

/** Ilustracao de execucao, por exercicio. */
export const EXECUCAO: Record<string, FiguraDoLivro> = {
  triceps_polia_alta: { arquivo: 'triceps_polia_alta--execucao', legenda: 'Triceps na polia alta', credito: `${SOVNDAL}, p. 20` },
  triceps_coice_halter: { arquivo: 'triceps_coice_halter--execucao', legenda: 'Triceps coice com halter', credito: `${SOVNDAL}, p. 22` },
  triceps_polia_costas: { arquivo: 'triceps_polia_costas--execucao', legenda: 'Triceps com polia alta, de costas para o aparelho', credito: `${SOVNDAL}, p. 24` },
  rosca_inversa: { arquivo: 'rosca_inversa--execucao', legenda: 'Rosca inversa', credito: `${SOVNDAL}, p. 26` },
  extensao_punho: { arquivo: 'extensao_punho--execucao', legenda: 'Extensao do punho', credito: `${SOVNDAL}, p. 28` },
  flexao_punho: { arquivo: 'flexao_punho--execucao', legenda: 'Flexao do punho', credito: `${SOVNDAL}, p. 30` },
  desenvolvimento_sentado: { arquivo: 'desenvolvimento_sentado--execucao', legenda: 'Desenvolvimento sentado com halteres', credito: `${SOVNDAL}, p. 36` },
  remada_em_pe: { arquivo: 'remada_em_pe--execucao', legenda: 'Remada em pe', credito: `${SOVNDAL}, p. 38` },
  elevacao_giro_halteres: { arquivo: 'elevacao_giro_halteres--execucao', legenda: 'Elevacao e giro com halteres', credito: `${SOVNDAL}, p. 40` },
  a_frame: { arquivo: 'a_frame--execucao', legenda: 'A-Frame', credito: `${SOVNDAL}, p. 42` },
  elevacao_lateral_bola: { arquivo: 'elevacao_lateral_bola--execucao', legenda: 'Elevacao lateral sobre a bola de estabilidade', credito: `${SOVNDAL}, p. 44` },
  remada_unilateral: { arquivo: 'remada_unilateral--execucao', legenda: 'Remada unilateral', credito: `${SOVNDAL}, p. 46` },

  mob_sola_pe: { arquivo: 'mob_sola_pe--execucao', legenda: 'Liberacao da sola do pe', credito: LBS },
  mob_gastrocnemio: { arquivo: 'mob_gastrocnemio--execucao', legenda: 'Mobilidade de gastrocnemio na parede', credito: LBS },
  mob_soleo: { arquivo: 'mob_soleo--execucao', legenda: 'Mobilidade de soleo no degrau', credito: LBS },
  mob_isquiotibiais: { arquivo: 'mob_isquiotibiais--execucao', legenda: 'Isquiotibiais com faixa', credito: LBS },
  mob_gluteo_deitado: { arquivo: 'mob_gluteo_deitado--execucao', legenda: 'Gluteo deitado', credito: LBS },
  tec_postura_ataque: { arquivo: 'tec_postura_ataque--execucao', legenda: 'Postura de ataque na trilha', credito: LBS },
  tec_pedalada_unilateral: { arquivo: 'tec_pedalada_unilateral--execucao', legenda: 'Pedalada comum x pedalada redonda', credito: LBS },
}

/** O desenho do "Enfoque no ciclismo": o musculo em acao sobre a bike. */
export const ENFOQUE: Record<string, FiguraDoLivro> = {
  triceps_polia_alta: { arquivo: 'triceps_polia_alta--enfoque', legenda: 'Maos no topo do guidao: triceps sob tensao constante', credito: `${SOVNDAL}, p. 21` },
  triceps_coice_halter: { arquivo: 'triceps_coice_halter--enfoque', legenda: 'A posicao inclinada do tronco na bike', credito: `${SOVNDAL}, p. 23` },
  triceps_polia_costas: { arquivo: 'triceps_polia_costas--enfoque', legenda: 'Conter o balanco lateral da bike a cada pedalada', credito: `${SOVNDAL}, p. 25` },
  rosca_inversa: { arquivo: 'rosca_inversa--enfoque', legenda: 'Preensao e controle do guidao em descida', credito: `${SOVNDAL}, p. 27` },
  extensao_punho: { arquivo: 'extensao_punho--enfoque', legenda: 'Forca de preensao no trecho irregular', credito: `${SOVNDAL}, p. 29` },
  flexao_punho: { arquivo: 'flexao_punho--enfoque', legenda: 'A mao segurando firme no sprint', credito: `${SOVNDAL}, p. 31` },
  desenvolvimento_sentado: { arquivo: 'desenvolvimento_sentado--enfoque', legenda: 'Ombros contrapondo o peso do tronco', credito: `${SOVNDAL}, p. 37` },
  remada_em_pe: { arquivo: 'remada_em_pe--enfoque', legenda: 'Tracionar o guidao na subida', credito: `${SOVNDAL}, p. 39` },
  elevacao_giro_halteres: { arquivo: 'elevacao_giro_halteres--enfoque', legenda: 'O deslocamento de peso ao levantar do selim', credito: `${SOVNDAL}, p. 41` },
  a_frame: { arquivo: 'a_frame--enfoque', legenda: 'O manguito rotador estabilizando o ombro na posicao de pedalar', credito: `${SOVNDAL}, p. 43` },
  elevacao_lateral_bola: { arquivo: 'elevacao_lateral_bola--enfoque', legenda: 'As duas forcas que incidem no ombro', credito: `${SOVNDAL}, p. 45` },
  remada_unilateral: { arquivo: 'remada_unilateral--enfoque', legenda: 'A tracao oscilante do guidao no sprint final', credito: `${SOVNDAL}, p. 47` },
}

/** Figuras de anatomia, exibidas na tela Base. */
export const ANATOMIA: (FiguraDoLivro & { regiao: string })[] = [
  { regiao: 'membros_inferiores', arquivo: 'fig_1_3_posicao', legenda: 'Figura 1.3 — a posicao adequada sobre a bicicleta', credito: `${SOVNDAL}, p. 4` },
  { regiao: 'membros_inferiores', arquivo: 'fig_1_1_fibra', legenda: 'Figura 1.1 — detalhes de uma fibra muscular', credito: `${SOVNDAL}, p. 2` },
  { regiao: 'membros_superiores', arquivo: 'fig_2_1_biceps', legenda: 'Figuras 2.1 e 2.2 — biceps, braquial e triceps braquial', credito: `${SOVNDAL}, p. 12` },
  { regiao: 'membros_superiores', arquivo: 'fig_2_3_antebraco', legenda: 'Figura 2.3 — musculos do antebraco: flexores e extensores', credito: `${SOVNDAL}, p. 13` },
  { regiao: 'ombro_pescoco', arquivo: 'fig_3_1_deltoide', legenda: 'Figura 3.1 — musculo deltoide', credito: `${SOVNDAL}, p. 33` },
  { regiao: 'ombro_pescoco', arquivo: 'fig_3_2_manguito', legenda: 'Figura 3.2 — manguito rotador e musculos do pescoco', credito: `${SOVNDAL}, p. 34` },
  { regiao: 'membros_inferiores', arquivo: 'anat_cadeia_posterior', legenda: 'A cadeia muscular posterior, do pe a cabeca', credito: LBS },
  { regiao: 'membros_inferiores', arquivo: 'anat_pedalada_musculos', legenda: 'Musculos usados em cada grau da pedalada', credito: LBS },
  { regiao: 'membros_inferiores', arquivo: 'anat_quadriceps', legenda: 'Quadriceps: reto femoral, vastos lateral, medial e intermedio', credito: LBS },
  { regiao: 'membros_inferiores', arquivo: 'anat_gluteo_patela', legenda: 'Gluteos, tensor da fascia lata e o posicionamento da patela', credito: LBS },
  { regiao: 'abdome', arquivo: 'anat_psoas', legenda: 'Psoas: solicitado ao puxar o pedal para cima', credito: LBS },
  { regiao: 'dorso', arquivo: 'anat_quadrado_lombar', legenda: 'Quadrado lombar: sofre quando o quadril gira no selim', credito: LBS },
  { regiao: 'dorso', arquivo: 'anat_retroversao', legenda: 'Retroversao pelvica: o giro posterior do quadril', credito: LBS },
  { regiao: 'ombro_pescoco', arquivo: 'anat_cervical_celular', legenda: 'A carga na cervical na postura do celular', credito: LBS },
]

/** Fotos do bike setup, ligadas aos itens do checklist. */
export const SETUP: Record<string, FiguraDoLivro> = {
  guidom_largura: { arquivo: 'setup_guidom_largura', legenda: 'Largura do guidom', credito: LBS },
  guidom_giro: { arquivo: 'setup_guidom_giro', legenda: 'Giro do guidom e o angulo do punho', credito: LBS },
  manetes: { arquivo: 'setup_manetes', legenda: 'O indicador repousando na curvinha da manete', credito: LBS },
  pneus: { arquivo: 'setup_pneus', legenda: 'Calibragem: aderencia contra rolagem', credito: LBS },
  suspensao: { arquivo: 'setup_suspensao', legenda: 'Leitura do SAG pelo anel marcador', credito: LBS },
  selim_altura: { arquivo: 'setup_selim_altura', legenda: 'Pe as 6 horas, paralelo ao solo, joelho em semiflexao', credito: LBS },
  pes_pedal: { arquivo: 'setup_pes_pedal', legenda: 'Alinhamento do pe sobre o eixo do pedal', credito: LBS },
}

/** Figuras avulsas usadas em avisos da anamnese. */
export const EXTRAS: Record<string, FiguraDoLivro> = {
  nervos_mao: { arquivo: 'setup_nervos_mao', legenda: 'Nervos ulnar e mediano: onde a dormencia aparece', credito: LBS },
  joelho_selim: { arquivo: 'setup_selim_joelho', legenda: 'Joelho alinhado x joelho para dentro', credito: LBS },
}

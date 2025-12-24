// dados-feed.js
import { dadosAnalise } from "./dados-analise.js";
import { dadosEntrevistas } from "./dados-entrevistas.js";
import { dadosLancamentos } from "./dados-lancamentos.js";
import { dadosManchetes } from "./dados-manchetes.js";
import { dadosPodcast } from "./dados-podcast.js";

// Cria um array único com todas as notícias de todos os arquivos
export const dadosFeed = [
    ...dadosManchetes,
    ...dadosAnalise,
    ...dadosEntrevistas,
    ...dadosLancamentos,
    ...dadosPodcast
];

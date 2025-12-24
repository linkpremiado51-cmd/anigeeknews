// dados-feed.js
import { dadosAnalise } from "./dados-analise.js";
import { dadosEntrevistas } from "./dados-entrevistas.js";
import { dadosLancamentos } from "./dados-lancamentos.js";
import { dadosManchetes } from "./dados-manchetes.js";
import { dadosPodcast } from "./dados-podcast.js";

// cria um array único com todas as notícias
export const dadosFeed = [
    ...dadosManchetes,
    ...dadosAnalise,
    ...dadosEntrevistas,
    ...dadosLancamentos,
    ...dadosPodcast
];

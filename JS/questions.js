const QUESTIONS = [
	// MITOSE (32)

	// fáceis
	{ prompt: "Em qual fase da mitose os cromossomos se alinham no plano equatorial? a) profase b) metafase c) anafase d) telofase", answer: "b", type: "facil" },
	{ prompt: "Qual processo gera duas celulas-filhas identicas? a) meiose b) mitose c) fecundacao d) crossing-over", answer: "b", type: "facil" },
	{ prompt: "Celulas somaticas se dividem por: a) meiose b) mitose c) fecundacao d) clonagem", answer: "b", type: "facil" },
	{ prompt: "Em qual fase as cromatides irmas se separam? a) profase b) metafase c) anafase d) telofase", answer: "c", type: "facil" },
	{ prompt: "A mitose produz quantas celulas-filhas? a) 2 b) 3 c) 4 d) 8", answer: "a", type: "facil" },
	{ prompt: "Em qual fase os cromossomos se condensam? a) telofase b) profase c) metafase d) interfase", answer: "b", type: "facil" },
	{ prompt: "Qual fase sucede a anafase? a) profase b) interfase c) telofase d) metafase", answer: "c", type: "facil" },
	{ prompt: "Qual fase antecede a profase? a) metafase b) interfase c) anafase d) telofase", answer: "b", type: "facil" },

	// médias
	{ prompt: "Qual e a funcao do fuso mitotico? a) produzir energia b) separar cromossomos c) sintetizar proteinas d) duplicar DNA", answer: "b", type: "media" },
	{ prompt: "A duplicacao do DNA ocorre em qual fase? a) profase b) metafase c) fase s d) telofase", answer: "c", type: "media" },
	{ prompt: "Em qual fase a carioteca se reorganiza? a) profase b) metafase c) anafase d) telofase", answer: "d", type: "media" },
	{ prompt: "Qual estrutura organiza o fuso? a) ribossomo b) centriolo c) nucleo d) lisossomo", answer: "b", type: "media" },
	{ prompt: "Mitose mantem o numero de cromossomos? a) sim b) nao c) dobra d) reduz", answer: "a", type: "media" },
	{ prompt: "Qual fase apresenta cromossomos mais visiveis? a) profase b) metafase c) anafase d) telofase", answer: "b", type: "media" },

	// difíceis
	{ prompt: "Qual processo ocorre durante a divisao do nucleo? a) citocinese b) cariocinese c) replicacao d) digestao", answer: "b", type: "dificil" },
	{ prompt: "Mitose gera variabilidade genetica? a) sim b) nao c) as vezes d) depende", answer: "b", type: "dificil" },
	{ prompt: "O fuso mitotico e formado por: a) lipideos b) microtubulos c) DNA d) agua", answer: "b", type: "dificil" },
	{ prompt: "A citocinese ocorre em qual momento? a) inicio b) meio c) final d) antes da interfase", answer: "c", type: "dificil" },

	// verdadeiro ou falso
	{ prompt: "A mitose gera celulas identicas.", answer: "verdadeiro", type: "verdadeiro_falso" },
	{ prompt: "A mitose reduz o numero de cromossomos pela metade.", answer: "falso", type: "verdadeiro_falso" },
	{ prompt: "A mitose ocorre em celulas somaticas.", answer: "verdadeiro", type: "verdadeiro_falso" },
	{ prompt: "O fuso mitotico ajuda a separar cromossomos.", answer: "verdadeiro", type: "verdadeiro_falso" },
	{ prompt: "O DNA se duplica na interfase.", answer: "verdadeiro", type: "verdadeiro_falso" },
	{ prompt: "A citocinese separa o citoplasma.", answer: "verdadeiro", type: "verdadeiro_falso" },

	// especiais
	{ prompt: "Qual processo e essencial para crescimento? a) meiose b) mitose c) digestao d) respiracao", answer: "b", type: "especial" },
	{ prompt: "Qual fase inicia a mitose? a) profase b) metafase c) anafase d) telofase", answer: "a", type: "especial" },
	{ prompt: "Qual fase tem cromossomos no equador? a) metafase b) profase c) telofase d) anafase", answer: "a", type: "especial" },
	{ prompt: "Qual fase reconstrói o nucleo? a) telofase b) profase c) metafase d) anafase", answer: "a", type: "especial" },

	// MEIOSE (32)

	// fáceis
	{ prompt: "A meiose possui quantas divisoes? a) 1 b) 2 c) 3 d) 4", answer: "b", type: "facil" },
	{ prompt: "Gametas sao produzidos por: a) mitose b) meiose c) clonagem d) fragmentacao", answer: "b", type: "facil" },
	{ prompt: "A meiose produz quantas celulas-filhas? a) 2 b) 3 c) 4 d) 6", answer: "c", type: "facil" },
	{ prompt: "O que e um gameta? a) celula somatica b) celula sexual c) nervosa d) tronco", answer: "b", type: "facil" },
	{ prompt: "O que e haploide? a) n b) 2n c) 3n d) 4n", answer: "a", type: "facil" },
	{ prompt: "O que e diploide? a) n b) 2n c) 3n d) 4n", answer: "b", type: "facil" },

	// médias
	{ prompt: "Em qual etapa ocorre o crossing-over? a) profase i b) metafase i c) anafase ii d) telofase ii", answer: "a", type: "media" },
	{ prompt: "Na meiose I, o que se separa? a) cromatides b) cromossomos homologos c) nucleo d) genes", answer: "b", type: "media" },
	{ prompt: "Qual fase separa cromatides irmas? a) anafase i b) metafase ii c) anafase ii d) profase ii", answer: "c", type: "media" },
	{ prompt: "Quantos cromossomos tem um gameta humano? a) 46 b) 23 c) 92 d) 12", answer: "b", type: "media" },
	{ prompt: "Qual fase finaliza a meiose I? a) telofase i b) profase i c) anafase i d) metafase i", answer: "a", type: "media" },
	{ prompt: "Qual fase ocorre pareamento de homologos? a) profase i b) metafase ii c) anafase i d) telofase ii", answer: "a", type: "media" },

	// difíceis
	{ prompt: "A variabilidade genetica vem do crossing-over e: a) mutacao b) segregacao independente c) mitose d) replicacao", answer: "b", type: "dificil" },
	{ prompt: "A sinapse ocorre em: a) profase i b) metafase ii c) anafase i d) telofase ii", answer: "a", type: "dificil" },
	{ prompt: "O quiasma e observado em: a) profase i b) metafase i c) anafase ii d) telofase i", answer: "a", type: "dificil" },
	{ prompt: "Cromossomos homologos sao: a) identicos b) genes para mesmas caracteristicas c) inexistentes d) mutantes", answer: "b", type: "dificil" },

	// verdadeiro ou falso
	{ prompt: "A meiose reduz o numero de cromossomos pela metade.", answer: "verdadeiro", type: "verdadeiro_falso" },
	{ prompt: "A meiose gera variabilidade genetica.", answer: "verdadeiro", type: "verdadeiro_falso" },
	{ prompt: "A meiose ocorre em celulas somaticas.", answer: "falso", type: "verdadeiro_falso" },
	{ prompt: "Cromatides irmas se separam na meiose I.", answer: "falso", type: "verdadeiro_falso" },
	{ prompt: "Crossing-over ocorre na profase I.", answer: "verdadeiro", type: "verdadeiro_falso" },
	{ prompt: "A meiose II separa cromossomos homologos.", answer: "falso", type: "verdadeiro_falso" },

	// especiais
	{ prompt: "Qual divisao reduz cromossomos? a) mitose b) meiose i c) meiose ii d) interfase", answer: "b", type: "especial" },
	{ prompt: "Qual processo aumenta variabilidade? a) mitose b) crossing-over c) citocinese d) replicacao", answer: "b", type: "especial" },
	{ prompt: "Qual evento caracteriza a meiose I? a) separacao de cromatides b) reducao cromossomica c) replicacao d) crescimento", answer: "b", type: "especial" },
	{ prompt: "Qual celula e formada apos fecundacao? a) gameta b) zigoto c) embriao d) ovulo", answer: "b", type: "especial" }
];
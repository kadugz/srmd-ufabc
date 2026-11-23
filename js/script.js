(function(){"use strict";
var $=function(s){return document.querySelector(s)},H=document.documentElement,mem={};
function get(k,d){try{var v=localStorage.getItem(k);if(v!==null)return JSON.parse(v)}catch(e){}return k in mem?mem[k]:d}
function set(k,v){mem[k]=v;try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function mm(q){return window.matchMedia&&matchMedia(q).matches}
function esc(t){var d=document.createElement("div");d.textContent=t;return d.innerHTML}
function norm(t){return String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim()}
var DEF={theme:"",size:100,font:"",bold:0,sp:0,motion:"",focus:"",big:0,sound:0,rate:1,voice:""};
var P=Object.assign({},DEF,get("srmd-prefs",{}));
var CT=[["theme","Tema de cores",[["","Automático (do aparelho)"],["light","Claro"],["dark","Escuro (cores invertidas)"],["hc","Alto contraste"],["soft","Suave (menos brilho)"]]],
["size","Tamanho do texto",[[100,"100%"],[125,"125%"],[150,"150%"],[200,"200%"]]],
["font","Fonte",[["","Padrão"],["verdana","Verdana (mais espaçada)"],["serif","Com serifa (Georgia)"]]],
["focus","Contorno de foco",[["","Padrão"],["thick","Reforçado"]]],
["motion","Movimento da interface",[["","Automático (do aparelho)"],["off","Reduzido"],["on","Normal"]]],
["rate","Velocidade da voz",[[0.75,"Lenta"],[1,"Normal"],[1.25,"Rápida"],[1.5,"Muito rápida"]]]];
var CK=[["bold","Texto em negrito"],["sp","Espaçamento de texto ampliado"],["big","Áreas de toque maiores"],["sound","Sons de confirmação"]];
$("#pg").innerHTML=CT.map(function(c){return '<label>'+c[1]+'<select data-p="'+c[0]+'">'+c[2].map(function(o){return '<option value="'+o[0]+'">'+o[1]+'</option>'}).join("")+'</select></label>'}).join("")+
'<label>Voz da leitura<select data-p="voice" id="voice"><option value="">Voz padrão</option></select></label>'+
CK.map(function(c){return '<label class="k"><input type="checkbox" data-p="'+c[0]+'"> '+c[1]+'</label>'}).join("");
function apply(){
 var t=P.theme||(mm("(prefers-contrast: more)")?"hc":mm("(prefers-color-scheme: dark)")?"dark":"light");
 H.dataset.t=t;H.style.setProperty("--fs",P.size/100);
 H.dataset.font=P.font;H.dataset.focus=P.focus;H.dataset.bold=P.bold?"on":"";H.dataset.sp=P.sp?"on":"";H.dataset.big=P.big?"on":"";
 H.dataset.m=P.motion||(mm("(prefers-reduced-motion: reduce)")?"off":"on");
 document.querySelectorAll("[data-p]").forEach(function(el){var v=P[el.dataset.p];if(el.type==="checkbox")el.checked=!!v;else el.value=String(v)});
}
function save(){set("srmd-prefs",P)}
document.addEventListener("change",function(e){var el=e.target.closest("[data-p]");if(!el)return;var k=el.dataset.p;
 P[k]=el.type==="checkbox"?(el.checked?1:0):(k==="size"||k==="rate")?Number(el.value):el.value;apply();save();say("Preferência atualizada.")});
document.addEventListener("change",function(e){if(e.target.id!=="impfile")return;var file=e.target.files&&e.target.files[0];if(!file)return;
 var reader=new FileReader();
 reader.onload=function(ev){impText=String(ev.target.result||"");var ta=$("#impta");if(ta)ta.value=impText;say("Arquivo "+file.name+" carregado. Revise o texto e clique em Analisar.")};
 reader.onerror=function(){say("Não foi possível ler o arquivo "+file.name+".")};
 reader.readAsText(file,"UTF-8")});
/* voz / leitura */
var SS=("speechSynthesis" in window)?window.speechSynthesis:null,ac;
function vl(){if(!SS)return;var s=$("#voice");s.innerHTML='<option value="">Voz padrão</option>'+SS.getVoices().filter(function(v){return /pt/i.test(v.lang)}).map(function(v){return '<option value="'+esc(v.name)+'">'+esc(v.name)+'</option>'}).join("");s.value=P.voice}
if(SS){vl();SS.onvoiceschanged=vl}
function speak(txt){if(!SS){say("Este navegador não oferece leitura em voz alta.");return}SS.cancel();var u=new SpeechSynthesisUtterance(txt);u.lang="pt-BR";u.rate=P.rate;
 var v=SS.getVoices().filter(function(x){return x.name===P.voice})[0];if(v)u.voice=v;SS.speak(u)}
function beep(){if(!P.sound)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();var o=ac.createOscillator(),g=ac.createGain();o.frequency.value=660;g.gain.value=.05;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.12)}catch(e){}}
function say(m){var s=$("#status");s.textContent="";setTimeout(function(){s.textContent=m},60);beep()}

/* ========== Catálogo das disciplinas obrigatórias do BCC ==========
   Códigos, créditos e carga horária conforme o PPC do BCC (Tabela 7).
   Pré-requisitos conforme a Figura 2 do PPC (recomendações entre
   disciplinas obrigatórias do BCC e do BC&T). */
var COURSES={
 PE:{code:"MCTA028-15",name:"Programação Estruturada",cred:4,hr:"48h",pre:[]},
 POO:{code:"MCTA018-13",name:"Programação Orientada a Objetos",cred:4,hr:"48h",pre:["PE"]},
 ES:{code:"MCTA033-15",name:"Engenharia de Software",cred:4,hr:"48h",pre:["POO"]},
 CG:{code:"MCCC007-23",name:"Computação Gráfica",cred:4,hr:"48h",pre:["POO","AED1"]},
 IHC:{code:"MCZA008-17",name:"Interação Humano-Computador",cred:4,hr:"48h",pre:[]},
 AED1:{code:"MCCC001-23",name:"Algoritmos e Estruturas de Dados I",cred:4,hr:"48h",pre:["PE"]},
 AED2:{code:"MCCC002-23",name:"Algoritmos e Estruturas de Dados II",cred:4,hr:"48h",pre:["AED1"]},
 PF:{code:"MCCC015-23",name:"Programação Funcional",cred:4,hr:"48h",pre:["AED1"]},
 IA:{code:"MCCC008-23",name:"Inteligência Artificial",cred:4,hr:"48h",pre:["AED1"]},
 GRAFOS:{code:"MCCC003-23",name:"Algoritmos em Grafos",cred:4,hr:"48h",pre:["AED2","MD2"]},
 AA1:{code:"MCCC004-23",name:"Análise de Algoritmos I",cred:4,hr:"48h",pre:["GRAFOS"]},
 AA2:{code:"MCCC005-23",name:"Análise de Algoritmos II",cred:4,hr:"48h",pre:["AA1"]},
 LFA:{code:"MCCC009-23",name:"Linguagens Formais e Autômatos",cred:4,hr:"48h",pre:["AA2"]},
 COMP:{code:"MCCC006-23",name:"Compiladores e Interpretadores",cred:4,hr:"48h",pre:["LFA"]},
 ARQ:{code:"MCTA004-17",name:"Arquitetura de Computadores",cred:4,hr:"48h",pre:["AED1","SD"]},
 SO:{code:"MCTA026-13",name:"Sistemas Operacionais",cred:4,hr:"48h",pre:["AED2","ARQ"]},
 SD:{code:"MCTA024-13",name:"Sistemas Digitais",cred:4,hr:"48h",pre:["CD"]},
 CD:{code:"MCTA006-17",name:"Circuitos Digitais",cred:4,hr:"48h",pre:[]},
 MD:{code:"MCBM006-23",name:"Matemática Discreta",cred:4,hr:"48h",pre:[]},
 MD2:{code:"MCCC010-23",name:"Matemática Discreta II",cred:4,hr:"48h",pre:["MD"]},
 REDES:{code:"MCTA022-17",name:"Redes de Computadores",cred:4,hr:"48h",pre:["POO","AED1"]},
 SDIST:{code:"MCTA025-13",name:"Sistemas Distribuídos",cred:4,hr:"48h",pre:["REDES","SO"]},
 SEG:{code:"MCTA023-17",name:"Segurança de Dados",cred:4,hr:"48h",pre:["REDES"]},
 MBD:{code:"MCCC012-23",name:"Modelagem de Banco de Dados",cred:4,hr:"48h",pre:["POO"]},
 AL:{code:"MCTB001-17",name:"Álgebra Linear",cred:6,hr:"72h",pre:[]},
 CES:{code:"MCTA009-13",name:"Computadores, Ética e Sociedade",cred:2,hr:"24h",pre:[]},
 MECC:{code:"MCCC011-23",name:"Metodologia e Escrita Científica para Ciência da Computação",cred:2,hr:"48h",pre:[]}
};
var UNLOCK={};
Object.keys(COURSES).forEach(function(id){UNLOCK[id]=[]});
Object.keys(COURSES).forEach(function(id){COURSES[id].pre.forEach(function(p){UNLOCK[p].push(id)})});
var ST={c:["★","Cursada"],l:["●","Liberada para matrícula"],b:["▣","Bloqueada"]};
function status(id,hist){if(hist.indexOf(id)>-1)return"c";return COURSES[id].pre.every(function(p){return hist.indexOf(p)>-1})?"l":"b"}
function recommend(hist){return Object.keys(COURSES).filter(function(id){return hist.indexOf(id)<0&&COURSES[id].pre.every(function(p){return hist.indexOf(p)>-1})})}

/* ========== Importar histórico (texto colado ou arquivo .csv/.txt) ==========
   Lido só no navegador (FileReader), nada é enviado a servidor. Cada linha é
   comparada ao catálogo por código, por nome exato ou por conter o código/nome
   em algum lugar da linha (cobre "MCTA028-15,Programação Estruturada,A" e nomes
   com vírgula, como "Computadores, Ética e Sociedade"). Casos ambíguos (mais de
   uma disciplina bateria com a linha) ficam como não reconhecidos, em vez de
   um palpite errado. */
function matchLine(line){
 var first=norm(line.split(",")[0]||"");
 if(first){
  var byCode=Object.keys(COURSES).filter(function(id){return norm(COURSES[id].code)===first});
  if(byCode.length===1)return byCode[0];
  var byName=Object.keys(COURSES).filter(function(id){return norm(COURSES[id].name)===first});
  if(byName.length===1)return byName[0];
 }
 var full=norm(line);
 if(!full)return null;
 var byContains=Object.keys(COURSES).filter(function(id){return full.indexOf(norm(COURSES[id].code))>-1||full.indexOf(norm(COURSES[id].name))>-1});
 return byContains.length===1?byContains[0]:null;
}
function parseImport(text){
 var lines=String(text).split(/\r?\n/).map(function(l){return l.trim()}).filter(function(l){return l});
 var matched=[],unmatched=[];
 lines.forEach(function(line){var id=matchLine(line);
  if(id){if(matched.indexOf(id)<0)matched.push(id)}
  else unmatched.push(line)});
 return{matched:matched,unmatched:unmatched}}
function motivo(id){var pre=COURSES[id].pre;if(!pre.length)return"Não exige nenhum pré-requisito — você já pode cursar.";
 var ns=pre.map(function(p){return COURSES[p].name});
 return"Porque você já cursou "+(ns.length>1?ns.slice(0,-1).join(", ")+" e "+ns[ns.length-1]:ns[0])+"."}
function resumoTxt(id,hist){var c=COURSES[id],s=status(id,hist),u=UNLOCK[id];
 var base="Você está vendo "+c.code+", "+c.name+". ";
 if(s==="c")return base+"Você já cursou esta disciplina.";
 if(s==="l")return base+"Está liberada para matrícula"+(c.pre.length?": os pré-requisitos diretos ("+c.pre.map(function(p){return COURSES[p].name}).join(", ")+") já foram cursados.":", pois ela não exige nenhum pré-requisito.")+(u.length?" Ao cursá-la, você desbloqueia "+u.map(function(x){return COURSES[x].name}).join(", ")+".":"");
 var faltam=c.pre.filter(function(p){return hist.indexOf(p)<0}).map(function(p){return COURSES[p].name});
 return base+"Está bloqueada: faltam "+faltam.join(", ")+"."}
function nodeLi(id,hist,foco){var s=status(id,hist),c=COURSES[id];
 return'<li class="nd '+s+(foco?" foco":"")+'"><span class="sh" aria-hidden="true">'+ST[s][0]+'</span><span><small>'+esc(c.code)+'</small><em>'+esc(c.name)+'</em><small>'+ST[s][1]+'</small></span></li>'}
function grafoCols(f,hist){var c=COURSES[f],pre=c.pre,unl=UNLOCK[f];
 function col(t,ids){return'<div><h3>'+t+'</h3><ul>'+(ids.length?ids.map(function(id){return nodeLi(id,hist,id===f)}).join(""):'<li style="list-style:none" class="mu">Nenhuma</li>')+'</ul></div>'}
 return'<div class="sc" tabindex="0" role="region" aria-label="Vizinhança de pré-requisitos de '+esc(c.name)+' (rolável)"><div class="cols" style="grid-template-columns:repeat(3,minmax(220px,1fr));min-width:640px">'+col("Pré-requisitos diretos",pre)+col("Disciplina em foco",[f])+col("Desbloqueia diretamente",unl)+'</div></div>'}
function grafoDetail(f,hist){var c=COURSES[f],done=c.pre.filter(function(p){return hist.indexOf(p)>-1}),pend=c.pre.filter(function(p){return hist.indexOf(p)<0}),unl=UNLOCK[f];
 function card(t,body){return'<div class="card"><h3>'+t+'</h3>'+body+'</div>'}
 function listOf(ids,emptyMsg){return ids.length?'<ul class="b">'+ids.map(function(id){return'<li>'+esc(COURSES[id].code)+" — "+esc(COURSES[id].name)+'</li>'}).join("")+'</ul>':'<p class="mu">'+emptyMsg+'</p>'}
 var pendBody=hist.indexOf(f)>-1?'<p class="mu">Você já concluiu esta disciplina.</p>':(!pend.length?'<p class="mu">Nenhuma pendência — você já pode se matricular.</p>':listOf(pend,""));
 return'<div class="g3" style="margin-top:1.5rem">'+
  card("Pré-requisitos cumpridos",listOf(done,"Nenhum pré-requisito direto."))+
  card("Pendências para matrícula",pendBody)+
  card("Impacto e desbloqueios",listOf(unl,"Nenhuma disciplina depende desta."))+
 '</div>'}
function grafoLista(hist){var gs=[["c","Cursadas"],["l","Liberadas para matrícula"],["b","Bloqueadas"]];
 return gs.map(function(g){var ids=Object.keys(COURSES).filter(function(id){return status(id,hist)===g[0]}).sort(function(a,b){return COURSES[a].name.localeCompare(COURSES[b].name,"pt-BR")});
  return'<h3>'+g[1]+' ('+ids.length+')</h3><ol class="lst">'+(ids.length?ids.map(function(id){var c=COURSES[id];var pt=c.pre.length?"Para cursar, você precisa de "+c.pre.map(function(p){return COURSES[p].name}).join(" e ")+".":"Não exige pré-requisito.";
    return'<li class="nd '+g[0]+'"><span><b>'+esc(c.code)+" — "+esc(c.name)+'</b><br>'+pt+'</span></li>'}).join(""):'<li class="mu" style="list-style:none">Nenhuma disciplina nesta situação ainda.</li>')+'</ol>'}).join("")}

/* ========== Autocompletar acessível (padrão ARIA combobox) ==========
   Usado para "disciplina cursada" (grade) e "escolher disciplina" (grafo).
   As sugestões são pintadas direto num <ul> fixo (sem recriar a página
   inteira), senão o campo perde o foco a cada tecla digitada. */
var COMBO={ac:{q:"",items:[],active:-1},fc:{q:"",items:[],active:-1}};
var acPick=null;
function matchCourses(q){var n=norm(q);if(!n)return[];
 return Object.keys(COURSES).filter(function(id){return norm(id).indexOf(n)>-1||norm(COURSES[id].code).indexOf(n)>-1||norm(COURSES[id].name).indexOf(n)>-1}).slice(0,8)}
function optHtml(key,id,i,active){return'<li role="option" id="'+key+'opt'+i+'" data-combo="'+key+'" data-pick="'+id+'" aria-selected="'+(i===active)+'" class="combo-opt'+(i===active?" active":"")+'">'+esc(COURSES[id].code)+" — "+esc(COURSES[id].name)+'</li>'}
function paintCombo(key){var st=COMBO[key],el=$("#"+key+"lb"),inp=$("#"+key+"i");if(!el||!inp)return;
 el.innerHTML=st.items.map(function(id,i){return optHtml(key,id,i,st.active)}).join("");
 inp.setAttribute("aria-expanded",st.items.length>0?"true":"false");
 if(st.active>-1)inp.setAttribute("aria-activedescendant",key+"opt"+st.active);else inp.removeAttribute("aria-activedescendant")}
function searchCombo(key){var st=COMBO[key];st.items=matchCourses(st.q);st.active=st.items.length?0:-1;paintCombo(key)}
function moveCombo(key,dir){var st=COMBO[key];if(!st.items.length)return;st.active=(st.active+dir+st.items.length)%st.items.length;paintCombo(key)}
function pickCombo(key,id){if(key==="ac"){acPick=id;COMBO.ac.items=[];COMBO.ac.active=-1;COMBO.ac.q=COURSES[id].code+" — "+COURSES[id].name;$("#aci").value=COMBO.ac.q;paintCombo("ac");$("#aci").focus()}
 else if(key==="fc"){COMBO.fc.q="";COMBO.fc.items=[];COMBO.fc.active=-1;location.hash="grafo:"+id}}

/* ========== Biblioteca: exemplos cadastrados ========== */
var B=[
["PE","fisico digital",["5 exemplares físicos disponíveis","Versão digital no acervo online"],["DEITEL, P.; DEITEL, H. C: Como Programar. 8. ed. São Paulo: Pearson, 2017."],["KERNIGHAN, B.; RITCHIE, D. The C Programming Language. 2. ed. Englewood Cliffs: Prentice Hall, 1988."]],
["AED1","fisico digital",["3 exemplares físicos disponíveis","Versão digital no acervo online"],["CORMEN, T. H. et al. Algoritmos: teoria e prática. Rio de Janeiro: Elsevier, 2012.","ZIVIANI, N. Projeto de Algoritmos. São Paulo: Cengage Learning, 2011."],["SEDGEWICK, R.; WAYNE, K. Algorithms. 4. ed. Boston: Addison-Wesley, 2011."]],
["AED2","digital acessivel",["Versão digital no acervo online","Alternativa em áudio disponível"],["SEDGEWICK, R.; WAYNE, K. Algorithms. 4. ed. Boston: Addison-Wesley, 2011."],["CORMEN, T. H. et al. Algoritmos: teoria e prática. Rio de Janeiro: Elsevier, 2012."]],
["ES","fisico",["1 exemplar físico disponível"],["SOMMERVILLE, I. Engenharia de Software. 10. ed. São Paulo: Pearson, 2019."],["PRESSMAN, R. S. Engenharia de Software: uma abordagem profissional. 8. ed. Porto Alegre: AMGH, 2016."]],
["ARQ","digital",["Versão digital no acervo online"],["PATTERSON, D. A.; HENNESSY, J. L. Organização e Projeto de Computadores. 5. ed. Rio de Janeiro: Elsevier, 2017."],["STALLINGS, W. Arquitetura e Organização de Computadores. 10. ed. São Paulo: Pearson, 2017."]],
["SO","fisico",["2 exemplares físicos disponíveis"],["SILBERSCHATZ, A.; GALVIN, P. B.; GAGNE, G. Fundamentos de Sistemas Operacionais. Rio de Janeiro: LTC, 2015."],["TANENBAUM, A. S. Sistemas Operacionais Modernos. 4. ed. São Paulo: Pearson, 2016."]],
["IA","digital acessivel",["Versão digital no acervo online","Alternativa em áudio disponível"],["RUSSELL, S.; NORVIG, P. Inteligência Artificial. 3. ed. Rio de Janeiro: Elsevier, 2013."],[]],
["REDES","digital",["Versão digital no acervo online"],["KUROSE, J. F.; ROSS, K. W. Redes de Computadores e a Internet. 6. ed. São Paulo: Pearson, 2013."],["TANENBAUM, A. S. Redes de Computadores. 5. ed. São Paulo: Pearson, 2011."]],
["MD","fisico",["4 exemplares físicos disponíveis"],["ROSEN, K. H. Matemática Discreta e suas Aplicações. 6. ed. Porto Alegre: AMGH, 2009."],[]],
["AL","fisico",["3 exemplares físicos disponíveis"],["LAY, D. C. Álgebra Linear e suas Aplicações. 4. ed. Rio de Janeiro: LTC, 2013."],[]],
["IHC","digital acessivel",["Versão digital no acervo online","Alternativa em áudio disponível"],["BARBOSA, S. D. J.; SILVA, B. S. da. Interação Humano-Computador. Rio de Janeiro: Elsevier, 2010."],["PREECE, J.; ROGERS, Y.; SHARP, H. Design de Interação: além da interação humano-computador. 3. ed. Porto Alegre: Bookman, 2013."]]
];
var bf="todos",bq="";
function sform(id,lbl,ph,val,btn){return'<form class="sf" id="'+id+'" role="search"><label class="sr" for="'+id+'i">'+lbl+'</label><input type="search" id="'+id+'i" placeholder="'+ph+'" value="'+esc(val)+'" autocomplete="off">'+(btn?'<button class="btn" type="submit">Buscar</button>':"")+'</form>'}
function lstB(){var n=norm(bq),r=B.filter(function(b){var c=COURSES[b[0]];return(bf==="todos"||b[1].indexOf(bf)>-1)&&(!n||norm(c.code+" "+c.name+" "+b[3].join(" ")+" "+b[4].join(" ")).indexOf(n)>-1)});
 var el=$("#bl");if(!el)return;
 el.innerHTML=r.length?'<ul class="lst" style="margin-top:1rem">'+r.map(function(b){var c=COURSES[b[0]];
  return'<li class="card"><p class="mu" style="margin:0">'+esc(c.code)+'</p><h2>'+esc(c.name)+'</h2><p>'+b[2].map(function(a){return'<span class="tag">'+esc(a)+'</span> '}).join("")+'</p>'+
  (b[3].length?'<h3>Bibliografia básica</h3><ul class="b">'+b[3].map(function(x){return"<li>"+esc(x)+"</li>"}).join("")+'</ul>':"")+
  (b[4].length?'<h3>Bibliografia complementar</h3><ul class="b">'+b[4].map(function(x){return"<li>"+esc(x)+"</li>"}).join("")+'</ul>':"")+
  '<p style="margin-top:.5rem"><a class="btn s sm" href="#grafo:'+b[0]+'">Ver no grafo</a></p></li>'}).join("")+'</ul>':'<p class="mu">Nenhum material encontrado com esses filtros.</p>'}

/* ========== views ========== */
var gv="grafo";
var impOpen=false,impText="",impPreview=null;
var V={
inicio:function(){return'<section class="hero" style="margin:-1.5rem -1.25rem 0;padding:2.5rem 1.25rem"><h1 tabindex="-1">Encontre tudo sobre suas disciplinas em um só lugar</h1><p>Pré-requisitos, bibliografia e disponibilidade na biblioteca da UFABC para as 27 disciplinas obrigatórias do BCC, sem abrir o sistema acadêmico, o PPC em PDF e o catálogo separadamente.</p>'+sform("sh","Buscar disciplina por nome ou código","Ex.: Estruturas de Dados ou MCCC001-23","",1)+'<p>Você pode consultar a grade, o grafo e o acervo sem login.</p></section>'+
'<section class="sec"><h2>O que você quer fazer agora?</h2><div class="g3"><div class="card"><h3>Ver grafo de pré-requisitos</h3><p class="mu">Veja o que já pode cursar e o que cada disciplina desbloqueia, com versão em lista.</p><a class="btn s" href="#grafo">Abrir grafo</a></div><div class="card"><h3>Montar minha grade do zero</h3><p class="mu">Digite as disciplinas que já cursou (guardado só no seu aparelho) e veja recomendações.</p><a class="btn s" href="#grade">Abrir minha grade</a></div><div class="card"><h3>Buscar na biblioteca</h3><p class="mu">Bibliografia básica e complementar e onde encontrar o material.</p><a class="btn s" href="#biblioteca">Abrir biblioteca</a></div></div></section>'+
'<section class="sec"><h2>Como funciona</h2><ol><li>Informe o que já cursou, digitando o nome ou código — o campo sugere as disciplinas do BCC enquanto você digita. Os dados ficam só no seu aparelho.</li><li>Veja o que está liberado: forma, símbolo e texto mostram o status de cada uma das 27 disciplinas.</li><li>Encontre a bibliografia: física, digital ou em formato acessível.</li></ol></section>'+
'<section class="sec bar"><h2>Seus dados ficam só com você</h2><p>O histórico fica apenas neste aparelho. Toda recomendação mostra o motivo, e você apaga tudo a qualquer momento em Minha Grade.</p><a class="btn s" href="#grade">Ver minhas preferências</a></section>'+
'<section class="sec card"><h2>Encontrou uma informação errada?</h2><p class="mu">Envie uma sugestão de correção sobre ementa, pré-requisito ou bibliografia.</p><a class="btn" href="mailto:equipe-srmd@aluno.ufabc.edu.br?subject=Sugest%C3%A3o%20de%20corre%C3%A7%C3%A3o%20SRMD">Sugerir correção</a></section>'},
grafo:function(){var hist=get("srmd-hist",[]);
 var hp=(location.hash||"").slice(1).split(":");
 var f=(hp[0]==="grafo"&&hp[1]&&COURSES[hp[1]])?hp[1]:(recommend(hist)[0]||"PE");
 var c=COURSES[f],l=gv==="lista";
 var fcItems=COMBO.fc.q?matchCourses(COMBO.fc.q):[];COMBO.fc.items=fcItems;if(COMBO.fc.active<0&&fcItems.length)COMBO.fc.active=0;
 return'<h1 tabindex="-1">Grafo de Recomendações</h1><p class="mu">'+esc(c.code)+" · "+esc(c.name)+" · "+c.cred+" créditos ("+c.hr+") · obrigatória no BCC</p>"+
 '<div class="combo-wrap"><div class="row"><label for="fci" class="sr">Escolher disciplina para ver pré-requisitos</label><input type="text" id="fci" class="sf" role="combobox" aria-expanded="'+(fcItems.length>0)+'" aria-controls="fclb" aria-autocomplete="list" aria-activedescendant="'+(fcItems.length?"fcopt"+COMBO.fc.active:"")+'" autocomplete="off" placeholder="Buscar outra disciplina (nome ou código)" value="'+esc(COMBO.fc.q)+'"></div>'+
 '<ul role="listbox" id="fclb" class="combo-lb" aria-label="Sugestões de disciplinas">'+fcItems.map(function(id,i){return optHtml("fc",id,i,COMBO.fc.active)}).join("")+'</ul></div>'+
 '<div class="bar" style="margin:1rem 0"><h2>Resumo em texto</h2><p data-readaloud>'+resumoTxt(f,hist)+'</p></div>'+
 '<div class="row"><button class="btn s" data-a="vw" data-c="grafo" aria-pressed="'+!l+'">Ver grafo</button><button class="btn s" data-a="vw" data-c="lista" aria-pressed="'+l+'">Ver lista completa (27 disciplinas)</button></div>'+
 '<p class="mu">Legenda: ★ cursada · ● liberada para matrícula · ▣ bloqueada. O status vem sempre em forma, símbolo e texto.</p>'+
 (l?grafoLista(hist):grafoCols(f,hist))+
 grafoDetail(f,hist)+
 '<p style="margin-top:1rem"><a class="btn s" href="#biblioteca">Ver ementa e materiais didáticos</a></p>'},
grade:function(){var hist=get("srmd-hist",[]),cur=get("srmd-cur",[]),rc=get("srmd-reco",{});
 var acItems=COMBO.ac.q?matchCourses(COMBO.ac.q):[];COMBO.ac.items=acItems;if(COMBO.ac.active<0&&acItems.length)COMBO.ac.active=0;
 var recs=recommend(hist);
 return'<h1 tabindex="-1">Minha Grade</h1><p class="mu">Informe o que você já cursou para receber recomendações com o motivo de cada uma. As 27 disciplinas obrigatórias do BCC já estão cadastradas — comece do zero digitando o nome ou código.</p>'+
 '<section class="card sec" aria-labelledby="gc"><h2 id="gc">Minha grade do quadrimestre atual</h2>'+(cur.length?'<ul class="lst">'+cur.map(function(c){var cc=COURSES[c];return'<li class="card"><span class="tag">Cursando neste quadrimestre</span><h3>'+esc(cc.name)+'</h3><p class="mu">'+esc(cc.code)+'</p><div class="row"><a class="btn s sm" href="#grafo:'+c+'">Ver no grafo</a><button class="btn s sm" data-a="rm" data-c="'+c+'">Remover '+esc(cc.name)+' da grade</button></div></li>'}).join("")+'</ul>':'<p class="mu">Você ainda não aceitou nenhuma disciplina. Use "Aceitar na minha grade" nas recomendações.</p>')+'</section>'+
 '<div class="two"><section class="card" aria-labelledby="hc"><h2 id="hc">Disciplinas já cursadas</h2><p class="mu">Guardadas apenas neste aparelho.</p>'+
 '<form id="af" novalidate><label for="aci"><strong>Nome ou código da disciplina</strong></label>'+
 '<div class="combo-wrap"><div class="row"><input type="text" id="aci" class="sf" style="flex:1 1 200px" role="combobox" aria-expanded="'+(acItems.length>0)+'" aria-controls="aclb" aria-autocomplete="list" aria-activedescendant="'+(acItems.length?"acopt"+COMBO.ac.active:"")+'" autocomplete="off" placeholder="Ex.: Programação Estruturada ou MCTA028-15" aria-describedby="er" value="'+esc(COMBO.ac.q)+'"><button class="btn" type="submit">Adicionar</button></div>'+
 '<ul role="listbox" id="aclb" class="combo-lb" aria-label="Sugestões de disciplinas">'+acItems.map(function(id,i){return optHtml("ac",id,i,COMBO.ac.active)}).join("")+'</ul></div>'+
 '<p class="err" id="er"></p></form>'+
 '<ul class="chips" aria-label="Disciplinas cursadas">'+(hist.length?hist.map(function(id,i){var c=COURSES[id];return'<li>'+esc(c.code)+" — "+esc(c.name)+'<button class="x" data-a="rmh" data-c="'+i+'" aria-label="Remover '+esc(c.name)+' da lista de cursadas">✕</button></li>'}).join(""):'<li style="background:none;border:none">Nenhuma disciplina adicionada ainda.</li>')+'</ul>'+
 '<div class="row"><button class="btn s" aria-expanded="'+impOpen+'" aria-controls="impwrap" data-a="imp">'+(impOpen?"Fechar importação":"Importar histórico")+'</button><button class="btn s" data-a="clr">Apagar todos os meus dados</button></div>'+
 '<div id="impwrap">'+(!impOpen?"":!impPreview?
  '<div class="card" style="margin-top:1rem"><h3 id="impt1">Importar histórico</h3>'+
  '<p class="mu">Cole uma disciplina por linha (nome ou código) ou escolha um arquivo .csv/.txt com o seu histórico. A leitura acontece só no seu navegador — nada é enviado a servidor.</p>'+
  '<label for="impfile">Escolher arquivo .csv ou .txt</label><input type="file" id="impfile" accept=".csv,.txt,text/csv,text/plain">'+
  '<label for="impta"><strong>Ou cole aqui, uma disciplina por linha</strong></label>'+
  '<textarea id="impta" class="imp" aria-describedby="impt1" placeholder="Ex.: Programação Estruturada&#10;MCCC001-23&#10;Álgebra Linear">'+esc(impText)+'</textarea>'+
  '<div class="row"><button class="btn" data-a="impan">Analisar</button><button class="btn s" data-a="impcancel">Cancelar</button></div></div>'
  :
  '<div class="card" style="margin-top:1rem"><h3 id="impt2" tabindex="-1">Pré-visualização da importação</h3>'+
  (impPreview.matched.length?'<p class="mu">'+impPreview.matched.length+' disciplina(s) reconhecida(s) — tire alguma da lista se não for o que você quis dizer:</p><ul class="chips" aria-label="Disciplinas reconhecidas para importar">'+impPreview.matched.map(function(id){var c=COURSES[id];return'<li>'+esc(c.code)+" — "+esc(c.name)+'<button class="x" data-a="imprm" data-c="'+id+'" aria-label="Não importar '+esc(c.name)+'">✕</button></li>'}).join("")+'</ul>':'<p class="mu">Nenhuma disciplina reconhecida no texto enviado.</p>')+
  (impPreview.unmatched.length?'<p class="err">Não reconhecemos '+impPreview.unmatched.length+' linha(s): '+impPreview.unmatched.map(esc).join("; ")+'</p>':"")+
  '<div class="row"><button class="btn" data-a="impok">Confirmar importação</button><button class="btn s" data-a="impcancel">Cancelar</button></div></div>')+
 '</div></section>'+
 '<section aria-labelledby="rcc"><h2 id="rcc">Recomendações para o próximo quadrimestre</h2><p class="mu">Todas mostram o motivo e podem ser ignoradas ou desfeitas sem perder acesso ao resto do site.</p>'+
 (recs.length?'<ul class="lst">'+recs.map(function(id){var c=COURSES[id],s=rc[id];
  return'<li class="card"><span class="tag">'+(c.pre.length?"Recomendada":"Disponível desde o início do curso")+'</span> '+(s?'<span class="tag">'+(s==="a"?"Aceita":"Ignorada")+'</span>':"")+
  '<p class="mu" style="margin:.4rem 0 0">'+esc(c.code)+'</p><h3>'+esc(c.name)+'</h3><p class="why"><strong>Motivo:</strong> '+motivo(id)+'</p>'+
  '<div class="row">'+(s?'<button class="btn s sm" id="b-'+id+'" data-a="und" data-c="'+id+'">Desfazer '+(s==="a"?"aceite":"ignorar")+" de "+esc(c.name)+'</button>':'<button class="btn sm" id="b-'+id+'" data-a="acc" data-c="'+id+'">Aceitar '+esc(c.name)+' na minha grade</button><button class="btn s sm" data-a="ign" data-c="'+id+'">Ignorar '+esc(c.name)+'</button>')+
  '<a class="btn s sm" href="#grafo:'+id+'">Ver no grafo</a></div></li>'}).join("")+'</ul>':'<p class="mu">Nenhuma recomendação ainda. Adicione disciplinas já cursadas para liberar as próximas.</p>')+
 '</section></div>'},
biblioteca:function(){return'<h1 tabindex="-1">Biblioteca Integrada</h1><p class="mu">Bibliografia básica e complementar e a disponibilidade do material: físico, digital ou em formato acessível. Cadastrada até agora para '+B.length+' das 27 disciplinas obrigatórias; as demais ainda não têm registro neste protótipo.</p>'+sform("sb","Buscar por disciplina, autor ou código","Ex.: MCCC001-23 ou Cormen",bq)+
'<div class="row" role="group" aria-label="Filtrar por formato disponível">'+[["todos","Todos os formatos"],["fisico","Físico"],["digital","Digital"],["acessivel","Alternativa acessível"]].map(function(f){return'<button class="btn s sm" data-a="flt" data-c="'+f[0]+'" aria-pressed="'+(bf===f[0])+'">'+f[1]+'</button>'}).join("")+'</div><div id="bl" aria-live="polite"></div>'+
'<section class="card sec"><h2>Não encontrou um material?</h2><a class="btn" href="mailto:equipe-srmd@aluno.ufabc.edu.br?subject=Sugest%C3%A3o%20de%20corre%C3%A7%C3%A3o%20SRMD">Sugerir correção</a></section>'}};
var first=1;
function route(focusId){var raw=(location.hash||"#inicio").slice(1);var k=raw.split(":")[0];if(!V[k])k="inicio";$("#v").innerHTML=V[k]();
 document.querySelectorAll("#nav a").forEach(function(a){if(a.getAttribute("href").slice(1)===k)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
 var h=$("#v h1");document.title=(h?h.textContent:"Início")+" — SRMD";
 if(k==="biblioteca")lstB();
 if(focusId&&$(focusId))$(focusId).focus();else if(!first&&h)h.focus();first=0;
 $("#nav").classList.remove("open");$("#nbtn").setAttribute("aria-expanded","false");window.scrollTo(0,0)}
window.addEventListener("hashchange",function(){route()});
document.addEventListener("submit",function(e){e.preventDefault();var f=e.target.id;
 if(f==="sh"){var v=($("#shi")?$("#shi").value:"").trim();var m=matchCourses(v);
  if(m.length===1){COMBO.fc.q="";location.hash="grafo:"+m[0]}else{COMBO.fc.q=v;location.hash="grafo"}}
 else if(f==="sb"){/* a busca já é ao vivo, via evento input */}
 else if(f==="af"){var typed=$("#aci").value.trim();var id=acPick;
  if(!id&&typed){var exact=Object.keys(COURSES).filter(function(x){return norm(COURSES[x].code)===norm(typed)||norm(COURSES[x].name)===norm(typed)});if(exact.length===1)id=exact[0]}
  if(!id){$("#er").textContent="Não encontramos essa disciplina entre as obrigatórias do BCC. Digite o nome ou código e escolha uma opção da lista.";$("#aci").setAttribute("aria-invalid","true");$("#aci").focus();return}
  var h=get("srmd-hist",[]);
  if(h.indexOf(id)>-1){say(COURSES[id].name+" já está marcada como cursada.")}
  else{h.push(id);set("srmd-hist",h);var cu=get("srmd-cur",[]).filter(function(x){return x!==id});set("srmd-cur",cu);var rc=get("srmd-reco",{});delete rc[id];set("srmd-reco",rc);say(COURSES[id].name+" adicionada às cursadas.")}
  acPick=null;COMBO.ac.q="";COMBO.ac.items=[];COMBO.ac.active=-1;
  route("#aci")}});
document.addEventListener("input",function(e){
 if(e.target.id==="sbi"){bq=e.target.value;lstB()}
 else if(e.target.id==="aci"){COMBO.ac.q=e.target.value;acPick=null;searchCombo("ac");var er=$("#er");if(er)er.textContent="";e.target.removeAttribute("aria-invalid")}
 else if(e.target.id==="impta"){impText=e.target.value}
 else if(e.target.id==="fci"){COMBO.fc.q=e.target.value;searchCombo("fc")}});
document.addEventListener("click",function(e){
 var pk=e.target.closest("[data-pick]");
 if(pk){pickCombo(pk.dataset.combo,pk.dataset.pick);return}
 var t=e.target.closest("[data-a]");if(!t)return;var a=t.dataset.a,c=t.dataset.c,rc=get("srmd-reco",{}),cu=get("srmd-cur",[]);
 if(a==="acc"){rc[c]="a";if(cu.indexOf(c)<0)cu.push(c);set("srmd-reco",rc);set("srmd-cur",cu);route("#b-"+c);say(COURSES[c].name+" aceita na sua grade.")}
 else if(a==="ign"){rc[c]="i";set("srmd-reco",rc);route("#b-"+c);say("Recomendação ignorada.")}
 else if(a==="und"){delete rc[c];set("srmd-reco",rc);set("srmd-cur",cu.filter(function(x){return x!==c}));route("#b-"+c);say("Ação desfeita.")}
 else if(a==="rm"){delete rc[c];set("srmd-reco",rc);set("srmd-cur",cu.filter(function(x){return x!==c}));route();say("Disciplina removida da grade.")}
 else if(a==="rmh"){var h=get("srmd-hist",[]);h.splice(+c,1);set("srmd-hist",h);route("#aci");say("Disciplina removida das cursadas.")}
 else if(a==="clr"){if(confirm("Apagar histórico, grade e recomendações guardados neste aparelho?")){set("srmd-hist",[]);set("srmd-cur",[]);set("srmd-reco",{});route();say("Todos os seus dados foram apagados deste aparelho.")}}
 else if(a==="imp"){impOpen=!impOpen;impPreview=null;impText="";route(impOpen?"#impta":null)}
 else if(a==="impan"){var txt=$("#impta")?$("#impta").value:impText;impText=txt;impPreview=parseImport(txt);route("#impt2")}
 else if(a==="imprm"){if(impPreview){impPreview.matched=impPreview.matched.filter(function(x){return x!==c});route()}}
 else if(a==="impok"){
  if(impPreview&&impPreview.matched.length){
   var h2=get("srmd-hist",[]),added=0;
   impPreview.matched.forEach(function(id){if(h2.indexOf(id)<0){h2.push(id);added++}});
   set("srmd-hist",h2);
   var cu2=get("srmd-cur",[]).filter(function(x){return impPreview.matched.indexOf(x)<0});set("srmd-cur",cu2);
   var rc2=get("srmd-reco",{});impPreview.matched.forEach(function(id){delete rc2[id]});set("srmd-reco",rc2);
   say(added+" disciplina(s) importada(s) e marcada(s) como cursada(s)."+(impPreview.unmatched.length?" "+impPreview.unmatched.length+" linha(s) não reconhecida(s) foram ignoradas.":""))
  } else say("Nenhuma disciplina reconhecida para importar.");
  impOpen=false;impPreview=null;impText="";route("#aci")}
 else if(a==="impcancel"){impOpen=false;impPreview=null;impText="";route()}
 else if(a==="vw"){gv=c;route();var b=document.querySelector('[data-c="'+c+'"]');if(b)b.focus()}
 else if(a==="flt"){bf=c;route();var f=document.querySelector('[data-c="'+c+'"]');if(f)f.focus()}
 else if(a==="read"){speak(($("#v").innerText||"").trim())}
 else if(a==="pause"){if(SS){if(SS.paused){SS.resume();$("#pz").textContent="Pausar leitura"}else{SS.pause();$("#pz").textContent="Continuar leitura"}}}
 else if(a==="stop"){if(SS)SS.cancel();$("#pz").textContent="Pausar leitura"}
 else if(a==="reset"){P=Object.assign({},DEF);apply();save();say("Preferências restauradas.")}});
document.addEventListener("keydown",function(e){
 var key=e.target.id==="aci"?"ac":e.target.id==="fci"?"fc":null;
 if(key){
  if(e.key==="ArrowDown"){e.preventDefault();moveCombo(key,1);return}
  if(e.key==="ArrowUp"){e.preventDefault();moveCombo(key,-1);return}
  if(e.key==="Enter"&&COMBO[key].active>-1){e.preventDefault();pickCombo(key,COMBO[key].items[COMBO[key].active]);return}
  if(e.key==="Escape"){COMBO[key].items=[];COMBO[key].active=-1;paintCombo(key);return}
 }
 if(e.key!=="Escape")return;
 var n=$("#nav");if(n.classList.contains("open")){n.classList.remove("open");$("#nbtn").setAttribute("aria-expanded","false");$("#nbtn").focus()}
 else if(!$("#panel").hidden){$("#panel").hidden=true;$("#pbtn").setAttribute("aria-expanded","false");$("#pbtn").focus()}});
$("#pbtn").addEventListener("click",function(){var p=$("#panel"),o=p.hidden;p.hidden=!o;this.setAttribute("aria-expanded",o)});
$("#nbtn").addEventListener("click",function(){var n=$("#nav"),o=n.classList.toggle("open");this.setAttribute("aria-expanded",o)});
apply();route();
})();

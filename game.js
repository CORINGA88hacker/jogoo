// Protótipo de jogo 2D com múltipla escolha e progressão de cenários
let playerName = '';
let currentScenario = 1;
let totalScenarios = 36;
let characters = {};
let scenariosMap = {};
let playerState = {score:0};

async function loadJSON(path){
  const res = await fetch(path);
  return res.json();
}

function startGame(){
  playerName = document.getElementById('playerName').value.trim() || 'Player';
  document.getElementById('overlay-start').style.display='none';
  document.getElementById('bgMusic').play().catch(()=>{});
  renderScenario();
}

function renderScenario(){
  document.getElementById('currentNum').textContent = currentScenario;
  const sceneImg = document.getElementById('sceneImg');
  const sceneKey = `cenario_${String(currentScenario).padStart(2,'0')}`;
  sceneImg.src = `cenarios/${sceneKey}.png`;
  // clear characters
  const layer = document.getElementById('charactersLayer');
  layer.innerHTML = '';
  const chars = scenariosMap[sceneKey] || [];
  // place 2-3 characters evenly
  const gap = 100;
  const baseLeft = 50;
  chars.forEach((cid, idx) => {
    const el = document.createElement('img');
    el.className='char';
    el.style.left = (baseLeft + idx*220) + 'px';
    el.src = characters[cid].image;
    el.dataset.cid = cid;
    el.title = characters[cid].name;
    el.addEventListener('click', ()=> openDialogFor(cid));
    layer.appendChild(el);
  });
  // clear dialog
  document.getElementById('dialogText').textContent = 'Clique em um personagem para conversar.';
  document.getElementById('choices').innerHTML = '';
}

function openDialogFor(cid){
  const char = characters[cid];
  if(!char) return;
  // take first line available
  const line = char.lines[0];
  showLine(char, line);
}

function showLine(char, line){
  document.getElementById('dialogText').textContent = `${char.name}: ${line.text}`;
  const choicesDiv = document.getElementById('choices');
  choicesDiv.innerHTML = '';
  line.choices.forEach((ch, idx) => {
    const b = document.createElement('button');
    b.className='choiceBtn';
    b.textContent = ch.text;
    b.addEventListener('click', ()=>{
      // apply effects
      if(ch.effect && ch.effect.score) playerState.score += ch.effect.score;
      // feedback
      document.getElementById('dialogText').textContent = `${playerName}: ${ch.text} (pontuação: ${playerState.score})`;
      choicesDiv.innerHTML = '';
      // allow progression: mark line as answered by removing it or advancing
      // remove answered line from character
      char.lines.shift();
      // if character has more lines, keep them for next interaction; else show "seguir" to proceed
      if(char.lines.length === 0){
        const cont = document.createElement('button');
        cont.textContent = 'Prosseguir';
        cont.className='choiceBtn';
        cont.addEventListener('click', ()=>{
          // when all characters in current scenario have no lines, allow next scenario
          maybeAdvanceScenario();
        });
        choicesDiv.appendChild(cont);
      } else {
        const cont = document.createElement('button');
        cont.textContent = 'Continuar conversa';
        cont.className='choiceBtn';
        cont.addEventListener('click', ()=> showLine(char, char.lines[0]));
        choicesDiv.appendChild(cont);
      }
    });
    choicesDiv.appendChild(b);
  });
}

function maybeAdvanceScenario(){
  // check if all characters in this scenario have empty lines
  const sceneKey = `cenario_${String(currentScenario).padStart(2,'0')}`;
  const chars = scenariosMap[sceneKey] || [];
  const allDone = chars.every(cid => (characters[cid].lines.length === 0));
  if(allDone){
    alert('Você completou este cenário! Avançando para o próximo.');
    currentScenario++;
    if(currentScenario > totalScenarios){
      alert('Parabéns! Você terminou todos os cenários. Pontuação final: ' + playerState.score);
      currentScenario = 1;
      // reset state (for demo)
      location.reload();
      return;
    }
    renderScenario();
  } else {
    alert('Ainda faltam personagens para conversar neste cenário.');
  }
}

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('nextScenario').addEventListener('click', ()=>{
  currentScenario++;
  if(currentScenario > totalScenarios) currentScenario = 1;
  renderScenario();
});

// load JSON data
Promise.all([loadJSON('personagens.json'), loadJSON('cenarios_map.json')]).then(([p,c])=>{
  characters = p;
  scenariosMap = c;
  // map image paths (they are relative)
  for(const k in characters){
    // already contains relative path "personagem/..."
  }
}).catch(e=>{console.error(e); alert('Erro ao carregar dados. Verifique arquivos JSON.')});

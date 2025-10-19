/* Gen-Z Chinese Flashcards — client-only app
   Features:
   - Two-sided flashcards (Hanzi + Pinyin front, Vietnamese + mnemonic back)
   - Smooth flip, responsive layout
   - Web Speech API TTS zh-CN for words & sentences
   - Simple client-side "AI" dialogue generator using templates (no server)
   - Practice: type pinyin and translation; checks and gives reward
   - Add/save words to localStorage; export/import JSON
   - Reward overlay with animated GIF or emoji
*/

/* ---------- Utilities ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function id() { return Math.random().toString(36).slice(2,9); }
function saveData(key,obj){ localStorage.setItem(key, JSON.stringify(obj)); }
function loadData(key, fallback){ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
function normalizePinyin(s){ return s.trim().toLowerCase().replace(/\s+/g,' '); } // basic

/* ---------- Initial sample deck ---------- */
const SAMPLE = [
  { id:id(), hanzi:'你好', pinyin:'nǐ hǎo', vn:'Xin chào', mnemonic:'nǐ (you) + hǎo (good) => Hello', reward:'https://media.giphy.com/media/3o6ZsYJrjv8VqR9nCk/giphy.gif' },
  { id:id(), hanzi:'谢谢', pinyin:'xièxie', vn:'Cảm ơn', mnemonic:'xiè (thanks) x2', reward:'https://media.giphy.com/media/l0MYKQ2bC3b4s4q3W/giphy.gif' },
  { id:id(), hanzi:'学习', pinyin:'xuéxí', vn:'Học', mnemonic:'xué (learn) + xí (practice)', reward:'' }
];

const STORAGE_KEY = 'gz_chinese_deck_v1';
let deck = loadData(STORAGE_KEY, SAMPLE);
saveData(STORAGE_KEY, deck); // ensure saved if not present

/* ---------- DOM refs ---------- */
const cardContainer = $('#cardContainer');
const newCardBtn = $('#newCardBtn');
const modal = $('#modal');
const cancelModal = $('#cancelModal');
const saveCardBtn = $('#saveCard');
const inputHanzi = $('#inputHanzi');
const inputPinyin = $('#inputPinyin');
const inputVN = $('#inputVN');
const inputMnemonic = $('#inputMnemonic');
const inputReward = $('#inputReward');

const startPractice = $('#startPractice');
const practicePrompt = $('#practicePrompt');
const practiceUI = $('#practiceUI');
const pinyinInput = $('#pinyinInput');
const checkPinyin = $('#checkPinyin');
const vnInput = $('#vnInput');
const checkVn = $('#checkVn');

const genDialogueBtn = $('#genDialogue');
const dialogueArea = $('#dialogueArea');

const rewardOverlay = $('#rewardOverlay');
const rewardMedia = $('#rewardMedia');
const rewardEmoji = $('#rewardEmoji');
const closeReward = $('#closeReward');
const rewardShelf = $('#rewardShelf');

let selectedCardId = null;
let practiceState = null;

/* ---------- Render Functions ---------- */
function renderDeck(){
  cardContainer.innerHTML = '';
  deck.forEach(c => {
    const el = document.createElement('div');
    el.className = 'flashcard';
    el.dataset.id = c.id;
    el.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front">
          <div class="card-toolbar">
            <button class="icon-btn speakBtn" title="Speak">🔊</button>
            <button class="icon-btn editBtn" title="Edit">✏️</button>
            <button class="icon-btn deleteBtn" title="Delete">🗑️</button>
          </div>
          <div style="text-align:center">
            <div class="hanzi">${c.hanzi}</div>
            <div class="pinyin">${c.pinyin}</div>
          </div>
        </div>
        <div class="card-face card-back">
          <div class="meaning">${c.vn}</div>
          <div class="mnemonic">${c.mnemonic || ''}</div>
          <div style="margin-top:12px; width:100%; display:flex; justify-content:space-between; align-items:center;">
            <small class="muted">ID: ${c.id.slice(0,6)}</small>
            <div>
              <button class="btn tiny speakSentence">Speak</button>
              <button class="btn tiny rewardBtn">Reward</button>
            </div>
          </div>
        </div>
      </div>
    `;
    // click to toggle flip
    el.addEventListener('click', e => {
      // avoid clicks on toolbar
      if (e.target.closest('.card-toolbar') || e.target.closest('.icon-btn') || e.target.closest('.btn')) return;
      el.classList.toggle('flipped');
      if(!selectedCardId){
        selectedCardId = c.id;
      }else{
        selectedCardId = c.id;
      }
    });

    // toolbar events
    el.querySelector('.speakBtn').addEventListener('click', (ev)=>{
      ev.stopPropagation();
      speakText(c.hanzi, c.pinyin);
    });
    el.querySelector('.editBtn').addEventListener('click', (ev)=>{
      ev.stopPropagation();
      openModal(c);
    });
    el.querySelector('.deleteBtn').addEventListener('click', (ev)=>{
      ev.stopPropagation();
      if(confirm('Delete this card?')){ deck = deck.filter(x=>x.id!==c.id); saveData(STORAGE_KEY, deck); renderDeck(); }
    });

    el.querySelector('.speakSentence').addEventListener('click', (ev)=>{
      ev.stopPropagation();
      const sentence = `${c.hanzi}，${c.vn}`;
      speakText(sentence);
    });

    el.querySelector('.rewardBtn').addEventListener('click', (ev)=>{
      ev.stopPropagation();
      showReward(c);
    });

    cardContainer.appendChild(el);
  });

  renderRewardShelf();
}

/* ---------- Modal / Add/Edit ---------- */
newCardBtn.addEventListener('click', ()=> openModal());
cancelModal.addEventListener('click', ()=> closeModal());
function openModal(card){
  modal.classList.remove('hidden');
  if(card){
    $('#inputHanzi').value = card.hanzi;
    $('#inputPinyin').value = card.pinyin;
    $('#inputVN').value = card.vn;
    $('#inputMnemonic').value = card.mnemonic || '';
    $('#inputReward').value = card.reward || '';
    saveCardBtn.dataset.editId = card.id;
  } else {
    $('#inputHanzi').value = '';
    $('#inputPinyin').value = '';
    $('#inputVN').value = '';
    $('#inputMnemonic').value = '';
    $('#inputReward').value = '';
    delete saveCardBtn.dataset.editId;
  }
}
function closeModal(){
  modal.classList.add('hidden');
}
saveCardBtn.addEventListener('click', ()=>{
  const h = inputHanzi.value.trim();
  const p = inputPinyin.value.trim();
  const vn = inputVN.value.trim();
  if(!h || !p || !vn){ alert('Hanzi, Pinyin and Vietnamese meaning are required.'); return; }
  const mnemonic = inputMnemonic.value.trim();
  const reward = inputReward.value.trim();

  const editId = saveCardBtn.dataset.editId;
  if(editId){
    const idx = deck.findIndex(x=>x.id===editId);
    if(idx>=0){ deck[idx] = { ...deck[idx], hanzi:h, pinyin:p, vn:vn, mnemonic, reward }; }
  } else {
    deck.push({ id:id(), hanzi:h, pinyin:p, vn:vn, mnemonic, reward });
  }
  saveData(STORAGE_KEY, deck);
  closeModal();
  renderDeck();
});

/* ---------- Practice ---------- */
startPractice.addEventListener('click', ()=>{
  if(!selectedCardId){
    practicePrompt.textContent = 'Please select a card to practice by tapping it.';
    return;
  }
  practiceState = deck.find(x => x.id === selectedCardId);
  if(!practiceState){ practicePrompt.textContent = 'Selected card not found.'; return; }
  practicePrompt.classList.add('hidden');
  practiceUI.classList.remove('hidden');
  pinyinInput.value = '';
  vnInput.value = '';
});

checkPinyin.addEventListener('click', ()=>{
  if(!practiceState) return;
  const expected = normalizePinyin(practiceState.pinyin);
  const given = normalizePinyin(pinyinInput.value);
  if(given === expected){
    showQuickToast('Pinyin correct 🎉');
    speakText(practiceState.hanzi + '，' + practiceState.pinyin);
    grantReward(practiceState);
  } else {
    showQuickToast(`Not quite — expected: ${practiceState.pinyin}`, true);
  }
});

checkVn.addEventListener('click', ()=>{
  if(!practiceState) return;
  const expected = practiceState.vn.trim().toLowerCase();
  const given = vnInput.value.trim().toLowerCase();
  // simple contains check (flexible)
  if(expected === given || expected.includes(given) || given.includes(expected)){
    showQuickToast('Translation correct 🎉');
    grantReward(practiceState);
  } else {
    showQuickToast(`Try again — expected: ${practiceState.vn}`, true);
  }
});

/* ---------- Simple Client-side "AI" Dialogue Generator ---------- */
genDialogueBtn.addEventListener('click', ()=>{
  if(!selectedCardId){ dialogueArea.innerHTML = '<em>Select a card first to generate dialogue.</em>'; return; }
  const card = deck.find(x => x.id === selectedCardId);
  if(!card) return;
  const d = generateDialogueFor(card);
  dialogueArea.innerHTML = '';
  d.forEach(line => {
    const row = document.createElement('div');
    row.style.marginBottom = '8px';
    row.innerHTML = `<strong>${line.speaker}:</strong> <span style="font-size:1.05rem">${line.hanzi}</span> <div style="opacity:.9">${line.pinyin} — <em>${line.vn}</em> <button class="btn tiny playLine">🔊</button></div>`;
    const btn = row.querySelector('.playLine');
    btn.addEventListener('click', ()=> speakText(line.hanzi + '。 ' + line.pinyin));
    dialogueArea.appendChild(row);
  });
});

/* Template-based generator:
   Use the target word in short templates. We include Pinyin only for the inserted word (from card).
   This is a pragmatic client-side fallback to "AI".
*/
function generateDialogueFor(card){
  const templates = [
    { s:'A', text: `你会说${card.hanzi}吗？`, vn: `Bạn có biết nói "${card.vn}" không?` },
    { s:'B', text: `会，我经常说${card.hanzi}。`, vn: `Có, mình thường nói "${card.vn}".` },
    { s:'A', text: `那怎么读？`, vn: `Vậy đọc thế nào?` },
    { s:'B', text: `${card.pinyin}，就是这样。`, vn: `Đọc là ${card.pinyin}.` }
  ];
  // Build lines merging pinyin for the inserted pieces (approx.)
  return templates.map(t => {
    // if template includes card.hanzi, attach pinyin next to it
    let pinyin = t.text.includes(card.hanzi) ? card.pinyin : '';
    return { speaker: t.s, hanzi: t.text, pinyin, vn: t.vn };
  });
}

/* ---------- Rewards ---------- */
function renderRewardShelf(){
  rewardShelf.innerHTML = '';
  deck.forEach(c => {
    if(c.reward){
      const thumb = document.createElement('div');
      thumb.className = 'reward-thumb';
      const img = document.createElement('img');
      img.src = c.reward;
      img.alt = 'reward';
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100%';
      thumb.appendChild(img);
      thumb.addEventListener('click', ()=> showReward(c));
      rewardShelf.appendChild(thumb);
    }
  });
}

function showReward(card){
  rewardOverlay.classList.remove('hidden');
  rewardEmoji.textContent = '🎉';
  rewardMedia.innerHTML = '';
  if(card.reward){
    const media = document.createElement('img');
    media.src = card.reward;
    media.style.maxWidth = '100%';
    media.style.borderRadius = '10px';
    rewardMedia.appendChild(media);
  } else {
    rewardMedia.innerHTML = `<div style="font-size:2.2rem">✨ Great job!</div>`;
  }
}
closeReward.addEventListener('click', ()=> rewardOverlay.classList.add('hidden'));
rewardOverlay.addEventListener('click', (e)=> { if(e.target === rewardOverlay) rewardOverlay.classList.add('hidden'); });

function grantReward(card){
  // small animation + overlay
  showReward(card);
  // also auto-add to shelf if not already
  renderRewardShelf();
}

/* ---------- Speech (Web Speech API) ---------- */
function speakText(text, lang='zh-CN'){
  if(!('speechSynthesis' in window)){
    alert('TTS not supported in this browser.');
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  // prefer Chinese voice if available
  const voices = speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang.startsWith('zh')) || voices.find(v => v.lang === 'zh-CN');
  if(zhVoice) utter.voice = zhVoice;
  utter.rate = 0.95;
  speechSynthesis.cancel(); // stop previous
  speechSynthesis.speak(utter);
}

/* ---------- Quick Toast ---------- */
let toastTimer = null;
function showQuickToast(msg, isError=false){
  let el = document.createElement('div');
  el.textContent = msg;
  el.style.position = 'fixed';
  el.style.bottom = '18px';
  el.style.left = '50%';
  el.style.transform = 'translateX(-50%)';
  el.style.background = isError ? '#ff6b6b' : 'linear-gradient(90deg,#7be0f0,#ff6fb5)';
  el.style.color = isError ? '#fff' : '#08141a';
  el.style.padding = '10px 16px';
  el.style.borderRadius = '12px';
  el.style.zIndex = '9999';
  document.body.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> { el.remove(); }, 2200);
}

/* ---------- Export / Import ---------- */
$('#exportBtn').addEventListener('click', ()=>{
  const dataStr = JSON.stringify(deck, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gz_chinese_deck.json';
  a.click();
  URL.revokeObjectURL(url);
});

$('#importBtn').addEventListener('click', ()=>{
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = e => {
    const file = e.target.files[0];
    if(!file) return;
    const rdr = new FileReader();
    rdr.onload = ev => {
      try{
        const arr = JSON.parse(ev.target.result);
        if(Array.isArray(arr)) { deck = arr; saveData(STORAGE_KEY, deck); renderDeck(); showQuickToast('Imported deck'); }
        else alert('Invalid file format');
      }catch(err){ alert('Invalid JSON'); }
    };
    rdr.readAsText(file);
  };
  input.click();
});

/* ---------- Keyboard shortcuts ---------- */
document.addEventListener('keydown', (e)=>{
  if(e.key === ' '){ // space flip selected card
    const el = selectedCardId ? document.querySelector(`.flashcard[data-id="${selectedCardId}"]`) : document.querySelector('.flashcard');
    if(el) el.classList.toggle('flipped');
  }
});

/* ---------- Init ---------- */
renderDeck();

/* ---------- Notes for enhancement ----------
 - For "real" AI generation (richer dialogues + pinyin conversion for whole sentences),
   integrate a server-side LLM and pinyin library or call an external TTS for high quality voice.
 - This client version intentionally keeps everything local so it runs on GitHub Pages without secrets.
*/

// Danh sách từ vựng
const flashcards = [
  { word: "你好", pinyin: "nǐ hǎo", meaning: "Xin chào" },
  { word: "谢谢", pinyin: "xiè xie", meaning: "Cảm ơn" },
  { word: "再见", pinyin: "zài jiàn", meaning: "Tạm biệt" },
  { word: "中国", pinyin: "zhōng guó", meaning: "Trung Quốc" },
  { word: "老师", pinyin: "lǎo shī", meaning: "Giáo viên" }
];

let currentIndex = 0;
const flashcard = document.getElementById("flashcard");
const chineseWord = document.getElementById("chinese-word");
const pinyin = document.getElementById("pinyin");
const flipButton = document.getElementById("flip-button");
const nextButton = document.getElementById("next-button");
const speakButton = document.getElementById("speak-button");
const meaningInput = document.getElementById("meaning-input");
const pinyinInput = document.getElementById("pinyin-input");
const checkAnswerButton = document.getElementById("check-answer");
const result = document.getElementById("result");

function updateFlashcard() {
  const card = flashcards[currentIndex];
  chineseWord.textContent = card.word;
  pinyin.textContent = card.pinyin;
  flashcard.classList.remove("flipped");
}

flipButton.addEventListener("click", () => {
  flashcard.classList.toggle("flipped");
});

nextButton.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % flashcards.length;
  updateFlashcard();
});

speakButton.addEventListener("click", () => {
  const utterance = new SpeechSynthesisUtterance(flashcards[currentIndex].word);
  utterance.lang = "zh-CN";
  speechSynthesis.speak(utterance);
});

checkAnswerButton.addEventListener("click", () => {
  const meaning = meaningInput.value.trim().toLowerCase();
  const pinyinAns = pinyinInput.value.trim().toLowerCase();
  const current = flashcards[currentIndex];

  if (meaning && pinyinAns) {
    const correctMeaning = current.meaning.toLowerCase();
    const correctPinyin = current.pinyin.replace(/\s+/g, "").toLowerCase();

    const isMeaningCorrect = correctMeaning.includes(meaning);
    const isPinyinCorrect = correctPinyin === pinyinAns.replace(/\s+/g, "");

    if (isMeaningCorrect && isPinyinCorrect) {
      result.textContent = "✅ Chính xác!";
      result.style.color = "green";
    } else {
      result.textContent = `❌ Sai rồi! Nghĩa: ${current.meaning}, Pinyin: ${current.pinyin}`;
      result.style.color = "red";
    }
  }
});

// Khởi tạo
updateFlashcard();

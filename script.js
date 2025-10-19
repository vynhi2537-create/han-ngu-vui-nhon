// 📘 Dữ liệu mẫu ban đầu
let currentCardIndex = 0;
let cardData = JSON.parse(localStorage.getItem("flashcards")) || [
    { hanzi: "我", pinyin: "Wǒ", meaning: "Tôi", note: "Chỉ bản thân" },
    { hanzi: "你", pinyin: "Nǐ", meaning: "Bạn", note: "Người đối diện" },
    { hanzi: "他", pinyin: "Tā", meaning: "Anh ấy", note: "Người nam" },
];

// 🪄 Khởi tạo khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    renderCard();
    lucide.createIcons();
});

// 🃏 Lật thẻ
function flipCard() {
    document.getElementById("flashcard").classList.toggle("flipped");
}

// ⏭ Hiển thị thẻ tiếp theo
function showNextCard() {
    currentCardIndex = (currentCardIndex + 1) % cardData.length;
    renderCard();
    showReward("🎉");
}

// ⏮ Hiển thị thẻ trước đó
function showPrevCard() {
    currentCardIndex = (currentCardIndex - 1 + cardData.length) % cardData.length;
    renderCard();
}

// 🔊 Phát âm
function speakCurrentWord() {
    const word = cardData[currentCardIndex].hanzi;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "zh-CN";
    speechSynthesis.speak(utterance);
}

// 🧠 Thêm từ mới
function addNewWord() {
    const hanzi = document.getElementById("newHanzi").value.trim();
    const pinyin = document.getElementById("newPinyin").value.trim();
    const meaning = document.getElementById("newMeaning").value.trim();
    const note = document.getElementById("newNote").value.trim();

    if (!hanzi || !pinyin || !meaning) return alert("Vui lòng điền đủ thông tin!");

    cardData.push({ hanzi, pinyin, meaning, note });
    localStorage.setItem("flashcards", JSON.stringify(cardData));
    renderCard();
    clearInputs();
    showReward("💖");
}

// 🧹 Xóa nội dung form
function clearInputs() {
    document.getElementById("newHanzi").value = "";
    document.getElementById("newPinyin").value = "";
    document.getElementById("newMeaning").value = "";
    document.getElementById("newNote").value = "";
}

// 🖼 Hiển thị thẻ hiện tại
function renderCard() {
    const card = cardData[currentCardIndex];
    document.getElementById("hanzi").innerText = card.hanzi;
    document.getElementById("pinyin").innerText = card.pinyin;
    document.getElementById("meaning").innerText = card.meaning;
    document.getElementById("note").innerText = card.note || "";
}

// 🎁 Hiệu ứng phần thưởng
function showReward(icon) {
    const reward = document.getElementById("reward");
    reward.innerText = icon;
    reward.classList.remove("hidden");
    setTimeout(() => reward.classList.add("hidden"), 1200);
}

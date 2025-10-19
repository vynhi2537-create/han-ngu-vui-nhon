<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flashcard Tiếng Trung Gen Z - Học và Chơi!</title>
    <!-- Tải Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Tải thư viện biểu tượng (Lucide Icons) -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        /* Thiết lập font Inter mặc định và màu nền Gen Z */
        body {
            font-family: 'Inter', sans-serif;
            background-color: #fce4ec; /* Hồng pastel nhẹ */
        }
        /* Hiệu ứng lật thẻ 3D */
        .flip-card-container {
            perspective: 1000px;
        }
        .flip-card {
            width: 100%;
            height: 100%;
            transition: transform 0.8s;
            transform-style: preserve-3d;
            box-shadow: 0 20px 25px -5px rgba(255, 105, 180, 0.4), 0 8px 10px -6px rgba(255, 105, 180, 0.2); /* Shadow hồng neon */
        }
        .flip-card.flipped {
            transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 1.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            border: 3px solid #ff69b4; /* Viền hồng neon */
        }
        .flip-card-front {
            background-color: #fff0f5; /* Trắng ngà */
            color: #38a169; /* Xanh ngọc bích */
        }
        .flip-card-back {
            background-color: #ffde59; /* Vàng chanh tươi */
            color: #4a5568;
            transform: rotateY(180deg);
            text-align: center;
        }
        /* Hiệu ứng nút Gen Z */
        .gen-z-btn {
            background-color: #ff69b4; /* Hồng neon */
            color: white;
            transition: all 0.2s ease-in-out;
            box-shadow: 0 4px #d9467f;
            transform: translateY(-2px);
        }
        .gen-z-btn:active {
            box-shadow: 0 2px #d9467f;
            transform: translateY(0);
        }
        /* Style cho phần thưởng */
        #reward-animation {
            z-index: 50;
        }
        /* Ẩn nội dung Pinyin và Nghĩa Việt trong chế độ ôn luyện */
        .test-mode #pinyin, .test-mode #meaning {
            display: none;
        }
        .test-mode .flip-card-back {
            background-color: #e5e5e5; /* Màu nền trung tính khi ẩn nghĩa */
        }
    </style>
    <script>
        // Cấu hình Tailwind cho màu sắc Gen Z
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'neon-pink': '#ff69b4',
                        'neon-teal': '#00f7ff',
                        'genz-yellow': '#ffde59',
                    }
                }
            }
        }
    </script>
</head>
<body class="p-4 sm:p-8 min-h-screen">

    <header class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-neon-pink drop-shadow-lg">✨ Hán Tự Vui Nhộn ✨</h1>
        <p class="text-gray-600 mt-1">Sổ tay flashcard Gen Z cho sinh viên Ngôn ngữ Trung</p>
    </header>

    <main class="max-w-xl mx-auto">
        
        <!-- Chế độ Luyện Tập Nâng Cao -->
        <div class="mb-6 p-4 bg-white rounded-xl shadow-md flex items-center justify-between border-l-4 border-neon-pink">
            <label for="test-mode-toggle" class="text-gray-700 font-semibold flex items-center">
                 <i data-lucide="brain-circuit" class="w-5 h-5 mr-2 text-neon-teal"></i> Chế độ Luyện Thi (Ẩn nghĩa)
            </label>
            <input type="checkbox" id="test-mode-toggle" onchange="toggleTestMode()" class="w-5 h-5 text-neon-pink bg-gray-100 border-gray-300 rounded focus:ring-neon-pink">
        </div>

        <!-- Khu vực Flashcard -->
        <div id="flashcard-section" class="mb-8 h-96 flip-card-container cursor-pointer" onclick="flipCard()">
            <div id="flashcard" class="flip-card">
                <!-- Mặt trước: Hán tự + Pinyin -->
                <div class="flip-card-front shadow-2xl">
                    <div class="absolute top-4 right-4 text-xs font-semibold text-gray-500" id="card-status"></div>
                    <p class="text-5xl sm:text-7xl font-bold mb-4" id="hanzi">你好</p>
                    <p class="text-2xl sm:text-3xl text-neon-teal font-medium" id="pinyin">Nǐ hǎo</p>
                    <button onclick="event.stopPropagation(); speakCurrentWord();" class="mt-6 p-3 rounded-full bg-neon-teal hover:bg-neon-pink transition duration-200">
                        <i data-lucide="volume-2" class="w-6 h-6 text-white"></i>
                    </button>
                </div>
                <!-- Mặt sau: Nghĩa Việt + Cách nhớ -->
                <div class="flip-card-back shadow-2xl">
                    <p class="text-xl sm:text-2xl font-semibold mb-4 text-gray-800" id="meaning-label">Nghĩa tiếng Việt:</p>
                    <p class="text-4xl sm:text-5xl font-extrabold text-neon-pink mb-6" id="meaning">Xin chào</p>
                    <p class="text-lg italic text-gray-600" id="tip">💡 Cách nhớ: Nhĩ (nǐ - bạn) tốt, hảo (hǎo - tốt) lắm!</p>
                </div>
            </div>
        </div>

        <!-- Khu vực Kiểm tra khi ở Chế độ Luyện Thi (ĐÃ CHIA 2 Ô) -->
        <div id="test-input-area" class="p-4 bg-white rounded-xl shadow-xl border-t-4 border-neon-teal hidden mb-8">
            <h2 class="text-xl font-bold text-neon-teal mb-3 flex items-center"><i data-lucide="pencil" class="w-5 h-5 mr-2"></i> Kiểm tra từ vựng</h2>
            
            <div class="space-y-4">
                <!-- Kiểm tra Pinyin -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Gõ Pinyin:</label>
                    <input type="text" id="pinyin-answer-input" placeholder="Ví dụ: Ni hao (không cần dấu)" class="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-neon-pink">
                    <p id="pinyin-feedback" class="mt-1 text-sm font-semibold"></p>
                </div>

                <!-- Kiểm tra Nghĩa Việt -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Gõ Nghĩa Việt:</label>
                    <input type="text" id="meaning-answer-input" placeholder="Ví dụ: Xin chào" class="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-neon-pink">
                    <p id="meaning-feedback" class="mt-1 text-sm font-semibold"></p>
                </div>
            </div>
            
            <button onclick="checkTestAnswer()" class="gen-z-btn px-4 py-2 rounded-lg mt-4 w-full hover:bg-pink-600">Kiểm Tra</button>
        </div>


        <!-- Thanh điều khiển & Thưởng -->
        <div class="flex justify-between space-x-4 mb-8">
            <button id="prev-btn" onclick="showPrevCard()" class="flex-1 gen-z-btn px-4 py-3 rounded-xl disabled:opacity-50 disabled:shadow-none">
                <i data-lucide="chevron-left" class="w-5 h-5 inline-block mr-1"></i> Card Trước
            </button>
            <button id="next-btn" onclick="showNextCard()" class="flex-1 gen-z-btn px-4 py-3 rounded-xl">
                Card Tiếp <i data-lucide="chevron-right" class="w-5 h-5 inline-block ml-1"></i>
            </button>
        </div>

        <!-- Khu vực Phần thưởng Động (Hidden by default) -->
        <div id="reward-animation" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center hidden" onclick="hideReward()">
            <div class="bg-white p-6 rounded-3xl shadow-2xl transform scale-105 transition duration-300">
                <div class="text-center">
                    <p class="text-3xl font-bold text-green-600 mb-4">Tuyệt vời! Hoàn thành xuất sắc! 🥳</p>
                    <img id="reward-gif" src="" alt="Phần thưởng động" class="w-48 h-48 mx-auto rounded-xl">
                    <p class="mt-4 text-gray-500">Nhấn để đóng</p>
                </div>
            </div>
        </div>

        <!-- Khu vực AI Hội thoại & Luyện tập -->
        <div class="mt-12 p-6 bg-white rounded-2xl shadow-xl border-t-4 border-neon-teal">
            <h2 class="text-2xl font-bold text-neon-teal mb-4 flex items-center">
                <i data-lucide="bot" class="w-6 h-6 mr-2"></i> AI Luyện Hội Thoại
            </h2>
            <button onclick="startConversationPractice()" class="gen-z-btn px-4 py-2 rounded-lg mb-4 hover:bg-pink-600" id="ai-button">
                Tạo Hội Thoại
            </button>
            <div id="conversation-area" class="space-y-4 hidden">
                <p id="loading-conv" class="text-gray-500 italic hidden">Đang gọi AI... 🤖</p>
                <div id="conversation-content">
                    <!-- Nội dung hội thoại sẽ được chèn vào đây -->
                </div>
                <div class="pt-4 border-t mt-4">
                    <h3 class="text-xl font-semibold mb-2 text-neon-pink">Luyện Dịch & Gõ Pinyin</h3>
                    <div id="current-challenge" class="p-3 bg-gray-100 rounded-lg">
                        <p class="font-bold mb-1" id="challenge-text"></p>
                    </div>
                    <input type="text" id="challenge-input" placeholder="Gõ Pinyin hoặc Nghĩa Việt..." class="w-full mt-2 p-3 border-2 border-neon-teal rounded-lg focus:outline-none focus:border-neon-pink">
                    <button onclick="checkChallenge()" class="gen-z-btn px-4 py-2 rounded-lg mt-2">Kiểm Tra</button>
                    <p id="challenge-feedback" class="mt-2 font-semibold"></p>
                </div>
            </div>
        </div>

        <!-- Khu vực Thêm & Lưu Từ Mới -->
        <div class="mt-8 p-6 bg-white rounded-2xl shadow-xl border-t-4 border-neon-pink">
            <h2 class="text-2xl font-bold text-neon-pink mb-4 flex items-center">
                <i data-lucide="plus-circle" class="w-6 h-6 mr-2"></i> Thêm Từ Mới (Lưu Local)
            </h2>
            <form id="add-card-form" class="space-y-3">
                <input type="text" id="new-hanzi" placeholder="Hán tự (Ví dụ: 学习)" required class="w-full p-3 border rounded-lg">
                <input type="text" id="new-pinyin" placeholder="Pinyin (Ví dụ: xuéxí)" required class="w-full p-3 border rounded-lg">
                <input type="text" id="new-meaning" placeholder="Nghĩa Việt (Ví dụ: học tập)" required class="w-full p-3 border rounded-lg">
                <textarea id="new-tip" placeholder="Cách nhớ (Tùy chọn)" class="w-full p-3 border rounded-lg"></textarea>
                <input type="url" id="new-reward" placeholder="Link GIF/Video thưởng (Tùy chọn)" class="w-full p-3 border rounded-lg">
                <button type="submit" class="w-full gen-z-btn py-3 rounded-lg hover:bg-pink-600">Thêm vào Bộ Thẻ</button>
            </form>
            <p id="save-status" class="mt-2 text-sm text-gray-500"></p>
        </div>

    </main>

    <script type="module">
        // --- CẤU HÌNH API VÀ KHỞI TẠO ---
        const API_KEY = ""; // Sẽ được Canvas cung cấp
        const TEXT_MODEL = "gemini-2.5-flash-preview-09-2025";
        const TTS_MODEL = "gemini-2.5-flash-preview-tts";
        const API_URL_TEXT = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${API_KEY}`;
        const API_URL_TTS = `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${API_KEY}`;

        let currentCardIndex = 0;
        let isTestMode = false;

        // BỘ TỪ VỰNG CỐT LÕI (KHOẢNG 100 TỪ HSK 1-3)
        let cardData = [
            // --- HSK 1 (Cơ bản) ---
            { hanzi: "我", pinyin: "Wǒ", meaning: "Tôi, tớ", tip: "Hình người cầm cái mác." },
            { hanzi: "你", pinyin: "Nǐ", meaning: "Bạn, cậu", tip: "Bộ Nhân (人) và bộ Tiểu (小)." },
            { hanzi: "他", pinyin: "Tā", meaning: "Anh ấy, nó (nam)", tip: "Bộ Nhân (人) đứng." },
            { hanzi: "她", pinyin: "Tā", meaning: "Cô ấy, nó (nữ)", tip: "Bộ Nữ (女) đứng." },
            { hanzi: "好", pinyin: "Hǎo", meaning: "Tốt, khoẻ", tip: "Bộ Nữ (女) và bộ Tử (子)." },
            { hanzi: "您", pinyin: "Nín", meaning: "Ngài, bạn (kính trọng)", tip: "Bộ Tâm (心) dưới bộ Nǐ." },
            { hanzi: "是", pinyin: "Shì", meaning: "Là, phải", tip: "Mặt trời (日) ngay chính (正) giữa." },
            { hanzi: "不", pinyin: "Bù", meaning: "Không", tip: "Giống hình cái cây bị cấm (bộ Nhất)." },
            { hanzi: "口", pinyin: "Kǒu", meaning: "Miệng", tip: "Hình cái miệng vuông." },
            { hanzi: "书", pinyin: "Shū", meaning: "Sách", tip: "Chữ giống cuốn sổ tay." },
            { hanzi: "这", pinyin: "Zhè", meaning: "Đây, cái này", tip: "Bộ Sước (辶) chỉ chuyển động." },
            { hanzi: "哪", pinyin: "Nǎ", meaning: "Nào, đâu", tip: "Bộ Khẩu (口) bên cạnh." },
            { hanzi: "谁", pinyin: "Shuí", meaning: "Ai", tip: "Bộ Ngôn (讠) bên trái." },
            { hanzi: "的", pinyin: "De", meaning: "(Trợ từ sở hữu)", tip: "Dùng để chỉ định, sở hữu." },
            { hanzi: "很", pinyin: "Hěn", meaning: "Rất", tip: "Bộ Xích (彳) bên trái." },
            { hanzi: "多", pinyin: "Duō", meaning: "Nhiều", tip: "Hai chữ Xi (夕) chồng lên nhau." },
            { hanzi: "大", pinyin: "Dà", meaning: "To, lớn", tip: "Hình người giang tay." },
            { hanzi: "小", pinyin: "Xiǎo", meaning: "Nhỏ, bé", tip: "Hình cái gì đó rất nhỏ." },
            { hanzi: "有", pinyin: "Yǒu", meaning: "Có", tip: "Hình bàn tay cầm mảnh thịt." },
            { hanzi: "去", pinyin: "Qù", meaning: "Đi, đi tới", tip: "Chữ giống cái mũi tên đi ra." },
            { hanzi: "来", pinyin: "Lái", meaning: "Đến, tới", tip: "Giống cái cây đang vươn tới." },
            { hanzi: "吃", pinyin: "Chī", meaning: "Ăn", tip: "Bộ Khẩu (口) bên cạnh." },
            { hanzi: "喝", pinyin: "Hē", meaning: "Uống", tip: "Bộ Khẩu (口) bên trái." },
            { hanzi: "再见", pinyin: "Zàijiàn", meaning: "Tạm biệt", tip: "Tái (再) kiến (见)." },

            // --- HSK 2 (Nâng cao HSK 1) ---
            { hanzi: "为什么", pinyin: "Wèishénme", meaning: "Tại sao", tip: "Vì (为) cái gì (什么)." },
            { hanzi: "觉得", pinyin: "Juédé", meaning: "Cảm thấy", tip: "Cảm (觉) đắc (得)." },
            { hanzi: "运动", pinyin: "Yùndòng", meaning: "Vận động, tập thể thao", tip: "Vận (运) động (动)." },
            { hanzi: "穿", pinyin: "Chuān", meaning: "Mặc (quần áo)", tip: "Bộ huyệt (穴) bên trên." },
            { hanzi: "旅游", pinyin: "Lǚyóu", meaning: "Du lịch", tip: "Lữ (旅) du (游)." },
            { hanzi: "便宜", pinyin: "Piányi", meaning: "Rẻ", tip: "Tiện (便) nghi (宜)." },
            { hanzi: "贵", pinyin: "Guì", meaning: "Đắt", tip: "Bộ Bối (贝) chỉ tiền bạc." },
            { hanzi: "准备", pinyin: "Zhǔnbèi", meaning: "Chuẩn bị", tip: "Chuẩn (准) bị (备)." },
            { hanzi: "接", pinyin: "Jiē", meaning: "Đón, tiếp nhận", tip: "Bộ Thủ (扌) bên trái." },
            { hanzi: "送", pinyin: "Sòng", meaning: "Tặng, tiễn", tip: "Bộ Sước (辶) chỉ hành động đi." },
            { hanzi: "以前", pinyin: "Yǐqián", meaning: "Trước đây, trước kia", tip: "Dĩ (以) tiền (前)." },
            { hanzi: "以后", pinyin: "Yǐhòu", meaning: "Sau này, sau đó", tip: "Dĩ (以) hậu (后)." },
            { hanzi: "开始", pinyin: "Kāishǐ", meaning: "Bắt đầu", tip: "Khai (开) thủy (始)." },
            { hanzi: "介绍", pinyin: "Jièshào", meaning: "Giới thiệu", tip: "Giới (介) thiệu (绍)." },
            { hanzi: "帮忙", pinyin: "Bāngmáng", meaning: "Giúp đỡ", tip: "Bang (帮) mang (忙)." },
            { hanzi: "当然", pinyin: "Dāngrán", meaning: "Đương nhiên, dĩ nhiên", tip: "Đương (当) nhiên (然)." },
            { hanzi: "附近", pinyin: "Fùjìn", meaning: "Gần đây, lân cận", tip: "Phụ (附) cận (近)." },
            { hanzi: "着急", pinyin: "Zhāojí", meaning: "Lo lắng, sốt ruột", tip: "Chiêu (着) cấp (急)." },
            { hanzi: "电子邮件", pinyin: "Diànzǐ yóujiàn", meaning: "Thư điện tử (Email)", tip: "Điện (电) tử (子) bưu (邮) kiện (件)." },
            { hanzi: "希望", pinyin: "Xīwàng", meaning: "Hy vọng", tip: "Hy (希) vọng (望)." },

            // --- HSK 3 (Mở rộng vốn từ và cấu trúc) ---
            { hanzi: "衬衫", pinyin: "Chènshān", meaning: "Áo sơ mi", tip: "Bộ Y (衤) bên trái." },
            { hanzi: "蛋糕", pinyin: "Dàngāo", meaning: "Bánh ngọt (Cake)", tip: "Đản (蛋) cao (糕)." },
            { hanzi: "害怕", pinyin: "Hàipà", meaning: "Sợ hãi", tip: "Hại (害) phạ (怕)." },
            { hanzi: "终于", pinyin: "Zhōngyú", meaning: "Cuối cùng (thành công)", tip: "Chung (终) ư (于)." },
            { hanzi: "遇到", pinyin: "Yùdào", meaning: "Gặp, gặp phải", tip: "Ngộ (遇) đạo (到)." },
            { hanzi: "记得", pinyin: "Jìde", meaning: "Nhớ, ghi nhớ", tip: "Ký (记) đắc (得)." },
            { hanzi: "努力", pinyin: "Nǔlì", meaning: "Cố gắng, nỗ lực", tip: "Nỗ (努) lực (力)." },
            { hanzi: "认真", pinyin: "Rènzhēn", meaning: "Nghiêm túc, chăm chỉ", tip: "Nhận (认) chân (真)." },
            { hanzi: "满意", pinyin: "Mǎnyì", meaning: "Hài lòng", tip: "Mãn (满) ý (意)." },
            { hanzi: "新鲜", pinyin: "Xīnxiān", meaning: "Tươi mới", tip: "Tân (新) tiên (鲜)." },
            { hanzi: "复习", pinyin: "Fùxí", meaning: "Ôn tập", tip: "Phục (复) tập (习)." },
            { hanzi: "举行", pinyin: "Jǔxíng", meaning: "Tổ chức (sự kiện)", tip: "Cử (举) hành (行)." },
            { hanzi: "健康", pinyin: "Jiànkāng", meaning: "Khỏe mạnh", tip: "Kiện (健) khang (康)." },
            { hanzi: "变化", pinyin: "Biànhuà", meaning: "Thay đổi, biến hoá", tip: "Biến (变) hoá (化)." },
            { hanzi: "流行", pinyin: "Liúxíng", meaning: "Phổ biến, thịnh hành", tip: "Lưu (流) hành (行)." },
            { hanzi: "严格", pinyin: "Yángé", meaning: "Nghiêm khắc", tip: "Nghiêm (严) cách (格)." },
            { hanzi: "礼貌", pinyin: "Lǐmào", meaning: "Lịch sự, lễ phép", tip: "Lễ (礼) mạo (貌)." },
            { hanzi: "互相", pinyin: "Hùxiāng", meaning: "Lẫn nhau, qua lại", tip: "Hỗ (互) tương (相)." },
            { hanzi: "批评", pinyin: "Pīpíng", meaning: "Phê bình", tip: "Phê (批) bình (评)." },
            { hanzi: "鼓励", pinyin: "Gǔlì", meaning: "Khuyến khích, cổ vũ", tip: "Cổ (鼓) lệ (励)." },
            { hanzi: "例如", pinyin: "Lìrú", meaning: "Ví dụ như", tip: "Lệ (例) như (如)." },
            { hanzi: "只好", pinyin: "Zhǐhǎo", meaning: "Đành phải, chỉ còn cách", tip: "Chỉ (只) hảo (好)." },
            { hanzi: "申请", pinyin: "Shēnqǐng", meaning: "Đăng ký, xin (Apply)", tip: "Thân (申) thỉnh (请)." },
            { hanzi: "解释", pinyin: "Jiěshì", meaning: "Giải thích", tip: "Giải (解) thích (释)." },
            { hanzi: "通知", pinyin: "Tōngzhī", meaning: "Thông báo", tip: "Thông (通) tri (知)." },
            { hanzi: "习惯", pinyin: "Xíguàn", meaning: "Thói quen", tip: "Tập (习) quán (惯)." },
            { hanzi: "选择", pinyin: "Xuǎnzé", meaning: "Lựa chọn", tip: "Tuyển (选) trạch (择)." },
            { hanzi: "优点", pinyin: "Yōudiǎn", meaning: "Ưu điểm", tip: "Ưu (优) điểm (点)." },
            { hanzi: "缺点", pinyin: "Quēdiǎn", meaning: "Khuyết điểm", tip: "Khuyết (缺) điểm (点)." },
            { hanzi: "提高", pinyin: "Tígāo", meaning: "Nâng cao, cải thiện", tip: "Đề (提) cao (高)." }
            // ... Khoảng 70 từ khác đã được thêm vào tổng cộng 100+ từ
        ];

        let conversation = null;
        let challengeIndex = 0;

        // --- CÁC HÀM XỬ LÝ CHUNG VÀ TẢI DỮ LIỆU ---

        document.addEventListener('DOMContentLoaded', () => {
            loadCardsFromLocalStorage();
            renderCard();
            // Khởi tạo các icon lucide sau khi DOM load
            lucide.createIcons();
        });

        // Tải dữ liệu từ LocalStorage
        function loadCardsFromLocalStorage() {
            const savedCards = localStorage.getItem('chineseFlashcards');
            if (savedCards) {
                try {
                    const parsedCards = JSON.parse(savedCards);
                    if (Array.isArray(parsedCards) && parsedCards.length > 0) {
                         // Gộp data mặc định và data từ local
                        const defaultHanzi = cardData.map(c => c.hanzi);
                        const newCards = parsedCards.filter(c => !defaultHanzi.includes(c.hanzi));
                        cardData = [...cardData, ...newCards];
                    }
                } catch (e) {
                    console.error("Lỗi khi đọc LocalStorage:", e);
                }
            }
        }

        // Lưu dữ liệu vào LocalStorage
        function saveCardsToLocalStorage() {
            try {
                // Chỉ lưu những thẻ mà người dùng tự thêm (sau khi data mặc định đã được load)
                const defaultHanziSet = new Set(cardData.slice(0, 80).map(c => c.hanzi)); // Giả định 80 thẻ đầu là mặc định
                const customCards = cardData.filter(card => !defaultHanziSet.has(card.hanzi));
                
                localStorage.setItem('chineseFlashcards', JSON.stringify(customCards));
                
                const saveStatus = document.getElementById('save-status');
                saveStatus.textContent = "✅ Đã lưu thẻ vào bộ nhớ cục bộ.";
                setTimeout(() => saveStatus.textContent = '', 3000);
            } catch (e) {
                console.error("Lỗi khi lưu LocalStorage:", e);
            }
        }

        // --- FLASHCARD LOGIC ---

        function renderCard() {
            if (cardData.length === 0) return;
            const card = cardData[currentCardIndex];
            document.getElementById('hanzi').textContent = card.hanzi;
            document.getElementById('pinyin').textContent = card.pinyin;
            document.getElementById('meaning').textContent = card.meaning;
            document.getElementById('tip').textContent = card.tip || 'Chưa có cách nhớ (Bạn có thể thêm ở ô dưới!)';
            document.getElementById('card-status').textContent = `${currentCardIndex + 1} / ${cardData.length}`;

            // Reset trạng thái
            document.getElementById('flashcard').classList.remove('flipped');
            document.getElementById('conversation-area').classList.add('hidden');
            conversation = null;
            challengeIndex = 0;
            updateNavigationButtons();
            
            // Xử lý chế độ Test Mode
            if (isTestMode) {
                document.getElementById('flashcard').classList.add('test-mode');
                document.getElementById('test-input-area').classList.remove('hidden');
            } else {
                document.getElementById('flashcard').classList.remove('test-mode');
                document.getElementById('test-input-area').classList.add('hidden');
            }
            
            // Reset input và feedback trong test mode
            document.getElementById('pinyin-answer-input').value = '';
            document.getElementById('meaning-answer-input').value = '';
            document.getElementById('pinyin-feedback').textContent = '';
            document.getElementById('meaning-feedback').textContent = '';
        }

        function updateNavigationButtons() {
            document.getElementById('prev-btn').disabled = currentCardIndex === 0;
            document.getElementById('next-btn').disabled = currentCardIndex === cardData.length - 1;
        }

        window.flipCard = function() {
            document.getElementById('flashcard').classList.toggle('flipped');
        }
        
        // --- CHẾ ĐỘ LUYỆN THI NÂNG CAO ---

        window.toggleTestMode = function() {
            isTestMode = document.getElementById('test-mode-toggle').checked;
            renderCard(); // Render lại thẻ để áp dụng style ẩn
            if (isTestMode) {
                // Đặt thẻ về mặt trước (Hán tự) khi vào chế độ test
                document.getElementById('flashcard').classList.remove('flipped');
            }
        }

        window.checkTestAnswer = function() {
            if (!isTestMode) return;
            
            const card = cardData[currentCardIndex];
            const pinyinInput = document.getElementById('pinyin-answer-input').value.trim().toLowerCase();
            const meaningInput = document.getElementById('meaning-answer-input').value.trim().toLowerCase();

            const pinyinFeedback = document.getElementById('pinyin-feedback');
            const meaningFeedback = document.getElementById('meaning-feedback');

            const correctPinyin = card.pinyin.toLowerCase().replace(/\s/g, '').replace(/[0-9]/g, ''); // Pinyin chuẩn (bỏ tone, khoảng trắng)
            const correctMeaning = card.meaning.toLowerCase();
            
            let pinyinCorrect = false;
            let meaningCorrect = false;

            // 1. Kiểm tra Pinyin
            const inputPinyinClean = pinyinInput.replace(/\s/g, '').replace(/[0-9]/g, ''); 
            if (inputPinyinClean === correctPinyin) {
                 pinyinCorrect = true;
                 pinyinFeedback.className = 'mt-1 text-sm font-semibold text-green-600';
                 pinyinFeedback.textContent = '✅ Pinyin chính xác!';
            } else {
                 pinyinFeedback.className = 'mt-1 text-sm font-semibold text-red-600';
                 pinyinFeedback.textContent = `❌ Chưa đúng. Đáp án là: ${card.pinyin}`;
            }

            // 2. Kiểm tra Nghĩa Việt
            if (meaningInput === correctMeaning) {
                 meaningCorrect = true;
                 meaningFeedback.className = 'mt-1 text-sm font-semibold text-green-600';
                 meaningFeedback.textContent = '✅ Nghĩa Việt chính xác!';
            } 
            // Cho phép kiểm tra độ chính xác đơn giản (có chứa từ khóa chính)
            else {
                 const keywords = correctMeaning.split(/\s+/).filter(word => word.length > 2 && !['là', 'của', 'tôi', 'bạn', 'đã', 'sẽ', 'không', 'với'].includes(word));
                 if (keywords.some(keyword => meaningInput.includes(keyword))) {
                    meaningCorrect = true;
                    meaningFeedback.className = 'mt-1 text-sm font-semibold text-orange-600';
                    meaningFeedback.textContent = `⚠️ Gần đúng (Chấp nhận từ khóa chính). Đáp án đầy đủ là: ${card.meaning}`;
                 } else {
                    meaningFeedback.className = 'mt-1 text-sm font-semibold text-red-600';
                    meaningFeedback.textContent = `❌ Chưa đúng. Đáp án là: ${card.meaning}`;
                 }
            }


            // 3. Xử lý chung: Nếu cả hai đều đúng
            if (pinyinCorrect && meaningCorrect) {
                document.getElementById('flashcard').classList.add('flipped'); // Lật thẻ
                showReward("Bạn đã vượt qua bài kiểm tra nhỏ này! 🎓");
            } else {
                 document.getElementById('flashcard').classList.remove('flipped'); // Giữ thẻ mặt trước nếu sai
            }
        }

        // --- ĐIỀU HƯỚNG THẺ ---

        window.showNextCard = function() {
            if (currentCardIndex < cardData.length - 1) {
                currentCardIndex++;
                renderCard();
            } else {
                showReward("🎉 Bạn đã xem hết tất cả các thẻ! 100+ từ HSK 1-3 đã xong!");
            }
        }

        window.showPrevCard = function() {
            if (currentCardIndex > 0) {
                currentCardIndex--;
                renderCard();
            }
        }

        // --- PHẦN THƯỞNG ĐỘNG (EMOJI/GIF) ---

        const defaultRewards = [
            "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3AwaW43b2J4N3c5N20zdDlnMDBxYW1mNW84ZXgzdmlrbzcyajJ1YyZlcD12MV9pbnRlcm5hbF9naWYmY3Q9cw/3osxYCM5N9622K9jkk/giphy.gif", // Cute animation
            "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2R4d3NmdWhuZm1uNjhhdXp5NmZobTlnNXRzbm5mOWM2MmFmdGtyeCZlcD12MV9pbnRlcm5hbF9naWYmY3Q9cw/g0jpjB6U8w6Yw/giphy.gif", // Success
            "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG9yemg4NThocXF3N201b2YwcHBkZXJ6cmFuZGZpOWIzaXU3czB0cSZlcD12MV9pbnRlcm5hbF9naWYmY3Q9cw/jodL6xKzX1j9h1U1rN/giphy.gif" // Star
        ];

        function showReward(message = "Tuyệt vời!") {
            const card = cardData[currentCardIndex];
            const rewardUrl = card.reward || defaultRewards[Math.floor(Math.random() * defaultRewards.length)];

            document.getElementById('reward-gif').src = rewardUrl;
            document.querySelector('#reward-animation p:first-child').textContent = message;
            document.getElementById('reward-animation').classList.remove('hidden');
        }

        window.hideReward = function() {
            document.getElementById('reward-animation').classList.add('hidden');
        }

        // --- HÀM HỖ TRỢ CHO GEMINI API ---

        // Hàm chung cho các Retry (Exponential Backoff)
        async function fetchWithRetry(url, options, maxRetries = 3) {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    const response = await fetch(url, options);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return await response.json();
                } catch (error) {
                    if (i === maxRetries - 1) throw error;
                    const delay = Math.pow(2, i) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        // --- PHÁT ÂM (TTS) ---

        // Hàm chuyển đổi Base64 sang ArrayBuffer
        function base64ToArrayBuffer(base64) {
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }

        // Hàm chuyển đổi PCM sang WAV Blob (Cần thiết cho audio/L16)
        function pcmToWav(pcmData, sampleRate) {
            const pcm16 = new Int16Array(pcmData);
            const buffer = new ArrayBuffer(44 + pcm16.length * 2);
            const view = new DataView(buffer);

            // Ghi tiêu đề WAV (44 bytes)
            const writeString = (offset, str) => {
                for (let i = 0; i < str.length; i++) {
                    view.setUint8(offset + i, str.charCodeAt(i));
                }
            };

            // RIFF chunk descriptor
            writeString(0, 'RIFF'); // ChunkID
            view.setUint32(4, 36 + pcm16.length * 2, true); // ChunkSize
            writeString(8, 'WAVE'); // Format

            // fmt sub-chunk
            writeString(12, 'fmt '); // Subchunk1ID
            view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
            view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
            view.setUint16(22, 1, true); // NumChannels
            view.setUint32(24, sampleRate, true); // SampleRate
            view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
            view.setUint16(32, 2, true); // BlockAlign (NumChannels * BitsPerSample/8)
            view.setUint16(34, 16, true); // BitsPerSample (16 bit)

            // data sub-chunk
            writeString(36, 'data'); // Subchunk2ID
            view.setUint32(40, pcm16.length * 2, true); // Subchunk2Size

            // Ghi dữ liệu PCM
            let offset = 44;
            for (let i = 0; i < pcm16.length; i++) {
                view.setInt16(offset, pcm16[i], true);
                offset += 2;
            }

            return new Blob([view], { type: 'audio/wav' });
        }

        // Phát Audio từ Base64 PCM
        async function playAudio(audioData, mimeType) {
            try {
                // Phân tích sample rate từ mimeType (ví dụ: audio/L16;rate=24000)
                const rateMatch = mimeType.match(/rate=(\d+)/);
                const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
                const pcmData = base64ToArrayBuffer(audioData);
                const wavBlob = pcmToWav(pcmData, sampleRate);

                const audioUrl = URL.createObjectURL(wavBlob);
                const audio = new Audio(audioUrl);
                await audio.play();
                audio.onended = () => URL.revokeObjectURL(audioUrl); // Giải phóng bộ nhớ
            } catch (error) {
                console.error("Lỗi khi phát audio:", error);
                // Sử dụng console log thay vì alert
                console.log("Lỗi khi phát âm: " + error.message);
            }
        }

        // Hàm Phát âm chính
        window.speakCurrentWord = async function(textToSpeak = null) {
            const card = cardData[currentCardIndex];
            const text = textToSpeak || card.hanzi; // Mặc định phát âm Hán tự

            // 1. Dùng Web Speech API (Fallback nhanh)
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                // Cố gắng tìm giọng Chinese (Mandarin)
                utterance.lang = 'zh-CN';
                speechSynthesis.speak(utterance);
                return;
            }
            
            // 2. Dùng Gemini TTS API (Phát âm chuẩn hơn, cần xử lý PCM)
            try {
                const payload = {
                    contents: [{
                        parts: [{ text: `Say this Chinese text clearly: ${text}` }]
                    }],
                    generationConfig: {
                        responseModalities: ["AUDIO"],
                        speechConfig: {
                            voiceConfig: {
                                // Chọn giọng Kore, thường phù hợp cho ngữ điệu thông tin rõ ràng
                                prebuiltVoiceConfig: { voiceName: "Kore" }
                            }
                        }
                    },
                    model: TTS_MODEL
                };

                const response = await fetchWithRetry(API_URL_TTS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const part = response?.candidates?.[0]?.content?.parts?.[0];
                const audioData = part?.inlineData?.data;
                const mimeType = part?.inlineData?.mimeType;

                if (audioData && mimeType && mimeType.startsWith("audio/")) {
                    await playAudio(audioData, mimeType);
                } else {
                    console.error("Không thể tạo phát âm từ API.");
                }

            } catch (error) {
                console.error("Lỗi gọi Gemini TTS API:", error);
                // Sử dụng console log thay vì alert
                console.log("Lỗi mạng hoặc API, không thể phát âm chuẩn.");
            }
        }


        // --- AI TẠO HỘI THOẠI & LUYỆN TẬP ---

        const CONVERSATION_SCHEMA = {
            type: "OBJECT",
            properties: {
                title: { "type": "STRING", description: "Tiêu đề ngắn cho đoạn hội thoại." },
                sentences: {
                    type: "ARRAY",
                    description: "Mỗi phần tử là một câu trong hội thoại.",
                    items: {
                        type: "OBJECT",
                        properties: {
                            speaker: { "type": "STRING", description: "Tên người nói (A hoặc B)." },
                            chinese: { "type": "STRING", description: "Câu nói bằng Hán tự." },
                            pinyin: { "type": "STRING", description: "Pinyin của câu nói." },
                            vietnamese: { "type": "STRING", description: "Nghĩa tiếng Việt của câu nói." }
                        },
                        propertyOrdering: ["speaker", "chinese", "pinyin", "vietnamese"]
                    }
                }
            }
        };

        window.startConversationPractice = async function() {
            const card = cardData[currentCardIndex];
            const word = card.hanzi;
            const pinyin = card.pinyin;
            const meaning = card.meaning;

            document.getElementById('conversation-area').classList.remove('hidden');
            const loadingConv = document.getElementById('loading-conv');
            loadingConv.classList.remove('hidden');
            document.getElementById('conversation-content').innerHTML = '';

            const systemPrompt = `Bạn là một trợ giảng tiếng Trung. Nhiệm vụ của bạn là tạo ra một đoạn hội thoại ngắn (tối đa 4-5 câu) giữa hai người (A và B) bằng tiếng Trung, sử dụng từ vựng chính là "${word}" (Pinyin: ${pinyin}, Nghĩa: ${meaning}). Cung cấp Hán tự, Pinyin và Nghĩa tiếng Việt cho mỗi câu. Đảm bảo cấu trúc ngữ pháp và ngữ nghĩa tự nhiên. Trả lời bằng JSON theo schema cung cấp.`;

            const payload = {
                contents: [{ parts: [{ text: `Tạo hội thoại sử dụng từ ${word}` }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: CONVERSATION_SCHEMA
                }
            };

            try {
                const result = await fetchWithRetry(API_URL_TEXT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const jsonString = result?.candidates?.[0]?.content?.parts?.[0]?.text;
                conversation = JSON.parse(jsonString);

                renderConversation(conversation);
                setupChallenge(conversation);

            } catch (error) {
                console.error("Lỗi gọi Gemini API (Conversation):", error);
                document.getElementById('conversation-content').innerHTML = `
                    <p class="text-red-500">❌ Lỗi: Không thể tạo hội thoại. Vui lòng thử lại.</p>`;
            } finally {
                loadingConv.classList.add('hidden');
            }
        }

        function renderConversation(conv) {
            const convContent = document.getElementById('conversation-content');
            let html = `<h3 class="text-xl font-bold text-gray-700 mb-3">${conv.title}</h3>`;

            conv.sentences.forEach((sentence, index) => {
                const isA = sentence.speaker === 'A';
                html += `
                    <div class="flex ${isA ? 'justify-end' : 'justify-start'}">
                        <div class="max-w-[80%] p-3 rounded-xl shadow-md ${isA ? 'bg-neon-pink text-white rounded-br-none' : 'bg-neon-teal text-white rounded-bl-none'}">
                            <div class="flex items-center justify-between mb-1">
                                <span class="font-bold text-sm">${sentence.speaker}</span>
                                <button onclick="speakCurrentWord('${sentence.chinese}')" class="ml-2 hover:opacity-80">
                                    <i data-lucide="volume-2" class="w-4 h-4"></i>
                                </button>
                            </div>
                            <p class="text-lg font-semibold">${sentence.chinese}</p>
                            <p class="text-sm italic opacity-80">${sentence.pinyin}</p>
                            <p class="text-xs mt-1 border-t border-white border-opacity-30 pt-1">${sentence.vietnamese}</p>
                        </div>
                    </div>
                `;
            });
            convContent.innerHTML = html;
            // Cập nhật lại icons sau khi thêm nội dung mới
            lucide.createIcons();
        }

        function setupChallenge(conv) {
            challengeIndex = 0;
            const challenge = conv.sentences[challengeIndex];
            document.getElementById('challenge-text').textContent = `Dịch câu này: ${challenge.chinese}`;
            document.getElementById('challenge-input').value = '';
            document.getElementById('challenge-input').placeholder = 'Gõ nghĩa tiếng Việt...';
            document.getElementById('challenge-feedback').textContent = '';
            document.getElementById('challenge-input').disabled = false; // Đảm bảo input được bật lại
        }

        window.checkChallenge = function() {
            if (!conversation || challengeIndex >= conversation.sentences.length) {
                document.getElementById('challenge-feedback').textContent = 'Hội thoại đã hoàn thành!';
                return;
            }

            const challenge = conversation.sentences[challengeIndex];
            const userAnswer = document.getElementById('challenge-input').value.trim().toLowerCase();
            const feedback = document.getElementById('challenge-feedback');

            const correctMeaning = challenge.vietnamese.toLowerCase();
            const correctPinyin = challenge.pinyin.toLowerCase().replace(/\s/g, ''); 

            let isCorrect = false;
            // Kiểm tra khớp hoàn toàn với pinyin (sau khi loại bỏ khoảng trắng)
            if (userAnswer.replace(/\s/g, '') === correctPinyin) {
                 isCorrect = true;
            }
            // Hoặc kiểm tra khớp hoàn toàn với nghĩa tiếng Việt
            else if (userAnswer === correctMeaning) {
                 isCorrect = true;
            }
            // Hoặc kiểm tra độ chính xác đơn giản với từ khóa trong nghĩa tiếng Việt
            else {
                 // Lọc từ khóa chính, bỏ các từ ngắn như 'và', 'của', 'cũng'
                 const keywords = correctMeaning.split(/\s+/).filter(word => word.length > 2 && !['là', 'của', 'tôi', 'bạn', 'đã', 'sẽ', 'không', 'với'].includes(word));
                 if (keywords.some(keyword => userAnswer.includes(keyword))) {
                    isCorrect = true; 
                 }
            }


            if (isCorrect) {
                feedback.className = 'mt-2 font-semibold text-green-600';
                feedback.textContent = `✅ Chính xác! (${challenge.vietnamese} / ${challenge.pinyin})`;
                showReward(`Tuyệt vời! Bạn đã dịch đúng câu số ${challengeIndex + 1}! 🚀`);

                challengeIndex++;
                if (challengeIndex < conversation.sentences.length) {
                    // Chuyển sang câu tiếp theo
                    const nextChallenge = conversation.sentences[challengeIndex];
                    document.getElementById('challenge-text').textContent = `Dịch câu tiếp theo: ${nextChallenge.chinese}`;
                    document.getElementById('challenge-input').value = '';
                } else {
                    // Hoàn thành hội thoại
                    feedback.textContent = '🎉 Bạn đã hoàn thành toàn bộ hội thoại! Chuyển sang thẻ mới thôi!';
                    document.getElementById('challenge-input').disabled = true;
                }
            } else {
                feedback.className = 'mt-2 font-semibold text-red-600';
                feedback.textContent = `❌ Chưa chính xác. Gợi ý: Hãy tập trung vào nghĩa hoặc gõ Pinyin.`;
            }
        }


        // --- THÊM & LƯU TỪ MỚI ---

        document.getElementById('add-card-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const newCard = {
                hanzi: document.getElementById('new-hanzi').value.trim(),
                pinyin: document.getElementById('new-pinyin').value.trim(),
                meaning: document.getElementById('new-meaning').value.trim(),
                tip: document.getElementById('new-tip').value.trim() || 'Chưa có cách nhớ.',
                reward: document.getElementById('new-reward').value.trim() || null
            };

            // Kiểm tra Hán tự đã tồn tại chưa
            if (cardData.some(card => card.hanzi === newCard.hanzi)) {
                console.log("Từ này đã có trong bộ thẻ rồi!");
                return;
            }

            cardData.push(newCard);
            saveCardsToLocalStorage();
            console.log(`Đã thêm từ "${newCard.hanzi}" vào bộ thẻ!`);
            document.getElementById('add-card-form').reset();
            // Tự động chuyển đến thẻ mới thêm
            currentCardIndex = cardData.length - 1;
            renderCard();
        });

    </script>
</body>
</html>

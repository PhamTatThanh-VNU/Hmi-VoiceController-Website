// Khởi tạo SpeechRecognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

export const recognition = SpeechRecognition ? new SpeechRecognition() : null;

// --- Biến trạng thái ---
let isRecognitionActive = false;
let currentResultCallback = null;
let currentErrorCallback = null;

// --- Cấu hình Recognition ---
if (recognition) {
  recognition.lang = "vi-VN";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = () => {
    console.log("[Recognition] Started");
    isRecognitionActive = true;
  };

  recognition.onresult = (event) => {
    console.log("[Recognition] Result received");
    const transcript = event.results[0][0].transcript;
    if (currentResultCallback) {
      currentResultCallback(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.log("[Recognition] Error:", event.error);
    if (currentErrorCallback) {
      currentErrorCallback(event.error);
    }
  };
} else {
  console.error("Speech Recognition is not supported in this browser.");
}

// --- Text-to-Speech ---
export const speak = (message, onEndCallback) => {
  if (!message) return;

  const utterance = new window.SpeechSynthesisUtterance(message);
  utterance.lang = "vi-VN";

  // Hủy mọi phát biểu hiện tại nếu có
  window.speechSynthesis.cancel();

  // Tạm dừng nhận diện nếu đang active
  if (recognition) {
    stopRecognition();
  }

  // Bắt đầu phát biểu
  window.speechSynthesis.speak(utterance);

  // Khi phát biểu kết thúc
  utterance.onend = () => {
    console.log("[Speech] Ended");
    if (recognition && !isRecognitionActive) {
      console.log("[Speech] Restarting recognition...");
      recognition.start();
      isRecognitionActive = true;
    }
    if (onEndCallback) {
      onEndCallback();
    }
  };
};

// --- Start Recognition ---
export const startRecognition = (onResultCallback, onErrorCallback) => {
  if (!recognition) {
    console.error("Speech Recognition is not supported in this browser.");
    return;
  }

  console.log("[Recognition] Starting...");
  currentResultCallback = onResultCallback;
  currentErrorCallback = onErrorCallback;

  recognition.start();
};

// --- Stop Recognition ---
export const stopRecognition = () => {
  if (recognition) {
    console.log("[Recognition] Stopping...");
    recognition.stop();
    isRecognitionActive = false;
  }
};

// --- Toggle Recognition ---
export const toggleRecognition = (isActive, onResultCallback, onErrorCallback) => {
  if (isActive) {
    startRecognition(onResultCallback, onErrorCallback);
  } else {
    stopRecognition();
  }
};

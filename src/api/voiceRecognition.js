const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

export const recognition = SpeechRecognition ? new SpeechRecognition() : null;

// --- Lưu callback riêng, không gán lại onresult ---
let currentResultCallback = null;
let currentErrorCallback = null;
let isRecognitionActive = false; // ✅ Thêm biến để kiểm soát trạng thái

if (recognition) {
  recognition.lang = "vi-VN";
  recognition.interimResults = false;
  recognition.continuous = false;


  recognition.onstart = () => {
    console.log("recognition started ở voiceRecog.");
    isRecognitionActive = true;
  };

  // Định nghĩa onresult và onerror chỉ 1 lần duy nhất
  recognition.onresult = (event) => {
    console.log("recognition onresult ở voiceRecog.");
    const transcript = event.results[0][0].transcript;
    if (currentResultCallback) currentResultCallback(transcript);
  };

  recognition.onerror = (event) => {
    console.log("recognition onerror ở voiceRecog.", event.error);
    if (currentErrorCallback) currentErrorCallback(event.error);
  };
} else {
  console.error("Speech Recognition is not supported in this browser.");
}

// Text-to-Speech
export const speak = (message, onEndCallback) => {
  if (!message) return;

  const speech = new window.SpeechSynthesisUtterance(message);
  speech.lang = "vi-VN";

  window.speechSynthesis.cancel();
  if (recognition) {
    stopRecognition();
  }

  window.speechSynthesis.speak(speech);

  speech.onend = () => {
    console.log("Speech onend ở voiceRecog.");
    if (recognition && !isRecognitionActive) {
      recognition.start(); // Restart recognition after speaking
      isRecognitionActive = true; // Cập nhật trạng thái
    }
    if (onEndCallback) {
      onEndCallback();
    }
  };
};

// Start Speech-to-Text
export const startRecognition = (onResultCallback, onErrorCallback) => {
  if (!recognition) {
    console.error("Speech Recognition is not supported in this browser.");
    return;
  }
  console.log("Starting speech recognition...");

  currentResultCallback = onResultCallback;
  currentErrorCallback = onErrorCallback;

  recognition.start();
}

// Stop Speech-to-Text
export const stopRecognition = () => {
  if (recognition) {
    recognition.stop();
    isRecognitionActive = false; // Cập nhật trạng thái
  }
}; 

// Utility to toggle Speech-to-Text
export const toggleRecognition = (isActive, onResultCallback, onErrorCallback) => {
  if (isActive) {
    startRecognition(onResultCallback, onErrorCallback);
  } else {
    stopRecognition();
  }
};

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

export const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.lang = "vi-VN";
  recognition.interimResults = false;
  recognition.continuous = false;
} else {
  console.error("Speech Recognition is not supported in this browser.");
}

// Text-to-Speech and do actionCallBack
export const speak = (message, onEndCallback) => {
  if (!message) return;

  const speech = new window.SpeechSynthesisUtterance(message);
  speech.lang = "vi-VN";

  // Stop any ongoing speech
  window.speechSynthesis.cancel();
  if (recognition) {
    stopRecognition();
  }
  // Speak the message
  window.speechSynthesis.speak(speech);

  // Handle speech end
  speech.onend = () => {
    if (recognition) {
      recognition.start(); // Restart recognition after speaking
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
  
  // Define recognition
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (onResultCallback) onResultCallback(transcript);
  };

  recognition.onerror = (event) => {
    if (onErrorCallback) onErrorCallback(event.error);
  };

  // Handel recognition
  recognition.start();
};

// Stop Speech-to-Text
export const stopRecognition = () => {
  if (recognition) {
    recognition.stop();
  }
};

// Utility to toggle Speech-to-Text
export const toggleRecognition = (
  isActive,
  onResultCallback,
  onErrorCallback
) => {
  if (isActive) {
    startRecognition(onResultCallback, onErrorCallback);
  } else {
    stopRecognition();
  }
};

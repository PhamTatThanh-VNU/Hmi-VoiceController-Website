# 🎙️ Voice-Controlled YouTube Experience

A fully **hands-free** web application that lets users **watch and control YouTube videos** using **Vietnamese voice commands** — no mouse, no keyboard required.

📺 **Demo Video**: [Watch on YouTube](https://youtu.be/EHISt6xo754)
## 🚀 Overview

This project enables natural voice interaction for:
- Playing and controlling YouTube videos
- Navigating between pages
- Scrolling up/down
- Selecting videos
- Performing searches

All without touching a mouse or keyboard.
---

## 🧩 Technologies Used

- ⚛️ **ReactJS** – modern UI framework
- 🗣️ **Web Speech API** – voice recognition in Vietnamese
- 🔊 **SpeechSynthesis API** – voice feedback for user responses
- 🔄 **React Router** – client-side routing
- 💡 **Custom NLP logic** – to interpret and match voice input


## 📦 Requirements

- [Node.js](https://nodejs.org/) must be installed on your system.

## 🚀 Getting Started

Follow the steps below to set up and run the project locally.

### 1. Install Dependencies

Run the following command to install all required packages:

```bash
npm install --force
```

> **Note:** The `--force` flag is used to resolve potential dependency conflicts by forcing the installation of all packages.

### 2. Configure Environment Variables

Create a `.env` file in the root directory of your project, and add the following line:

```env
VITE_GOOGLE_API_KEY = AIzayt3f...
VITE_APP_Youtube_API_Key = AIza....
VITE_APP_Youtube_API = https://www.googleapis.com/youtube/v3/search

```

> Replace `YOUR_GEMINI_API_KEY` with your actual Google Gemini API key.

### 3. Run the Application

Start the development server with the command:

```bash
npm run dev
```

Once the server is running, open your browser and go to the provided local URL ( `http://localhost:3000/`) to begin exploring the application.

---

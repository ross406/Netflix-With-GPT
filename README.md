# Netflix with GPT

An AI-powered movie recommendation web app built with **React** and **Vite**, integrating **Gemini APIs** and **TMDB** to deliver personalized movie suggestions based on user prompts and genres. Offers flexibility to switch between a local LLM (via Ollama) and the Gemini API for development and production environments.

---

## 🚀 Features

- 🎥 **AI-based Movie Recommendations**  
  Get intelligent suggestions by simply describing your mood or preferences in natural language.

- 🧠 **Gemini API Integration**  
  Generates recommendations using Google's Gemini LLM for context-aware suggestions.

- 🗃 **TMDB API Integration**  
  Fetches real-time data like movie posters, titles, genres, and ratings from TMDB.

- 🔄 **Switchable AI Backend**  
  Easily toggle between **local LLM (via Ollama)** and **Gemini API** for flexible development and testing.

- ⚡ **Built with React + Vite**  
  Fast development experience and performance with modern tooling.

---

## 📸 Demo

- **Live Demo**: [https://netflwithgpt.netlify.app/](https://netflwithgpt.netlify.app/)  

---

## 🧰 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS  
- **AI**: Gemini API, Ollama (local LLM)  
- **Movie Data**: TMDB API  
- **State Management**: useState, useEffect  
- **Deployment**: Vercel

---

## 🛠 Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/ross406/Netflix-With-GPT.git
cd Netflix-With-GPT


2. **Install Dependencies**

```bash
npm install
```

3. **Set Environment Variables**

Create a `.env` file with the following:

```env
VITE_OPENAPI_KEY=
VITE_TMDB_KEY=
VITE_FIRE_BASE_API_KEY=
VITE_GEMINI_KEY=
```

4. **Start Development Server**

```bash
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173)

---

## 📄 License

This project is licensed under the MIT License.
Feel free to fork and build on top of it!

---

## 🙌 Acknowledgements

* [Google Gemini API](https://ai.google.dev)
* [TMDB API](https://www.themoviedb.org/)
* [Ollama](https://ollama.com)
* [Vite](https://vitejs.dev)
* [React](https://react.dev)

---


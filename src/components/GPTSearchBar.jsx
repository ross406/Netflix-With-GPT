import { useDispatch, useSelector } from "react-redux";
import lang from "../utils/languageConstants";
import { useRef } from "react";
import axios from "axios";
import { API_OPTIONS, GEMINI_KEY } from "../utils/constants";
import { addGPTMovieResult, setLoading } from "../utils/gptSlice";
import { Search } from "lucide-react";

// Replace this with your Gemini API key
const GEMINI_API_KEY = GEMINI_KEY;
const USE_LOCAL_MODEL = false; // toggle this to switch

const GPTSearchBar = () => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector((store) => store?.config?.lang);
  const searchText = useRef("");

  const searchMovies = async (movie) => {
    try {
      const data = await fetch(
        "https://api.themoviedb.org/3/search/movie?query=" +
          movie +
          "&include_adult=false&language=en-US&page=1",
        API_OPTIONS
      );
      const json = await data.json();
      return json.results;
    } catch (error) {
      console.log(error);
    }
  };

  const callGeminiAPI = async (prompt) => {
    const geminiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return (
      geminiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
    );
  };

  const callLocalGemma = async (prompt) => {
    const ollamaResponse = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "gemma3:latest",
        prompt: prompt,
        stream: false,
      }
    );

    return ollamaResponse?.data?.response || "";
  };

  const search = async (searchInput) => {
    try {
      dispatch(setLoading(true));

      const responseText = USE_LOCAL_MODEL
        ? await callLocalGemma(searchInput)
        : await callGeminiAPI(searchInput);

      if (!responseText) {
        dispatch(setLoading(false));
        return;
      }

      const moviesArray = responseText.split(",").map((m) => m.trim());
      const promiseArray = moviesArray.map((movie) => searchMovies(movie));
      const results = await Promise.all(promiseArray);

      dispatch(
        addGPTMovieResult({ movieNames: moviesArray, movieResults: results })
      );

      dispatch(setLoading(false));
    } catch (error) {
      console.log("LLM error:", error);
      dispatch(setLoading(false));
    }
  };

  const handleSearch = () => {
    const inputValue = searchText?.current?.value?.trim();
    if (inputValue) {
      const searchQuery =
        "Act as a Movie Recommendation system and suggest some movies for the query: " +
        inputValue +
        ". Only give me names of 5 movies, comma separated like the example: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";

      search(searchQuery);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 md:mt-28 w-full md:w-1/2 mx-auto px-4">
      {/* Instructional Text */}
      <p className="mb-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
        💡 Enter a movie-related prompt like “movies about time travel” or
        “comedy films like The Hangover”
      </p>

      {/* Search Bar */}
      <div className="flex w-full items-center space-x-2">
        <input
          ref={searchText}
          className="flex-grow rounded-full shadow-xl dark:bg-stone-800 dark:text-brand-beige bg-transparent px-4 py-2 text-sm dark:placeholder:text-neutral-500 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          type="text"
          placeholder={lang[selectedLanguage].gptSearchPlaceholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <button
          onClick={handleSearch}
          className="w-[100px] flex justify-center hover:bg-slate-700 bg-slate-800 font-semibold rounded-full text-white px-1 py-1"
        >
          <Search color="red" />
        </button>
      </div>
    </div>
  );
};

export default GPTSearchBar;

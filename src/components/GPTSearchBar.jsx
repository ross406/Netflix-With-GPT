import { useDispatch, useSelector } from "react-redux";
import lang from "../utils/languageConstants";
import { useRef, useState } from "react";
import axios from "axios";
import { API_OPTIONS, GEMINI_KEY } from "../utils/constants";
import { addGPTMovieResult, setLoading } from "../utils/gptSlice";
import { Search } from "lucide-react";

// Replace this with your Gemini API key
const GEMINI_API_KEY = GEMINI_KEY;

const GPTSearchBar = () => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector((store) => store?.config?.lang);
  const searchText = useRef("");
  const [fetchCount, setFetchCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

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

  const search = async (searchInput) => {
    if (fetchCount >= 2) {
      setShowModal(true);
      return;
    }

    try {
      setFetchCount((prev) => prev + 1);
      dispatch(setLoading(true));

      const geminiResponse = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
        {
          contents: [
            {
              parts: [
                {
                  text: searchInput, // your prompt
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
      

      const responseText =
        geminiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

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
      console.log("Gemini API error:", error);
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
    <div className='flex md:justify-around w-full ml-[70px] mt-10 md:mt-28 left-0 right-0 mb-9 items-center z-50 md:w-1/3 md:mx-auto'>
      <input
        ref={searchText}
        className='flex w-[280px] md:w-3/4 rounded-full shadow-xl dark:bg-stone-800 dark:text-brand-beige bg-transparent px-4 py-2 text-sm dark:placeholder:text-neutral-500 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
        type='text'
        placeholder={lang[selectedLanguage].gptSearchPlaceholder}
      />
      <button
        onClick={handleSearch}
        disabled={showModal}
        className='w-[100px] flex justify-center hover:bg-slate-700 bg-slate-800 font-semibold rounded-full text-white px-1 py-1'>
        {showModal ? (
          <div className='rounded-full px-4 py-2 bg-red-500'>
            <p>Limited</p>
          </div>
        ) : (
          <Search color='red' />
        )}
      </button>
    </div>
  );
};

export default GPTSearchBar;

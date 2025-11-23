import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // ⭐ Dark Mode State
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode(!darkMode);

  const handleGenerate = async () => {
    setLoading(true);
    setColors([]);

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "meta-llama/llama-3-8b-instruct",
          messages: [
            {
              role: "user",
              content: `Generate exactly 10 HEX color codes that strongly match the theme: "${prompt}".
              Return only valid HEX codes, separated by commas. No text, no explanation.`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const resultText = response.data.choices[0].message.content;
      const hexMatches = resultText.match(/#([A-Fa-f0-9]{6})/g);

      if (hexMatches) setColors(hexMatches);
      else setColors(["#D8BFD8", "#E0FFFF", "#FFE4C4"]);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const copyColor = (color, index) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1200);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start px-4 py-10 relative transition 
      ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-[#fef9c2] to-[#fcb69f] text-black"
      }`}
    >
      {/* ⭐ DARK MODE TOGGLE BUTTON ⭐ */}
      <button
        onClick={toggleTheme}
        className={`fixed top-5 right-5 px-4 py-2 rounded-xl font-semibold shadow-md transition 
          ${darkMode ? "bg-white text-black" : "bg-black text-white"}
        `}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* ⭐ SUPER SUJI CENTER FLOATING ⭐ */}
      <div className="w-full flex justify-center mb-4 pointer-events-none">
        <div className="relative w-44 h-34 animate-[fly_6s_ease-in-out_infinite]">
          <img
            src="/super-suji.png"
            alt="Suji"
            className="w-full h-full object-contain drop-shadow-xl"
          />

          {/* Sparkles */}
          <div className="absolute top-1 left-1 w-3 h-3 bg-yellow-300 rounded-full animate-[sparkle_1.5s_infinite]"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-yellow-200 rounded-full animate-[sparkle_1.2s_infinite]"></div>
        </div>
      </div>

      {/* Title */}
      <h1
        className={`text-4xl font-bold mb-4 text-center ${
          darkMode ? "text-white" : "text-[#7a1333]"
        }`}
      >
        AI Color Palette Generator
      </h1>

      {/* Input */}
      <input
        type="text"
        className={`w-full max-w-md border p-3 rounded mb-4 transition 
          ${
            darkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-pink-900 border-gray-300"
          }
        `}
        placeholder="Enter your theme (e.g - summer, sunset)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Button */}
      <button
        className={`px-6 py-2 rounded-xl shadow-md transition
          ${
            darkMode
              ? "bg-white text-black hover:shadow-lg"
              : "bg-[#8b0836] text-[#fef2f2] hover:shadow-[0_0_15px_#ff6467,0_0_35px_#ff6467]"
          }
        `}
        disabled={loading}
        onClick={handleGenerate}
      >
        {loading ? "Generating..." : "Generate palette"}
      </button>

      {/* Color Grid */}
      {colors.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
          {colors.map((color, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => copyColor(color, idx)}
            >
              <div
                className="w-20 h-20 rounded shadow-lg"
                style={{ backgroundColor: color }}
              ></div>

              <span
                className={`font-semibold ${
                  darkMode ? "text-white" : "text-[#4a1d1f]"
                }`}
              >
                {color}
              </span>

              {copiedIndex === idx && (
                <span
                  className={`text-sm font-semibold ${
                    darkMode ? "text-yellow-300" : "text-[#7a1333]"
                  }`}
                >
                  Copied!
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ⭐ PROFESSIONAL FOOTER ⭐ */}
      <footer
        className={`w-full mt-20 py-6 text-center rounded-xl shadow-md transition
        ${
          darkMode
            ? "bg-gray-800 text-gray-300"
            : "bg-white/20 backdrop-blur-lg text-[#4a1d1f]"
        }`}
      >
        <p className="font-semibold text-lg">AI Color Palette Generator</p>

        <div className="flex justify-center gap-6 mt-3 font-bold">
          <a
            href="https://github.com/sowmiyasoundar"
            target="_blank"
            className="hover:underline hover:text-pink-400 transition"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/sowmiya-soundar-766574259/"
            target="_blank"
            className="hover:underline hover:text-pink-400 transition"
          >
            LinkedIn
          </a>

          <a
            href="mailto:sowmiyasoundar20@gmail.com"
            className="hover:underline hover:text-pink-400 transition"
          >
            Contact
          </a>
        </div>

        <p className="mt-4 text-sm opacity-80">
          Developed by <span className="font-semibold">Sowmiya Soundar</span>
        </p>

        <p className="text-xs opacity-60 mt-1">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;

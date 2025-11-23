import React, { useState } from 'react';
import axios from 'axios';

const App = () => {

  const [prompt, setPrompt] = useState("");
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

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
              content: `Generate exactly 5 HEX color codes that strongly match the theme: "${prompt}". The colors must be realistic, meaningful, and most relevant to the theme. 
               Return valid HEX codes separated by commas.
               No text, no explanation.`
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
            "Content-Type": "application/json"
          }
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
    <div className="min-h-screen bg-gradient-to-r from-[#fef9c2] to-[#fcb69f]
    text-white flex flex-col items-center justify-center px-4 py-10 relative">

      <h1 className='text-[#7a1333] text-4xl font-bold mb-4 text-center'>
        AI Color Palette Generator
      </h1>

      <input
        type="text"
        className="w-full max-w-md border p-3 rounded bg-white text-pink-900 placeholder:text-pink mb-4"
        placeholder="Enter your theme (e.g - summer, sunset)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        className='bg-[#8b0836] text-[#fef2f2] px-6 py-2 rounded-xl shadow-md 
        hover:shadow-[0_0_15px_#ff6467,0_0_35px_#ff6467] transition'
        disabled={loading}
        onClick={handleGenerate}
      >
        {loading ? "Generating..." : "Generate palette"}
      </button>

      {colors.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-10'>
          {colors.map((color, idx) => (
            <div
              key={idx}
              className='flex flex-col items-center gap-1 cursor-pointer'
              onClick={() => copyColor(color, idx)}
            >
              <div
                className='w-20 h-20 rounded shadow-lg'
                style={{ backgroundColor: color }}
              ></div>

              <span className='text-[#4a1d1f] font-semibold'>{color}</span>

              {copiedIndex === idx && (
                <span className="text-[#7a1333] text-sm font-semibold">
                  Copied!
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ⭐ SUJI ANIMATION - ADD IMAGE IN public/suji.png ⭐ */}
      <div className="fixed bottom-20 right-1/4 w-38 h-38 animate-[fly_6s_infinite_ease-in-out]">
        <img
          src="/super-suji.png"
          alt="Suji"
          className="w-full h-full object-contain drop-shadow-xl"
        />

        {/* Sparkles */}
        <div className="absolute top-1 left-1 w-3 h-3 bg-yellow-300 rounded-full animate-[sparkle_1.5s_infinite]"></div>
        <div className="absolute bottom-3 right-2 w-2 h-2 bg-yellow-200 rounded-full animate-[sparkle_1.2s_infinite]"></div>
      </div>

    </div>
  );
};

export default App;

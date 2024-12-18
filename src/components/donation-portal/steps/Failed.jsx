import React, { useEffect } from "react";
import "../../../index.css"

const Failed = () => {
  
  useEffect(() => {
    // Load Tenor Embed Script
    const script = document.createElement("script");
    script.src = "https://tenor.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Transaction Failed</h2>

        <div className="text-white rounded-full w-12 h-12 mx-auto mb-4 flex justify-center items-center">
          <div
            className="tenor-gif-embed"
            data-postid="16261799211561498106"
            data-share-method="host"
            data-aspect-ratio="1"
            data-width="100%"
          >
            <a href="https://tenor.com/view/camp-dayz-no-gif-16261799211561498106">
              Camp Dayz No Sticker
            </a>
            from <a href="https://tenor.com/search/camp+dayz+no-stickers">Camp Dayz No Stickers</a>
          </div>
        </div>

        <p className="text-gray-700 mb-6">Order #123RGR231567Y</p>

        <button className="bg-[#02343F] hover:bg-[#02343fd9] text-white font-bold py-2 px-4 rounded w-full">
          <a href="/" className="text-white">
            Return Home
          </a>
        </button>
      </div>
    </div>
  );
};

export default Failed;

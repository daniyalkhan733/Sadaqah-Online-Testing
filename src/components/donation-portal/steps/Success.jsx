import React from "react";
import "../../../index.css";


const Success = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Thank You For Your Donation</h2>

        {/* <div className="text-white rounded-full w-12 h-12 mx-auto mb-4 flex justify-center items-center">
          <div
            className="tenor-gif-embed"
            data-postid="16677782"
            data-share-method="host"
            data-aspect-ratio="1.02564"
            data-width="100%"
          >
            <a href="https://tenor.com/view/check-green-white-background-gif-16677782">
              Check Green GIF
            </a>
            from <a href="https://tenor.com/search/check-gifs">Check GIFs</a>
          </div>
          <script async src="https://tenor.com/embed.js"></script>
        </div> */}

        <p className="text-gray-700 mb-6">Order #123RGR231567Y Confirmed</p>

        <button className="bg-[#02343F] hover:bg-[#02343fd9] text-white font-bold py-2 px-4 rounded w-full">
          <a href="/" className="text-white">
            Return Home
          </a>
        </button>

        <a
          href="/dashboard/reports"
          className="text-gray-500 hover:text-gray-700 text-sm block mt-4"
        >
          View Receipt
        </a>
      </div>
    </div>
  );
};

export default Success;

import React, { useEffect, useState } from "react";
import { URL } from "./constant";
import Answer from "./components/Answers";
import "./index.css";
import { IoMenuOutline } from "react-icons/io5";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history"))
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const payloadData = question ? question : selectedHistory;
  const payload = {
    contents: [
      {
        parts: [
          {
            text: payloadData,
          },
        ],
      },
    ],
  };

  const askQuestion = async () => {
    if (!question && !selectedHistory) return false;

    if (question) {
      const history = localStorage.getItem("history")
        ? [question, ...JSON.parse(localStorage.getItem("history"))]
        : [question];
      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);
    }

    setLoader(true);
    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    response = await response.json();

    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ").map((item) => item.trim());

    setResult([
      ...result,
      { type: "q", text: question ? question : selectedHistory },
      { type: "a", text: dataString },
    ]);
    setQuestion("");
    setLoader(false);
  };

  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };

  const isEnter = (e) => {
    if (e.key === "Enter") {
      askQuestion();
      setQuestion("");
    }
  };

  useEffect(() => {
    if (selectedHistory) {
      setQuestion(selectedHistory);
    }
  }, [selectedHistory]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          open ? "block" : "hidden"
        } md:block absolute md:relative w-[70%] md:w-[20%] bg-gray-900 text-white p-4 z-50`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={() => setOpen(false)}>✖</button>
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold mb-4">Recent History</h2>
          <button onClick={clearHistory}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#e3e3e3">
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
            </svg>
          </button>
        </div>
        <ul className="overflow-auto text-sm text-left">
          {recentHistory &&
            recentHistory.map((item, index) => (
              <li
                onClick={() => setSelectedHistory(item)}
                key={index + Math.random()}
                className="mb-2 pl-3 p-0.5 cursor-pointer rounded-md text-zinc-500 truncate hover:text-white hover:bg-[#1e2939]"
              >
                {item}
              </li>
            ))}
        </ul>
      </div>

      {/* Main Section */}
      <div className="w-full md:w-[80%] flex flex-col justify-between p-4 overflow-y-auto text-white">
        <div className="md:hidden mb-4">
          <IoMenuOutline
            className="text-white text-3xl cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>

        <h1 className="text-4xl text-center p-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700">
          Hello User, How can I help you
        </h1>

        {loader && (
          <div role="status" className="text-center p-2">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591..."
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624..."
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}

        <div className="overflow-y-auto hide-scroll-bar flex-1">
          <ul>
            {result.map((item, index) => (
              <div className={item.type === "q" ? "flex justify-end" : ""}>
                {item.type === "q" ? (
                  <li
                    key={index + Math.random()}
                    className="text-right p-1 border-8 bg-zinc-700 border-zinc-700 w-fit rounded-tl-3xl rounded-br-3xl rounded-bl-3xl"
                  >
                    <Answer ans={item.text} index={index} totalResult={1} type={item.type} />
                  </li>
                ) : (
                  item.text.map((ansItem, ansIndex) => (
                    <li
                      key={ansIndex + Math.random()}
                      className="text-left p-1 w-[70%]"
                    >
                      <Answer ans={ansItem} index={ansIndex} totalResult={item.length} type={item.type} />
                    </li>
                  ))
                )}
              </div>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex">
          <input
            onKeyDown={isEnter}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            type="text"
            className="flex-1 p-2 outline-none rounded-l-md bg-gray-800 text-white border-1 border-gray-700"
            placeholder="Ask Gemini..."
          />
          <button
            onClick={askQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { useImmer } from "use-immer";
import { calculateMMRs } from "../mmr";

const inter = Inter({ subsets: ["latin"] });

function random(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export default function Home() {
  const [MMRs, setMMRs] = useImmer(Array.from(Array(8).fill(0)));
  const [newMMRs, setNewMMRs] = useImmer(Array.from(Array(8).fill(0)));
  const [maxMMR, setMaxMMR] = useState(10000);
  const [minMMR, setMinMMR] = useState(0);
  const [gameId, setGameId] = useState("");

  function generateRandomMMR() {
    setMMRs(Array.from(Array(8), () => random(minMMR, maxMMR)));
  }

  useEffect(() => {
    setNewMMRs(calculateMMRs(MMRs));
  }, [MMRs, setNewMMRs]);

  const diff = MMRs.map((mmr, rank) => newMMRs[rank] - mmr);

  const avg = Math.round(MMRs.reduce((a, b) => a + b) / MMRs.length);

  function fetchFromGame() {
    fetch(`api/mmrs/${gameId}`)
      .then((response) => response.json())
      .then((res) => {
        if (Array.isArray(res) && res.length === 8) {
          setMMRs(res);
          return;
        }
        alert("something went wrong");
      })
      .catch((e) => alert("something went wrong"));
  }

  return (
    <>
      <Head>
        <title>AA MMR calculator</title>
        <meta
          name="description"
          content="Ability arena MMR system suggestion"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-200 flex flex-row h-screen">
        <aside className="w-64 p-2 border-right bg-white">
          <h3 className="text-center my-4 text-xl">Settings</h3>

          <div id="generate-random-mmr" className="space-y-1">
            <label htmlFor="min-mmr">Start MMR</label>
            <input
              className="rounded py-2 text-center border-2 w-full"
              id="min-mmr"
              type="number"
              value={minMMR}
              placeholder="min mmr"
              min="0"
              onChange={(e) => setMinMMR(Number(e.target.value))}
            />
            <label htmlFor="max-mmr">End MMR</label>
            <input
              className="rounded py-2 text-center border-2 w-full"
              id="max-mmr"
              type="number"
              value={maxMMR}
              max="10000"
              onChange={(e) => setMaxMMR(Number(e.target.value))}
            />
            <button
              className="bg-green-400 text-white rounded w-full p-2"
              onClick={generateRandomMMR}
            >
              Generate random MMR
            </button>
          </div>

          <div className="my-4 space-y-1">
            <h3 className="text-lg">Fetch from real game</h3>
            <label htmlFor="game-id">Game ID</label>
            <input
              className="rounded py-2 text-center border-2 w-full"
              id="game-id"
              type="text"
              placeholder="game id"
              onChange={(e) => setGameId(e.target.value)}
            />
            <button
              className="bg-green-400 text-white rounded w-full p-2"
              onClick={fetchFromGame}
            >
              fetch
            </button>
          </div>
        </aside>

        <section className="container flex flex-col h-full items-center">
          <h1 className="text-3xl text-center py-2">
            Ability Arena MMR Calculator
          </h1>

          <div className="container mx-auto">
            <div className="my-8">
              <h3 className="text-center text-2xl">Start MMR</h3>
              <div className="flex flex-row space-x-2 justify-center">
                {MMRs.map((mmr, index) => (
                  <input
                    className="w-32 text-center border rounded py-2"
                    key={`mmr${index}`}
                    type="number"
                    value={mmr}
                    onChange={(e) =>
                      setMMRs((mmrs) => {
                        mmrs[index] = e.target.value;
                      })
                    }
                  />
                ))}
              </div>
            </div>
            <div className="my-8">
              <div>
                <p className="text-2xl text-center">average MMR</p>
                <p className="text-xl text-center text-blue-400">{avg}</p>
              </div>
            </div>
            <h3 className="text-center text-2xl">End MMR</h3>
            <div className="flex flex-row space-x-2 justify-center">
              {newMMRs.map((mmr, rank) => (
                <div className="flex flex-col space-y-2" key={`old-mmr${rank}`}>
                  <p
                    className={`text-center ${
                      diff[rank] > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {diff[rank] > 0 ? "+" : "-"} {Math.abs(diff[rank])}
                  </p>
                  <input
                    disabled
                    className="w-32 text-center border rounded py-2 disabled:bg-white"
                    type="number"
                    value={mmr}
                  />
                  <p className="text-center">{mmr - avg}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

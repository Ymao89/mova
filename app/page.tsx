"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "こんにちは！世界最高峰の万能次世代AI SaaS「MOVA（モバ）」へようこそ。\n本日はどのようなご用件でしょうか？ビジネス戦略の策定、プログラミングやシステム設計、学術的なリサーチ、クリエイティブな文章作成など、あらゆる分野において最高水準のサポートをご提供いたします。\nどうぞお気軽にお申し付けください。",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "通信エラーが発生しました。" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-slate-950 text-white">
      {/* ヘッダー：確実にクリックしてページ遷移できるボタン */}
      <header className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
        <h1 className="text-xl font-bold text-indigo-400">MOVA AI SaaS</h1>
        <button
          onClick={() => router.push("/pricing")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all cursor-pointer shadow-md shadow-indigo-600/30"
        >
          料金プランを見る →
        </button>
      </header>

      {/* チャットメッセージ表示エリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl w-full mx-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 whitespace-pre-wrap text-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl p-4 text-sm animate-pulse">
              MOVAが思考中...
            </div>
          </div>
        )}
      </div>

      {/* 入力フォーム */}
      <form
        onSubmit={sendMessage}
        className="p-4 border-t border-slate-800 bg-slate-900/50 max-w-4xl w-full mx-auto flex gap-2"
      >
        <input
          type="text"
         value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="質問を入力、または「猫の画像を作って」..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm cursor-pointer"
        >
          送信
        </button>
      </form>
    </main>
  );
}
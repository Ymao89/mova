"use client";

import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (planName: string) => {
    try {
      setLoadingPlan(planName);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Stripeの決済ページへ移動
      } else {
        alert(data.error || "決済ページの作成に失敗しました。");
      }
    } catch (err) {
      alert("エラーが発生しました。");
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "¥0",
      period: "/月",
      description: "基本機能を試したい方向け",
      features: [
        "標準AIテキスト応答",
        "1日10回までのメッセージ",
        "基本的な画像生成",
      ],
      buttonText: "現在のプラン",
      buttonStyle: "bg-slate-800 text-slate-400 cursor-not-allowed",
      highlight: false,
      onClick: () => {},
      disabled: true,
    },
    {
      name: "Pro",
      price: "¥980",
      period: "/月",
      description: "日常的・ビジネスで本格活用したい方向け",
      features: [
        "高度なAIテキスト応答（無制限）",
        "高品質な画像生成（高解像度）",
        "混雑時の優先レスポンス",
        "最新モデルへのアクセス",
      ],
      buttonText: loadingPlan === "Pro" ? "処理中..." : "Proにアップグレード",
      buttonStyle:
        "bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer shadow-lg shadow-indigo-600/30",
      highlight: true,
      onClick: () => handleCheckout("Pro"),
      disabled: loadingPlan !== null,
    },
    {
      name: "Enterprise",
      price: "¥2,980",
      period: "/月",
      description: "ビジネスやプロの制作で限界突破したい方向け",
      features: [
        "Proプランの全機能",
        "最高精度の最高峰頭脳（最優先アクセス）",
        "超高速処理＆長文応答の無制限化",
        "24時間優先サポート",
      ],
      buttonText: loadingPlan === "Enterprise" ? "処理中..." : "Enterpriseを選択",
      buttonStyle:
        "bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer shadow-lg shadow-purple-600/30",
      highlight: false,
      onClick: () => handleCheckout("Enterprise"),
      disabled: loadingPlan !== null,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      {/* 戻るボタンヘッダー */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-slate-400 hover:text-white text-sm font-semibold flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-all"
        >
          ← チャット画面に戻る
        </Link>
        <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1 rounded-full">
          MOVA Premium Plans
        </span>
      </div>

      {/* タイトルエリア */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
          シンプルで透明な料金プラン
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          あなたのニーズに合わせて最適なプランをお選びいただけます。いつでも変更・キャンセルが可能です。
        </p>
      </div>

      {/* カード一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
              plan.highlight
                ? "bg-slate-900/90 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 md:-translate-y-2"
                : "bg-slate-900/50 border border-slate-800"
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold py-1 px-4 rounded-full shadow-md">
                一番人気
              </span>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <p className="text-slate-400 text-xs mb-6 h-10">
                {plan.description}
              </p>

              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-slate-400 text-sm ml-1">
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li
                    key={fIndex}
                    className="flex items-center text-sm text-slate-300"
                  >
                    <span className="text-indigo-400 mr-2 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={plan.onClick}
              disabled={plan.disabled}
              className={`w-full py-3.5 rounded-xl transition-all text-sm ${plan.buttonStyle}`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
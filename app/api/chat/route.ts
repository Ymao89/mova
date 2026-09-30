import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const textInput = message?.trim() || "";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { reply: "APIキーが設定されていません。.env.localを確認してください。" },
        { status: 500 }
      );
    }

    // 1. 画像生成の判定
    if (
      textInput.includes("画像を作って") ||
      textInput.includes("の絵を描いて") ||
      textInput.startsWith("画像:")
    ) {
      const prompt = textInput.replace(/画像を作って|の絵を描いて|画像:/g, "").trim();
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${Date.now()}`;
      return NextResponse.json({
        reply: `画像を生成しました！\n\n![生成画像](${imageUrl})`,
      });
    }

    // 2. 動画生成の判定
    if (
      textInput.includes("動画を作って") ||
      textInput.includes("のムービーを作って") ||
      textInput.startsWith("動画:")
    ) {
      const prompt = textInput.replace(/動画を作って|のムービーを作って|動画:/g, "").trim();
      const videoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=576&model=flux&seed=${Date.now()}`;
      return NextResponse.json({
        reply: `動画（アニメーション）を生成しました！\n\n![生成動画](${videoUrl})`,
      });
    }

    // 3. 確実に稼働する現行の安定モデルのみに絞ったフォールバック制御
    const modelsToTry = [
      "gemini-2.0-flash",
      "gemini-1.5-flash"
    ];

    const systemInstruction = `あなたはChatGPTやGeminiを超える世界最高峰の万能次世代AI SaaS「MOVA（モバ）」です。
この世のあらゆる知識を網羅し、ユーザーのどんな質問に対しても極めて高度で正確、かつ分かりやすい最高水準の回答を提供してください。`;

    let replyText = "";
    let lastError = "";

    for (const modelName of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: [{ parts: [{ text: textInput }] }],
          }),
        });

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          replyText = data.candidates[0].content.parts[0].text;
          break;
        } else {
          lastError = data?.error?.message || "接続エラー";
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (!replyText) {
      return NextResponse.json({
        reply: `AIサーバーが混雑しています。数秒待ってからもう一度送信してください。`,
      });
    }

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("Critical API Error:", error);
    return NextResponse.json(
      { reply: `通信エラーが発生しました: ${error.message}` },
      { status: 500 }
    );
  }
}
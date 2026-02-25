"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";

type Entry = {
  id: string;
  title: string;
  body: string;
  likes: number;
  dateISO: string;
};

const seed: Entry[] = [
  {
    id: "1",
    title: "朝の空にありがとう☀️",
    body: "窓を開けたら、やわらかい風。今日はもういい日♡",
    likes: 12,
    dateISO: new Date().toISOString(),
  },
  {
    id: "2",
    title: "レモン色の気持ち🍋",
    body: "さわやかな香りで、心がふわっと軽くなるよ。",
    likes: 8,
    dateISO: new Date().toISOString(),
  },
];

function formatJa(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function DiaryDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const data = seed.find((x) => x.id === id);

  if (!data) {
    return (
      <>
        <Header />
        <main className="container">
          <div className="card" style={{ padding: 20 }}>
            <h2>記事が見つかりません</h2>
            <Link href="/" className="btn">
              ← ホームへ
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container">
        <section className="card heroWrap kira" style={{ padding: 18 }}>
          <div className="heroBg" />
          <div style={{ position: "relative" }}>
            <div className="pill">📝 記事</div>

            <h1 className="heroTitle" style={{ fontSize: 32 }}>
              <span>{data.title}</span>
            </h1>

            <div className="meta">
              📅 {formatJa(data.dateISO)}　♡ {data.likes}
            </div>

            <div
              className="card"
              style={{
                padding: 16,
                marginTop: 16,
                background: "rgba(255,255,255,.9)",
              }}
            >
              <div className="pill">💬 今日のハッピー</div>
              <p style={{ whiteSpace: "pre-wrap", marginTop: 10 }}>
                {data.body}
              </p>
            </div>

            <div style={{ marginTop: 16 }}>
              <Link href="/" className="btn2">
                ← ホームに戻る
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
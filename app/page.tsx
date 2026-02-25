"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function HomePage() {
  const [items, setItems] = useState<Entry[]>([]);

  useEffect(() => {
    setItems(seed);
  }, []);

  return (
    <>
      <Header />
      <main className="container">
        <section className="card heroWrap kira" style={{ padding: 18 }}>
          <div className="heroBg" />
          <div style={{ position: "relative" }}>
            <h1 className="heroTitle">
              <span>ふわキラ日記🎀</span>
            </h1>
            <p className="heroText">
              小さな幸せを集める、やさしい毎日の記録。
            </p>
          </div>
        </section>

        <section style={{ marginTop: 20 }}>
          <div className="sectionTitle">
            <h2 className="kira">✨ 最新記事</h2>
          </div>

          <div className="grid">
            {items.map((x) => (
              <Link
                key={x.id}
                href={`/diary/${x.id}`}
                className="card"
                style={{ padding: 16 }}
              >
                <div className="postTitle">💞 {x.title}</div>
                <div className="postMeta">
                  <span>📅 {formatJa(x.dateISO)}</span>
                  <span>♡ {x.likes}</span>
                </div>
                <p className="postSnippet" style={{ marginTop: 8 }}>
                  {x.body}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
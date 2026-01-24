import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami - MainDiHatta.id",
  description: "Pelajari lebih lanjut tentang MainDiHatta.id dan visi kami dalam industri penyewaan lapangan olahraga.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

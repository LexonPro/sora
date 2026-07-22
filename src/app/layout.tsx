import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SORA | Wear Your Universe",
  description:
    "Premium anime and streetwear for the next generation. Original designs, surgical-grade materials, uncompromising craft.",
  openGraph: {
    title: "SORA | Wear Your Universe",
    description: "Premium anime and streetwear for the next generation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

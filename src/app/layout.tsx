import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { HUDOverlay } from "@/components/HUDOverlay";

export const metadata: Metadata = {
  title: "SORA | Wear Your Universe",
  description: "Premium technical streetwear designed beyond limits. Explorable 3D apparel showroom, AI styling recommendation systems, and active drop collections.",
  openGraph: {
    title: "SORA | Wear Your Universe",
    description: "Premium technical streetwear designed beyond limits.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      style={{ colorScheme: "dark" }}
    >
      <body className="font-sans bg-[#0D0D0D] text-white min-h-screen relative hud-grid selection:bg-accent-blue selection:text-white">
        {/* Retro scanline overlay filter */}
        <div className="scanlines" aria-hidden="true" />
        
        {/* Persistent Technical HUD Overlays */}
        <HUDOverlay />
        
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}


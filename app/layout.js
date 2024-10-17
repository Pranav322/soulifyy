import localFont from "next/font/local";
import "./globals.css";
// import Header from "./Header";
import Header from "./Header";
// import AudioPlayerProvider from "./contexts/AudioPlayerContext";
import { AudioPlayerProvider } from "./context/AudioPlyerContext";
import PersistentPlayer from "./components/PersistentPlayer";
import { LikedSongsProvider } from "./context/LikedSongContext";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "soulify",
  description: "created by pranav",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-gray-100">
      <AudioPlayerProvider>
  <LikedSongsProvider>
    <Header />
    <main className="pt-16 px-4 sm:px-6 lg:px-8">
      {children}
    </main>
    <PersistentPlayer />
  </LikedSongsProvider>
</AudioPlayerProvider>
      </body>
    </html>
  );
}
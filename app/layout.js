import localFont from "next/font/local";
import "./globals.css";
// import Header from "./Header";
import Header from "./Header";
// import AudioPlayerProvider from "./contexts/AudioPlayerContext";
import { AudioPlayerProvider } from "./context/AudioPlyerContext";
import PersistentPlayer from "./components/PersistentPlayer";
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
    <html lang="en">
      <body
      //   className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AudioPlayerProvider>
        <Header />
        <main className="pt-16">
          {children}
          </main>
          <PersistentPlayer />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}

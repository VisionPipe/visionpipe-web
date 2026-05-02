import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Code_Pro } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vision|Pipe — Give your LLM eyes",
  description:
    "Vision|Pipe gives your LLM eyes. Capture your screen, annotate with voice, text, or drawing, and paste full visual context into any AI in one keystroke. Open source, cross-platform, keyboard-first.",
  openGraph: {
    title: "Vision|Pipe — Give your LLM eyes",
    description:
      "Screenshot to AI in one keystroke. Capture any screen region, annotate it with voice, text, or drawing, and pipe it directly into Claude Code, OpenAI Codex, or any LLM.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${ibmPlexSans.variable} ${sourceCodePro.variable}`}
      >
        <body className="font-sans antialiased">
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "./components/UserContext";
import { PostProvider } from "./components/HomePostsContext";
import { i18n } from "next-i18next";
import { useEffect } from "react";
import { ThemeProvider } from "./components/ThemeContext";

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_API}`),
  title: "Quetzer - Home",
  description: "Welcome to Quetzer !",
  creator: "Quetzer Team",
  publisher: "Quetzer Team",
  twitter: {
    card: "summary",
    title: "Quetzer - Home",
    description: "Welcome to Quetzer !",
    images: {
      url: '/quetzer-hello.png',
      width: 500,
      height: 500,
    },
  },
  icons: {
    icon: "/quetzer-hello.png",
  },
  openGraph: {
    title: 'Quetzer - Home',
    description: 'Welcome to Quetzer !',
    images: {
      url: '/quetzer-hello.png',
      width: 500,
      height: 500,
    },
    type: "website",
    siteName: "Quetzer",
    url: `${process.env.NEXT_PUBLIC_API}`,
  },
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html suppressHydrationWarning>
      <UserProvider>
        <PostProvider>
          <UserProvider>
            <body suppressHydrationWarning className="">
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </body>
          </UserProvider>
        </PostProvider>
      </UserProvider>
    </html>
  );
}

export default RootLayout
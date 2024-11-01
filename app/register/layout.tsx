import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_API}`),
  title: `Quetzer - Register`,
  description: `Create an account on Quetzer`,
  creator: `Quetzer Team`,
  publisher: "Quetzer Team",
  twitter: {
    card: "summary",
    title: `Quetzer - Register`,
    description: `Create an account on Quetzer`,
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
    title: `Quetzer - Register`,
    description: `Create an account on Quetzer`,
    images: {
      url: '/quetzer-hello.png',
      width: 500,
      height: 500,
    },
    type: "profile",
    siteName: "Quetzer",
    url: `${process.env.NEXT_PUBLIC_API}/register`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-800">{children}</body>
    </html>
  );
}

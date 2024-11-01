import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Quetzer - Me",
  description: "See, update and delete your profile",
  icons: {
    icon: "/quetzer-hello.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">{children}</body>
    </html>
  );
}

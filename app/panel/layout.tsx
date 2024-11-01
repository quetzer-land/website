import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Quetzer - Panel",
    description: "Are you an admin ?!",
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

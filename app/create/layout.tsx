import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Quetzer - Create",
    description: "Create posts like a pro !",
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
            <body className="" suppressHydrationWarning>{children}</body>
        </html>
    );
}

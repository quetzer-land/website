import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_API}`),
    title: `Quetzer - About`,
    description: `Learn more about Quetzer and secret features`,
    creator: `Quetzer Team`,
    publisher: "Quetzer Team",
    twitter: {
        card: "summary",
        title: `Quetzer - About`,
        description: `Learn more about Quetzer and secret features`,
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
        title: `Quetzer - About`,
        description: `Learn more about Quetzer and secret features`,
        images: {
            url: '/quetzer-hello.png',
            width: 500,
            height: 500,
        },
        type: "article",
        siteName: "Quetzer",
        url: `${process.env.NEXT_PUBLIC_API}/about`,
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

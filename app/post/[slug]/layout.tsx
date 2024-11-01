import type { Metadata } from "next";
import "../../globals.css";
import { customFetch } from "@/app/utils/functions_utils";
import { UserProvider } from "@/app/components/UserContext";

async function fetchData(slug: string) {
    try {
        const res = await customFetch(
            `${process.env.NEXT_PUBLIC_API}/posts/${slug}`,
            "GET"
        );

        if (!res.ok) {
            const errorResponse = await res.json();
            if (errorResponse.errors && errorResponse.errors.length > 0) {
                const errorMessage =
                    errorResponse.errors[0].message ||
                    "Erreur lors de la récupération du post";
            } else {
            }
            return;
        }

        const postData: Post = await res.json();
        return postData

    } catch (error) {
    }
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const post = await fetchData(params.slug);
    return {
        metadataBase: new URL(`${process.env.NEXT_PUBLIC_API}`),
        title: `Quetzer - ${post ? post.title : params.slug}`,
        description: `${post?.description}`,
        creator: `${post?.author.username}`,
        publisher: "Quetzer Team",
        twitter: {
            card: "summary",
            title: `Quetzer - ${post ? post.title : params.slug}`,
            description: `${post?.description}`,
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
            title: `Quetzer - ${post ? post.title : params.slug}`,
            description: `${post?.description}`,
            images: {
                url: '/quetzer-hello.png',
                width: 500,
                height: 500,
            },
            type: "article",
            siteName: "Quetzer",
            url: `${process.env.NEXT_PUBLIC_API}/post/${post?.slug}`,
        },
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <UserProvider>
                <body className="">{children}</body>
            </UserProvider>
        </html>
    );
}

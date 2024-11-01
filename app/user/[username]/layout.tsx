import type { Metadata } from "next";
import "../../globals.css";
import { customFetch } from "@/app/utils/functions_utils";
import { UserProvider } from "@/app/components/UserContext";

async function fetchUser(username: string): Promise<User | null> {
  const res = await customFetch(
    `${process.env.NEXT_PUBLIC_API}/users/${username}`
  );

  if (!res.ok) {
    return null;
  }

  const userData: User = await res.json();
  return userData;
}

async function fetchUserImage(username: any, id: any): Promise<string> {
  const response = await customFetch(
    `${process.env.NEXT_PUBLIC_API}/users/${username}/image/${id}`,
    "GET"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch post image");
  }
  return response.url;
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const user = await fetchUser(params.username);
  // const image = await fetchUserImage(params.username, user?.id);
  return {
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_API}`),
    title: `Quetzer - ${user ? user.username : params.username}`,
    description: `${user?.biography}`,
    creator: `${user?.username}`,
    publisher: "Quetzer Team",
    twitter: {
      card: "summary",
      title: `Quetzer - ${user ? user.username : params.username}`,
      description: `${user?.biography}`,
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
      title: `Quetzer - ${user ? user.username : params.username}`,
      description: `${user?.biography}`,
      images: {
        url: '/quetzer-hello.png',
        width: 500,
        height: 500,
      },
      type: "profile",
      siteName: "Quetzer",
      url: `${process.env.NEXT_PUBLIC_API}/user/${user?.username}`,
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

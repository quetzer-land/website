"use client";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import ThemeInitializer from "../components/ThemeInitializer";
import { customFetch, findPermissions, getHumanDate } from "../utils/functions_utils";
import { useEffect, useState } from "react";
import Notification from "../components/Notification";
import Image from "next/image";
import { useUser } from "../components/UserContext";

export default function Me() {
    const [notification, setNotification] = useState<{
        message: string;
        status: "success" | "error";
    } | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const res = await customFetch(
                `${process.env.NEXT_PUBLIC_API}/find-admin`,
                "GET"
            );

            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        }
        fetchUser();
    }, []);

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

    const [userImage, setUserImageUrl] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [userPage, setUser] = useState<User | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (userPage && userPage.id) {
            fetchUserImage(userPage.username, userPage.id)
                .then((url) => setUserImageUrl(url))
                .catch((error) => console.error(error));
        }
        console.log(imageUrl);
        setMounted(true);
    }, [userPage]);

    const defaultImageUrl = "/quetzer-front.png";

    const { user } = useUser();

    return (
        mounted && userPage && (
            <div className="bg-white dark:bg-slate-800 min-h-screen">
                <ThemeInitializer />
                <main className="flex items-center justify-center">
                    <div className="w-11/12 sm:w-4/5 lg:w-3/4 max-w-screen-lg min-h-screen p-8 bg-secondWhite-50 dark:bg-slate-900">
                        <Navbar />
                        <div className="text-black dark:text-white">
                            <h1 className="text-center text-3xl">Quetzer</h1>
                            <div className="flex justify-between my-10 mx-5 lg:mx-28 xl:mx-48">
                                <Link href={"https://github.com"} target="_blank" className="text-primary duration-150 hover:text-hover hover:underline text-2xl">Source code</Link>
                                <Link href={"https://github.com"} target="_blank" className="text-primary duration-150 hover:text-hover hover:underline text-2xl">About</Link>
                            </div>
                            <h2 className="text-center text-3xl">This instance</h2>
                            <div className="flex justify-between items-center my-10 mx-5 lg:mx-28 xl:mx-48">
                                <Link href={`${process.env.NEXT_PUBLIC_API}/rss`} target="_blank" className="text-primary duration-150 hover:text-hover hover:underline text-2xl">RSS Feed</Link>
                                <div>
                                    <h2 className="text-center text-2xl">Instance's admin</h2>
                                    <div className="flex justify-center my-5">
                                        <Link className="text-xl sm:text-2xl md:text-3xl xl:text-4xl text-primary duration-100 hover:text-hover hover:underline" href={`/user/${userPage.username}`}>@{userPage.username}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {notification && (
                            <Notification
                                message={notification.message}
                                onClose={() => setNotification(null)}
                                status={notification.status}
                            />
                        )}
                    </div>
                </main>
            </div>
        )

    )
}

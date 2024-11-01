"use client";
import { useEffect, useState } from "react";
import Notification from "../components/Notification";
import { Navbar } from "../components/Navbar";
import {
    customFetch,
    findPermissions,
    getHumanDate,
    truncateContent,
} from "../utils/functions_utils";
import Image from "next/image";
import { useUser } from "../components/UserContext";
import Link from "next/link";
import Loading from "../components/Loading";
import ThemeInitializer from "../components/ThemeInitializer";
import { redirect } from "next/navigation";

export default function Me() {
    const [allusers, setAllUsers] = useState<User[]>([]);
    const [loadingUsers, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [notification, setNotification] = useState<{
        message: string;
        status: "success" | "error";
    } | null>(null);

    async function changePermission(id: number, permission: number): Promise<string> {
        const response = await customFetch(
            `${process.env.NEXT_PUBLIC_API}/admin/update/${id}/${permission}`,
            "POST"
        );
        if (!response.ok) {
            throw new Error("Failed");
        }

        setNotification({
            message: `L'utilisateur est bien devenu ${findPermissions(permission)}`,
            status: "success",
        });
        fetchUsers()
        return ""
    }

    async function fetchUserImage(username: string, id: number): Promise<string> {
        const response = await customFetch(
            `${process.env.NEXT_PUBLIC_API}/users/${username}/image/${id}`,
            "GET"
        );
        if (!response.ok) {
            throw new Error("Failed to fetch users image");
        }
        setImageUrl(response.url)
        return response.url;
    }

    async function fetchUsers(page: number = 1) {
        try {
            setLoading(true);
            const res = await customFetch(
                `${process.env.NEXT_PUBLIC_API}/admin/list`,
                "GET"
            );

            if (!res.ok) {
                const errorResponse = await res.json();
                const errorMessage =
                    errorResponse.message || "Erreur lors de la récupération des utilisateurs";
                throw new Error(errorMessage);
            }

            const responseData = await res.json();
            const usersData: User[] = responseData;
            console.log(usersData)

            if (usersData.length > 0) {
                const usersWithImages = await Promise.all(
                    usersData.map(async (user) => {
                        if (user.pp !== null) {
                            const imageUrl = await fetchUserImage(user.username, user.id);
                            return { ...user, imageUrl };
                        }
                        return { ...user, imageUrl: defaultImageUrl }; // Ajout d'un URL par défaut si pas d'image
                    })
                );
                setAllUsers(usersWithImages);
            } else {
                throw new Error("Aucun post trouvé");
            }

        } catch (error) {
            setNotification({
                message: `Erreur lors de la récupération des posts : ${error}`,
                status: "error",
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const { user, loading } = useUser();

    const defaultImageUrl = "/quetzer-front.png";

    return (
        loading !== true && loadingUsers !== true &&
        user && (
            <div className="bg-white dark:bg-slate-800 min-h-screen">
                <ThemeInitializer />
                <main className="flex items-center justify-center">
                    <div className="w-11/12 sm:w-4/5 lg:w-3/4 max-w-screen-lg min-h-screen p-8 bg-secondWhite-50 dark:bg-slate-900">
                        <Navbar />
                        <div className="text-black dark:text-white grid md:grid-cols-2 xl:grid-cols-3">
                            {loading === false ? (
                                allusers.map((userPage) => (
                                    <div className="my-5 md:my-0">
                                        <div className="flex justify-center">
                                            <Image
                                                src={userPage.imageUrl || defaultImageUrl}
                                                width={150}
                                                height={150}
                                                alt="Avatar of user"
                                                className="rounded-full border-2"
                                            />
                                        </div>
                                        <div className="">
                                            <div className="text-center">
                                                <h1 className="text-4xl font-bold my-5">{userPage.username}</h1>
                                            </div>
                                            <div>
                                                {userPage.permission === 0 && (
                                                    <div className="flex justify-center">
                                                        <button onClick={() => { changePermission(userPage.id, 1) }} className="bg-primary text-xl duration-100 hover:bg-hover rounded-2xl p-2 text-black mx-2">Writer</button>
                                                        <button onClick={() => { changePermission(userPage.id, 2) }} className="bg-red-200 text-xl duration-100 hover:bg-red-100 rounded-2xl p-2 text-black mx-2">Mod</button>
                                                    </div>
                                                )}
                                                {userPage.permission === 1 && (
                                                    <div className="flex justify-center">
                                                        <button onClick={() => { changePermission(userPage.id, 0) }} className="bg-secondWhite-200 text-xl duration-100 hover:bg-secondWhite-100 rounded-2xl p-2 text-black mx-2">Membre</button>
                                                        <button onClick={() => { changePermission(userPage.id, 2) }} className="bg-red-200 text-xl duration-100 hover:bg-red-100 rounded-2xl p-2 text-black mx-2">Mod</button>
                                                    </div>
                                                )}
                                                {userPage.permission === 2 && (
                                                    <div className="flex justify-center">
                                                        <button onClick={() => { changePermission(userPage.id, 0) }} className="bg-secondWhite-200 text-xl duration-100 hover:bg-secondWhite-100 rounded-2xl p-2 text-black mx-2">Membre</button>
                                                        <button onClick={() => { changePermission(userPage.id, 1) }} className="bg-primary text-xl duration-100 hover:bg-hover rounded-2xl p-2 text-black mx-2">Writer</button>
                                                    </div>
                                                )}
                                                {userPage.permission === 3 && (
                                                    <div className="flex justify-center">
                                                        <button className="bg-black text-xl rounded-2xl p-2 text-white border border-white mx-2">Admin</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Loading />
                            )}
                            {notification && (
                                <Notification
                                    message={notification.message}
                                    onClose={() => setNotification(null)}
                                    status={notification.status}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        )
    );
}

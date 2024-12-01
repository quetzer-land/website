"use client";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { customFetch } from "../utils/functions_utils";
import { useState } from "react";
import Notification from "../components/Notification";
import ThemeInitializer from "../components/ThemeInitializer";

export default function Login() {
    const [notification, setNotification] = useState<{
        message: string;
        status: "success" | "error";
    } | null>(null);

    const [email, setEmail] = useState("")

    async function login(e: any) {
        e.preventDefault();

        const res = await customFetch(
            `${process.env.NEXT_PUBLIC_API}/auth/forgot-password/${email}`,
            "POST",
        );

        if (!res.ok) {
            const errorResponse = await res.json();
            if (errorResponse.errors && errorResponse.errors.length > 0) {
                const errorMessage =
                    errorResponse.errors[0].message || "Erreur lors de la modification";
                setNotification({
                    message: errorMessage,
                    status: "error",
                });
            } else {
                setNotification({
                    message: "Erreur lors de la modification",
                    status: "error",
                });
            }
            return;
        }

        setNotification({
            message: "Mot de passe changé ! Regardez vos mails !",
            status: "success",
        });
        setTimeout(() => location.assign("/"), 2000);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    return (
        <div className="bg-white dark:bg-slate-800 min-h-screen">
            <ThemeInitializer />
            <main className="flex items-center justify-center h-screen">
                <div className="w-11/12 sm:w-4/5 lg:w-3/4 max-w-screen-lg min-h-screen p-8 bg-secondWhite-50 dark:bg-slate-900">
                    <Navbar />
                    <div className="flex min-h-full flex-col justify-center px-6 pb-12 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                                Oops... you forgot your password ?
                            </h2>
                        </div>

                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form className="space-y-6" action="" onSubmit={login}>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                                    >
                                        Enter your email
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            name="email"
                                            id="email"
                                            value={email}
                                            onChange={handleChange}
                                            type="text"
                                            autoComplete="off"
                                            required
                                            className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500 dark:placeholder:opacity-100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full duration-200 hover:rounded-2xl justify-center rounded-md shadow-primary bg-gradient-to-l from-hover via-primary to-hover px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                    >
                                        Change your password
                                    </button>
                                </div>
                            </form>
                            <p className="text-center my-5 text-black dark:text-white">After entering your mail, you will receive an email with the new password, Remember to check your spam !</p>

                            <p className="mt-10 text-center text-sm text-black dark:text-white">
                                You remember your password ?{" "}
                                <Link
                                    href="/login"
                                    className="font-semibold duration-150 leading-6 text-primary hover:text-hover"
                                >
                                    Login !
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            {notification && (
                <Notification
                    message={notification.message}
                    onClose={() => setNotification(null)}
                    status={notification.status}
                />
            )}
        </div>
    );
}

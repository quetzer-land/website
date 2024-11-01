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

  async function login(e: any) {
    e.preventDefault();

    const res = await customFetch(
      `${process.env.NEXT_PUBLIC_API}/auth/login`,
      "POST",
      new FormData(document.querySelector("form") as HTMLFormElement),
      false
    );

    if (!res.ok) {
      const errorResponse = await res.json();
      if (errorResponse.errors && errorResponse.errors.length > 0) {
        const errorMessage =
          errorResponse.errors[0].message || "Erreur lors de la connexion";
        setNotification({
          message: errorMessage,
          status: "error",
        });
      } else {
        setNotification({
          message: "Erreur lors de la connexion",
          status: "error",
        });
      }
      return;
    }

    const credentials: any = await res.json();
    document.cookie = `token=${credentials.token}; expires=${new Date(
      Date.now() + 353894400000
    ).toUTCString()}`;

    setNotification({
      message: "Connecté avec succès !",
      status: "success",
    });
    setTimeout(() => location.assign("/"), 2000);
  }

  return (
    <div className="bg-white dark:bg-slate-800 min-h-screen">
      <ThemeInitializer />
      <main className="flex items-center justify-center h-screen">
        <div className="w-11/12 sm:w-4/5 lg:w-3/4 max-w-screen-lg min-h-screen p-8 bg-secondWhite-50 dark:bg-slate-900">
          <Navbar />
          <div className="flex min-h-full flex-col justify-center px-6 pb-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
                Hello again ! We're happy to see you !
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" action="" onSubmit={login}>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Email or username
                  </label>
                  <div className="mt-2">
                    <input
                      name="email"
                      id="email"
                      type="text"
                      autoComplete="off"
                      required
                      className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500 dark:placeholder:opacity-100"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <Link
                      className="font-light underline text-primary duration-150 hover:text-hover"
                      href="/forgot-password"
                    >
                      Forgot password ?
                    </Link>
                  </div>
                  <div className="mt-2">
                    <input
                      name="password"
                      id="password"
                      type="password"
                      autoComplete="current-password"
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
                    Let's enter !
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-black dark:text-white">
                No account ?{" "}
                <Link
                  href="/register"
                  className="font-semibold duration-150 leading-6 text-primary hover:text-hover"
                >
                  Why did you wait ?
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

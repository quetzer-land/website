"use client";
import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { getHumanDate, truncateContent } from "./utils/functions_utils";
import Image from "next/image";
import Notification from "./components/Notification";
import Link from "next/link";
import Loading from "./components/Loading";
import { usePosts } from "./components/HomePostsContext";
import { useTranslation } from "react-i18next";
import { useUser } from "./components/UserContext";
import ThemeToggle from "./components/ThemeToggle";
import ThemeInitializer from "./components/ThemeInitializer";

export default function Home() {
  const [notification, setNotification] = useState<{
    message: string;
    status: "success" | "error";
  } | null>(null);

  const defaultImageUrl = "/path/to/default/image.png";

  const { posts, loading, goToNextPage, goToPreviousPage } = usePosts();

  const { user } = useUser();

  return (
    loading !== true && (
      <div className="bg-white dark:bg-slate-800 min-h-screen">
        <ThemeInitializer />
        <main className="flex items-center justify-center">
          <button
            onClick={goToPreviousPage}
            className="hidden lg:block lg:pl-2 xl:pl-5"
          >
            <Image
              src={"/arrow-left.svg"}
              alt={'Arrow Left'}
              height={150}
              width={150}
            />
          </button>
          <div className="w-11/12 sm:w-4/5 lg:w-3/4 max-w-screen-lg min-h-screen p-8 bg-secondWhite-50 dark:bg-slate-900">
            <Navbar />
            <div className="h-5/6">
              <div className="h-5/6">
                {loading === false ? (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="text-black dark:text-white my-10 border-2 dark:border-slate-800 duration-150 hover:bg-secondWhite-200 active:bg-secondWhite-100 dark:active:bg-slate-700 dark:hover:bg-slate-800 rounded-xl"
                    >
                      <Link key={post.id} href={`/post/${post.slug}`}>
                        <div className="flex p-4">
                          <div className="flex-shrink-0 mr-4">
                            <Image
                              src={post.imageUrl || defaultImageUrl}
                              alt={post.title}
                              width={104}
                              height={104}
                              className="rounded h-14 w-14 lg:h-auto lg:w-auto"
                            />
                          </div>
                          <div className="flex flex-col justify-center mr-4">
                            <h1 className="md:text-xl lg:text-2xl font-bold mb-2">
                              {truncateContent(post.title, 25)}
                            </h1>
                            <p>{truncateContent(post.description, 30)}</p>
                          </div>
                          <div className="hidden lg:flex flex-col justify-center ml-auto text-right">
                            <time
                              className="text-gray-500"
                              suppressHydrationWarning
                            >
                              {getHumanDate(post.createdAt, user?.userLanguage)}
                            </time>
                            <Link
                              href={`/user/${post.author.username}`}
                              key={post.author.username}
                              className="text-primary hover:underline"
                            >
                              @{post.author.username}
                            </Link>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <Loading />
                )}
                <div className="lg:hidden flex justify-center">
                  <button onClick={goToPreviousPage} className="">
                    <Image
                      src={"/arrow-left.svg"}
                      alt="Arrow left"
                      height={100}
                      width={100}
                    />
                  </button>
                  <button onClick={goToNextPage} className="">
                    <Image
                      src={"/arrow-right.svg"}
                      alt="Arrow right"
                      height={100}
                      width={100}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={goToNextPage}
            className="hidden lg:block lg:pl-2 xl:pl-5"
          >
            <Image
              src={"/arrow-right.svg"}
              alt="Arrow right"
              height={150}
              width={150}
            />
          </button>
        </main>
        {notification && (
          <Notification
            message={notification.message}
            onClose={() => setNotification(null)}
            status={notification.status}
          />
        )}
      </div>
    )
  );
}

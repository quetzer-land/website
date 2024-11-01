"use client";
import Loading from "@/app/components/Loading";
import { Navbar } from "@/app/components/Navbar";
import Notification from "@/app/components/Notification";
import ThemeInitializer from "@/app/components/ThemeInitializer";
import { useUser } from "@/app/components/UserContext";
import {
  customFetch,
  findPermissions,
  getHumanDate,
  truncateContent,
} from "@/app/utils/functions_utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { username: string } }) {
  const [notification, setNotification] = useState<{
    message: string;
    status: "success" | "error";
  } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API}/users/${params.username}`,
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userPage, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  async function fetchPostImage(imageName: any): Promise<string> {
    const response = await customFetch(
      `${process.env.NEXT_PUBLIC_API}/posts/image/${imageName}`,
      "GET"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch post image");
    }
    setImageUrl(response.url);
    return response.url;
  }

  async function fetchData(page: number = 1) {
    try {
      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API}/posts/author/${userPage?.id}?limit=4&page=${page}`,
        "GET"
      );

      if (!res.ok) {
        const errorResponse = await res.json();
        const errorMessage =
          errorResponse.message || "Erreur lors de la récupération des posts";
        throw new Error(errorMessage);
      }

      const responseData = await res.json();
      const postsData: Post[] = responseData.data;

      if (postsData.length > 0) {
        const postsWithImages = await Promise.all(
          postsData.map(async (post) => {
            const imageUrl = await fetchPostImage(post.image);
            return { ...post, imageUrl };
          })
        );
        setPosts(postsWithImages);
      } else {
        throw new Error("Aucun post trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des posts :", error);
      setNotification({
        message: "Erreur",
        status: "error",
      });
    }
  }

  const goToNextPage = () => setPage((prev) => prev + 1);
  const goToPreviousPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

  useEffect(() => {
    if (userPage && userPage.id) {
      fetchData(page);
    }
    if (userPage && userPage.id) {
      fetchUserImage(userPage.username, userPage.id)
        .then((url) => setUserImageUrl(url))
        .catch((error) => console.error(error));
    }
    console.log(imageUrl);
    setMounted(true);
  }, [page, userPage]);

  const defaultImageUrl = "/quetzer-front.png";

  const { user } = useUser();

  return (
    userPage &&
    mounted && (
      <div className="bg-white dark:bg-slate-800 min-h-screen">
        <ThemeInitializer />
        <main className="flex items-center justify-center">
          <div className="w-11/12 sm:w-4/5 lg:w-3/4 max-w-screen-lg min-h-screen p-8 bg-secondWhite-50 dark:bg-slate-900">
            <Navbar />
            <div className="text-black dark:text-white">
              <div className="flex justify-center">
                <Image
                  src={userImage || defaultImageUrl}
                  width={150}
                  height={150}
                  alt="Your avatar"
                  className="rounded-full border-2"
                />
              </div>
              <div className="">
                {userPage.permission !== 0 && (
                  <div className="flex justify-center items-center">
                    <h1 className="text-4xl font-bold my-5 mx-5">
                      {userPage.username}
                    </h1>
                    <p className="mx-2 text-primary dark:text-hover border-2 border-primary p-2 rounded-2xl">
                      {findPermissions(userPage.permission)}
                    </p>
                  </div>
                )}
                {userPage.permission === 0 && (
                  <div className="text-center">
                    <h1 className="text-4xl font-bold my-5">{userPage.username}</h1>
                    <p>{findPermissions(userPage.permission)}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-center my-5">
                <div className="w-2/3 border-2 border-black dark:border-white rounded-2xl p-3 break-words">
                  <h3>{userPage.biography}</h3>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <Image
                  className="mx-3"
                  src={"/timer.svg"}
                  height={40}
                  width={40}
                  alt="Timer"
                />
                <h3 className="">{getHumanDate(userPage.createdAt, user?.userLanguage)}</h3>
              </div>
              {mounted === true ? (
                posts.map((post) => (
                  <div className="text-black dark:text-white my-10 border-2 dark:border-slate-800 duration-150 hover:bg-secondWhite-200 active:bg-secondWhite-100 dark:active:bg-slate-700 dark:hover:bg-slate-800 rounded-xl">
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
                          <p className="">
                            {getHumanDate(post.createdAt, user?.userLanguage)}
                          </p>
                          <Link
                            href={`/author/${post.author.username}`}
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
              <div className="flex justify-center">
                <button
                  onClick={goToPreviousPage}
                  className="hidden lg:block lg:pl-2 xl:pl-5"
                >
                  <Image
                    src={"/arrow-left.svg"}
                    alt="Arrow left"
                    height={100}
                    width={100}
                  />
                </button>
                <button
                  onClick={goToNextPage}
                  className="hidden lg:block lg:pl-2 xl:pl-5"
                >
                  <Image
                    src={"/arrow-right.svg"}
                    alt="Arrow right"
                    height={100}
                    width={100}
                  />
                </button>
              </div>

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

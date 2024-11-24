"use client";
import ModalEditComment from "../../components/ModalEditComment";
import ModalPostEditing from "../../components/ModalEditPost";
import { Navbar } from "../../components/Navbar";
import Notification from "../../components/Notification";
import ThemeInitializer from "../../components/ThemeInitializer";
import { useUser } from "../../components/UserContext";
import { customFetch, getHumanDate } from "../../utils/functions_utils";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Page({ params }: { params: { slug: string } }) {
  const [notification, setNotification] = useState<{
    message: string;
    status: "success" | "error";
  } | null>(null);

  const [mounted, setMounted] = useState(false);

  const { user } = useUser();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [contentText, setContent] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  async function post_comment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const contentForComment = contentText;

    const res = await customFetch(
      `${process.env.NEXT_PUBLIC_API}/posts/${post?.slug}/comment`,
      "POST",
      JSON.stringify({ content: contentForComment })
    );

    console.log(contentText);

    if (!res.ok) {
      const errorResponse = await res.json();
      if (errorResponse.errors && errorResponse.errors.length > 0) {
        const errorMessage =
          errorResponse.errors[0].message ||
          "Erreur lors de la récupération du post";
        setNotification({
          message: errorMessage,
          status: "error",
        });
      } else {
        setNotification({
          message: "Erreur lors de la récupération du post",
          status: "error",
        });
      }
      // fetchData();
      return;
    }

    setNotification({
      message: "Commentaire posté avec succès !",
      status: "success",
    });
  }

  async function fetchData() {
    try {
      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API}/posts/${params.slug}`,
        "GET"
      );

      if (!res.ok) {
        const errorResponse = await res.json();
        if (errorResponse.errors && errorResponse.errors.length > 0) {
          const errorMessage =
            errorResponse.errors[0].message ||
            "Erreur lors de la récupération du post";
          setNotification({
            message: errorMessage,
            status: "error",
          });
        } else {
          setNotification({
            message: "Erreur lors de la récupération du post",
            status: "error",
          });
        }
        return;
      }

      const postData: Post = await res.json();
      setPost(postData);
      setComments(postData.comments);
      setMounted(true);
    } catch (error) {
      setNotification({
        message: "Erreur",
        status: "error",
      });
    }
  }

  useEffect(() => {
    if (params.slug) {
      fetchData();
    }

    return () => { };
  }, [params.slug]);

  const [modalState, setModalState] = useState(false);
  const [commentModal, setCommentModal] = useState(false);

  async function delete_post(slug: string) {
    const res = await customFetch(
      `${process.env.NEXT_PUBLIC_API}/posts/${slug}`,
      "DELETE"
    );

    if (!res.ok) {
      const errorResponse = await res.json();
      if (errorResponse.errors && errorResponse.errors.length > 0) {
        const errorMessage =
          errorResponse.errors[0].message ||
          "Erreur lors de la récupération du post";
        setNotification({
          message: errorMessage,
          status: "error",
        });
      } else {
        setNotification({
          message: "Erreur dans la suppression du post",
          status: "error",
        });
      }
      return;
    }

    setNotification({
      message: "Post supprimé avec succès !",
      status: "success",
    });
    location.assign("/");
  }

  async function delete_comment(id: number) {
    const res = await customFetch(
      `${process.env.NEXT_PUBLIC_API}/comments/${id}`,
      "DELETE"
    );

    if (!res.ok) {
      const errorResponse = await res.json();
      if (errorResponse.errors && errorResponse.errors.length > 0) {
        const errorMessage =
          errorResponse.errors[0].message ||
          "Erreur lors de la récupération du commentaire";
        setNotification({
          message: errorMessage,
          status: "error",
        });
      } else {
        setNotification({
          message: "Erreur dans la suppression du commentaire",
          status: "error",
        });
      }
      return;
    }

    setNotification({
      message: "Commentaire supprimé avec succès !",
      status: "success",
    });
  }

  return (
    mounted && (
      <div className="bg-white dark:bg-slate-800 min-h-screen">
        {post && modalState && (
          <ModalPostEditing
            setModalState={setModalState}
            slug={post.slug}
            title={post.title}
            description={post.description}
            tag={post.tag}
            content={post.content}
          />
        )}
        <ThemeInitializer />
        <main className="flex items-center justify-center">
          <div className="w-11/12 sm:w-4/5 lg:w-3/4 max-w-screen-lg min-h-screen p-8 bg-secondWhite-50 dark:bg-slate-900">
            <Navbar />
            <div className="text-black dark:text-white">
              <div className="">
                {" "}
                {post ? (
                  <div>
                    {user && post.author.id === user.id && (
                      <div className="absolute p-2 flex gap-2 invisible sm:visible">
                        <button
                          onClick={() => {
                            setModalState(true);
                          }}
                        >
                          <Image
                            src={"/edit.svg"}
                            height={30}
                            width={30}
                            alt="Edit icon"
                          />
                        </button>
                        <button
                          onClick={() => {
                            delete_post(post.slug);
                          }}
                        >
                          <Image
                            src={"/delete.svg"}
                            alt="Delete icon"
                            width={30}
                            height={30}
                          ></Image>
                        </button>
                      </div>
                    )}
                    <h1 className="text-3xl my-5 text-center font-bold">
                      {post.title}
                    </h1>
                    <p className="text-center italic">{post.description}</p>
                    <div className="flex justify-center">
                      <Link
                        className="text-primary duration-100 hover:border-b-2 hover:text-hover"
                        href={`/user/${post.author.username}`}
                        key={post.author.username}
                      >
                        @{post.author.username}
                      </Link>
                    </div>
                    <hr className="my-3" />
                    <div className="">
                      <p className="tracking-wide break-words text-lg xl:text-xl">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                      </p>
                    </div>
                    <div className="mx-10 w-full md:w-2/3">
                      <h1 className="text-xl mt-8 font-bold">Commentaires</h1>
                      <form
                        className="flex items-center"
                        onSubmit={post_comment}
                      >
                        <input
                          type="text"
                          name="comment-content"
                          id="comment-content"
                          className="rounded-md p-2 m-2 w-2/3 sm:w-1/3 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500 dark:placeholder:opacity-100 border"
                          placeholder="Ajoutez un commentaire..."
                          value={contentText}
                          onChange={handleChange}
                        />
                        <button type="submit">
                          <Image
                            src={"/send.svg"}
                            height={30}
                            width={30}
                            alt="Send icon"
                          />
                        </button>
                      </form>
                      <div className="mx-10 my-3">
                        {comments &&
                          comments.map((comment) => (
                            <div key={comment.id} className="my-4 w-auto">
                              {comment && commentModal && (
                                <ModalEditComment
                                  setModalState={setCommentModal}
                                  id={comment.id}
                                  content={comment.content}
                                />
                              )}
                              <div className="flex justify-between">
                                <Link
                                  className="text-primary hover:underline"
                                  href={`/user/${comment.author.username}`}
                                >
                                  @{comment.author.username}
                                </Link>
                                <div className="hidden md:flex">
                                  <time suppressHydrationWarning>
                                    {getHumanDate(comment.createdAt)}
                                  </time>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <p className="p-2 font-bold break-words w-full md:w-2/3">
                                  {comment.content}
                                </p>
                                {user && comment.author.id === user.id && (
                                  <div className="invisible sm:visible">
                                    <button
                                      onClick={() => {
                                        setCommentModal(true);
                                      }}
                                    >
                                      <Image
                                        src={"/edit.svg"}
                                        height={30}
                                        width={30}
                                        alt="Edit icon"
                                      />
                                    </button>
                                    <button
                                      onClick={() => {
                                        delete_comment(comment.id);
                                      }}
                                    >
                                      <Image
                                        src={"/delete.svg"}
                                        alt="Delete icon"
                                        width={30}
                                        height={30}
                                      ></Image>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>Aucun post trouvé pour ce slug</p>
                )}
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

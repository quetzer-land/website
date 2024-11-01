"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { customFetch } from "../utils/functions_utils";

interface PostContextType {
  posts: Post[];
  loading: boolean;
  notification: { message: string; status: "success" | "error" } | null;
  fetchPosts: (page?: number) => Promise<void>;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [notification, setNotification] = useState<{
    message: string;
    status: "success" | "error";
  } | null>(null);

  async function fetchPostImage(imageName: string): Promise<string> {
    const response = await customFetch(
      `${process.env.NEXT_PUBLIC_API}/posts/image/${imageName}`,
      "GET"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch post image");
    }
    return response.url;
  }

  async function fetchPosts(page: number = 1) {
    try {
      setLoading(true);
      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API}/posts/?limit=4&page=${page}`,
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

      setNotification({
        message: "Posts récupérés avec succès",
        status: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des posts :", error);
      setNotification({
        message: "Erreur lors de la récupération des posts",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const goToNextPage = () => setPage((prev) => prev + 1);
  const goToPreviousPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        notification,
        fetchPosts,
        goToNextPage,
        goToPreviousPage,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};

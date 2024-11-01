"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { customFetch } from "../utils/functions_utils";

interface UserContextType {
  user: User | null;
  loading: boolean;
  userImage: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userImage, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API}/@me/`,
        "GET"
      );

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setUser(null);
      }

      setLoading(false);
    }

    fetchUser();
  }, []);

  async function fetchUserImage(imageName: any): Promise<string> {
    const response = await customFetch(
      `${process.env.NEXT_PUBLIC_API}/@me/image/${imageName}`,
      "GET"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch post image");
    }
    return response.url;
  }

  useEffect(() => {
    if (user) {
      fetchUserImage(user.id)
        .then((url) => setImageUrl(url))
        .catch((error) => console.error(error));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, loading, userImage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

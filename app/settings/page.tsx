"use client";
import { Navbar } from "../components/Navbar";
import { customFetch, getToken } from "../utils/functions_utils";
import { useEffect, useState } from "react";
import Notification from "../components/Notification";
import { useUser } from "../components/UserContext";
import Image from "next/image";
import ky from "ky";
import ThemeToggleIcon from "../components/ThemeToggle";
import ThemeInitializer from "../components/ThemeInitializer";

export default function Settings() {
  const [notification, setNotification] = useState<{
    message: string;
    status: "success" | "error";
  } | null>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { user, userImage, loading } = useUser();

  async function handleImageUpload() {
    if (!selectedImage) {
      setNotification({
        message: "Il n'y a pas d'image !",
        status: "error",
      });
    }

    try {
      const token = getToken();

      const api = ky.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formData = new FormData();

      formData.append("image", selectedImage as Blob);

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API}/@me/upload`,
        {
          body: formData,
        }
      );

      if (response.ok) {
        setNotification({
          message: "Avatar uploadée avec succès !",
          status: "success",
        });
      } else {
        setNotification({
          message: "L'avatar n'a pas été uploadée !",
          status: "error",
        });
      }
    } catch (error) {
      setNotification({
        message: `Erreur ${error}`,
        status: "error",
      });
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      setSelectedImage(() => file);
    }
    setNotification({
      message: "Votre avatar est prêt !",
      status: "success",
    });
  }

  const [biography, setBiography] = useState<string>("");

  const handleChangeBioGraphy = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setBiography(event.target.value);
  };

  const [username, setUsername] = useState<string>("");

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const [email, setEmail] = useState<string>("");

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  useEffect(() => {
    if (user && user.biography) {
      setUsername(user.username);
      setEmail(user.email);
      setBiography(user.biography);
    }
  }, [user]);

  async function delete_account() {
    const res = await customFetch(
      `${process.env.NEXT_PUBLIC_API}/@me`,
      "DELETE"
    );

    if (!res.ok) {
      const errorResponse = await res.json();
      if (errorResponse.errors && errorResponse.errors.length > 0) {
        const errorMessage =
          errorResponse.errors[0].message || "Erreur lors de la suppression";
        setNotification({
          message: errorMessage,
          status: "error",
        });
      }
    }

    setNotification({
      message: "Compte supprimé !",
      status: "success",
    });
  }

  return (
    loading !== true &&
    user && (
      <div className="bg-white dark:bg-slate-800 min-h-screen">
        <ThemeInitializer />
        <main className="flex items-center justify-center">
          <div className="w-11/12 sm:w-4/5 lg:w-3/4 max-w-screen-lg min-h-screen p-8 bg-secondWhite-50 dark:bg-slate-900">
            <Navbar />
            <div className="text-black dark:text-white">
              <div className="lg:flex lg:justify-between items-center my-5 mx-5">
                <div className="flex justify-center lg:block">
                  <div className="flex items-center space-x-4">
                    <div className="relative group">
                      <label htmlFor="avatar-upload">
                        <Image
                          src={userImage || "/new.svg"}
                          width={150}
                          height={150}
                          alt="Your avatar"
                          className="rounded-full border-2 border-gray-300 object-cover cursor-pointer transition-all group-hover:opacity-70"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-sm">Upload</span>
                        </div>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={handleImageUpload}
                        className="p-3 text-black bg-hover duration-150 rounded-3xl hover:bg-primary"
                      >
                        Upload
                      </button>
                      <button className="p-3 bg-red-100 duration-100 rounded-3xl hover:bg-red-200">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center py-5 lg:block lg:py-0">
                  <form
                    id="update-infos-form"
                    className=""
                    onSubmit={async (e) => {
                      e.preventDefault();

                      const res = await customFetch(
                        `${process.env.NEXT_PUBLIC_API}/@me`,
                        "PUT",
                        new FormData(
                          document.getElementById(
                            "update-infos-form"
                          ) as HTMLFormElement
                        ),
                        false
                      );

                      if (!res.ok) {
                        const errorResponse = await res.json();
                        if (
                          errorResponse.errors &&
                          errorResponse.errors.length > 0
                        ) {
                          const errorMessage =
                            errorResponse.errors[0].message ||
                            "Erreur lors de la mise-à-jour";
                          setNotification({
                            message: errorMessage,
                            status: "error",
                          });
                        } else {
                          setNotification({
                            message: "Erreur",
                            status: "error",
                          });
                        }
                        return;
                      }

                      setNotification({
                        message: "Infos mis à jour avec succès !",
                        status: "success",
                      });
                    }}
                  >
                    <div>
                      <label className="" htmlFor="username">
                        Nom d'utilisateur :
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={username}
                        onChange={handleChangeUsername}
                        autoComplete="off"
                        required
                        className="bg-secondWhite-200 dark:bg-black m-2 p-2 border border-black dark:border-white rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="" htmlFor="email">
                        Adresse email :
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={handleChangeEmail}
                        autoComplete="off"
                        required
                        className="bg-secondWhite-200 dark:bg-black m-2 p-2 border border-black dark:border-white rounded-2xl"
                      />
                    </div>

                    <div>
                      <label className="" htmlFor="userLanguage">
                        Changer de langue :
                      </label>
                      <select
                        name="userLanguage"
                        id="userLanguage"
                        className="bg-secondWhite-200 dark:bg-black m-2 p-2 border border-black dark:border-white rounded-2xl"
                      >
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>

                    <div>
                      <label className="" htmlFor="biography">
                        Modifier votre biographie :
                      </label>
                      <textarea
                        name="biography"
                        id="biography"
                        value={biography}
                        onChange={handleChangeBioGraphy}
                        autoComplete="off"
                        className="bg-secondWhite-200 dark:bg-black m-2 p-2 border border-black dark:border-white rounded-2xl w-full"
                        rows={5}
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="bg-hover text-black p-2 rounded-3xl duration-150 hover:bg-primary"
                      >
                        Mettre à jour
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="lg:flex lg:justify-between items-center mx-5 text-black dark:text-white">
              <form
                id="update-password-form"
                className="flex justify-center pb-5 lg:pb-0 lg:block"
                onSubmit={async (e) => {
                  e.preventDefault();

                  const res = await customFetch(
                    `${process.env.NEXT_PUBLIC_API}/@me/password`,
                    "PUT",
                    new FormData(
                      document.getElementById(
                        "update-password-form"
                      ) as HTMLFormElement
                    ),
                    false
                  );

                  if (!res.ok) {
                    const errorResponse = await res.json();
                    if (
                      errorResponse.errors &&
                      errorResponse.errors.length > 0
                    ) {
                      const errorMessage =
                        errorResponse.errors[0].message ||
                        "Erreur lors de la mise-à-jour";
                      setNotification({
                        message: errorMessage,
                        status: "error",
                      });
                    } else {
                      setNotification({
                        message: "Erreur",
                        status: "error",
                      });
                    }
                    return;
                  }

                  setNotification({
                    message: "Mot de passe mis à jour avec succès !",
                    status: "success",
                  });
                }}
              >
                <div>
                  <label className="" htmlFor="password">
                    Changer votre mot de passe :
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="off"
                    required
                    className="bg-secondWhite-200 dark:bg-black m-2 p-2 border border-black dark:border-white rounded-2xl"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-hover text-black p-2 rounded-3xl duration-150 hover:bg-primary"
                >
                  Changer
                </button>
              </form>
              <div className="flex justify-center lg:block">
                <button
                  onClick={() => {
                    delete_account();
                  }}
                  className="p-2 bg-red-100 text-white duration-100 rounded-3xl hover:bg-red-200"
                >
                  Supprimer le compte
                </button>
              </div>
            </div>
            <div className="flex items-center my-5 text-black dark:text-white">
              <h2 className="text-2xl mx-5">Theme :</h2>
              <ThemeToggleIcon />
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
    )
  );
}

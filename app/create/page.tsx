"use client";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { customFetch, getToken } from "../utils/functions_utils";
import { FormEvent, useEffect, useState } from "react";
import Notification from "../components/Notification";
import ky from "ky";
import Image from "next/image";
import ThemeInitializer from "../components/ThemeInitializer";

export default function Login() {
    const [notification, setNotification] = useState<{
        message: string;
        status: "success" | "error";
    } | null>(null);

    const [mounted, setMounted] = useState(false);
    const [preview, setPreview] = useState(false);

    useEffect(() => {
        setMounted(true)
    }, []);

    const [contentText, setContent] = useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    const [tagsContent, setTagsContent] = useState<string>("");

    const handleChangeTags = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagsContent(event.target.value);
    };

    const [titleContent, setTitleContent] = useState<string>("");

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitleContent(event.target.value);
    };

    const [descriptionContent, setDescriptionContent] = useState<string>("");

    const handleChangeDescription = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDescriptionContent(event.target.value);
    };

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(
        null
    );
    const [fullUploadedImagePath, setFullUploadedImagePath] =
        useState<string>("");

    async function onPostSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const title = titleContent;
        const content = contentText;
        const tags = tagsContent;
        const description = descriptionContent;

        const res = await customFetch(
            `${process.env.NEXT_PUBLIC_API}/posts`,
            "POST",
            JSON.stringify({
                title: title,
                description: description,
                content: content,
                tag: tags,
                image: fullUploadedImagePath,
                required_age: 0,
            })
        );

        if (!res.ok) {
            const errorResponse = await res.json();
            if (errorResponse.errors && errorResponse.errors.length > 0) {
                const errorMessage =
                    errorResponse.errors[0].message || "Erreur lors de la publication";
                setNotification({
                    message: errorMessage,
                    status: "error",
                });
            } else {
                setNotification({
                    message: "Erreur lors de la publication",
                    status: "error",
                });
            }
            return;
        }

        setNotification({
            message: `Post publié avec succès !`,
            status: "success",
        });
    }

    useEffect(() => {
        if (selectedImage) {
            console.log("Image sélectionnée, démarrage de l'upload...");
            handleImageUpload();
        }
    }, [selectedImage]);

    async function handleImageUpload() {
        if (!selectedImage) return;

        try {
            const token = getToken();

            const api = ky.create({
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const formData = new FormData();
            formData.append("image", selectedImage);

            const response = await api.post(`http://localhost:3333/posts/upload`, {
                body: formData,
            });

            if (response.ok) {
                const responseData: UploadResponse = await response.json();
                setUploadedImagePath(responseData.path);
                setFullUploadedImagePath(`${responseData.path}`);
            } else {
                setNotification({
                    message: `Erreur lors de l'upload de l'image : ${response.statusText}`,
                    status: "error",
                });
            }
        } catch (error) {
            setNotification({
                message: `Erreur inconnue : ${error}`,
                status: "error",
            });
        }
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedImage(file);
        }
    }

    return (
        mounted && (
            <div className="bg-white dark:bg-slate-800 text-black dark:text-white min-h-screen">
                <ThemeInitializer />
                <main className="flex items-center justify-center min-h-screen overflow-y-auto">
                    <div className="w-11/12 sm:w-4/5 lg:w-3/4 max-w-screen-lg min-h-[80vh] p-8 bg-secondWhite-50 dark:bg-slate-900 rounded-lg shadow-lg">
                        <Navbar />
                        {preview === false && (
                            <div className="flex min-h-full flex-col justify-center px-6 pb-12 lg:px-8">
                                <div>
                                    <form action="" onSubmit={onPostSubmit} className="">
                                        <div>
                                            <div className="flex justify-center pb-4">
                                                <input
                                                    type="text"
                                                    name="title"
                                                    id="title"
                                                    placeholder="Your title..."
                                                    className="border-2 border-slate-800 bg-transparent rounded-3xl w-full md:w-4/5 px-3 py-2 mx-3"
                                                    value={titleContent}
                                                    onChange={handleChangeTitle}
                                                />
                                            </div>
                                            <div className="flex justify-center pb-4">
                                                <input
                                                    type="text"
                                                    name="description"
                                                    id="description"
                                                    placeholder="Your description..."
                                                    className="border-2 border-slate-800 bg-transparent rounded-3xl w-full md:w-4/5 px-3 py-2 mx-3"
                                                    value={descriptionContent}
                                                    onChange={handleChangeDescription}
                                                />
                                            </div>
                                            <div className="flex justify-center pb-4">
                                                <input
                                                    type="text"
                                                    name="tags"
                                                    id="tags"
                                                    placeholder="Your tag"
                                                    className="border-2 border-slate-800 bg-transparent rounded-3xl w-full md:w-4/5 px-3 py-2 mx-3"
                                                    value={tagsContent}
                                                    onChange={handleChangeTags}
                                                />
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <textarea
                                                    name="content"
                                                    className="textarea bg-transparent border-2 border-black dark:border-white rounded-2xl p-2 text-xl w-11/12 flex justify-center focus:outline-none h-80"
                                                    placeholder="Today, my day was..."
                                                    id="content"
                                                    value={contentText}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center my-10">
                                            <div className="ml-9 flex">
                                                <label htmlFor="image" className="relative cursor-pointer">
                                                    <div className="h-12 w-12">
                                                        <Image
                                                            src="/image.svg"
                                                            alt="File"
                                                            className="h-full w-full object-cover"
                                                            height={40}
                                                            width={40}
                                                        />
                                                    </div>
                                                    <input
                                                        id="image"
                                                        name="image"
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                            </div>
                                            <div className="mr-9">
                                                <button
                                                    className="bg-primary p-3 rounded-2xl duration-150 hover:bg-hover hover:text-black"
                                                    type="submit"
                                                    onClick={() => {
                                                        onPostSubmit;
                                                    }}
                                                >
                                                    Koyer !
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <button onClick={() => { setPreview(true) }} className="bg-red-200 p-3 rounded-2xl">Post preview</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        {preview === true && (
                            <div>
                                <div className="">
                                    {" "}
                                    <div>

                                        <div className="absolute p-3 flex bg-red-200 rounded-2xl">
                                            <button
                                                onClick={() => {
                                                    setPreview(false);
                                                }}
                                            >
                                                Back to post
                                            </button>
                                        </div>
                                        <h1 className="text-3xl my-5 text-center font-bold">
                                            {titleContent}
                                        </h1>
                                        <p className="text-center italic">{descriptionContent}</p>
                                        <div className="flex justify-center">
                                            <p
                                                className="text-primary duration-100 hover:border-b-2 hover:text-hover"
                                            >
                                                @JohnDoe
                                            </p>
                                        </div>
                                        <hr className="my-3" />
                                        <div className="">
                                            <p className="tracking-wide text-lg xl:text-xl">
                                                {contentText}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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

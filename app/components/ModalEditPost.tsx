import { FormEvent, useEffect, useState } from "react";
import { customFetch, getToken } from "../utils/functions_utils";
import Image from "next/image";
import ky from "ky";
import Notification from "./Notification";

const ModalPostEditing = (props: any) => {
  const [notification, setNotification] = useState<{
    message: string;
    status: "success" | "error";
  } | null>(null);

  const [isTagModalOpen, setTagModalOpen] = useState(false);

  const [contentText, setContent] = useState<string>(props.content);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const [tagsContent, setTagsContent] = useState<string>(props.tag);

  const handleChangeTags = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagsContent(event.target.value);
  };

  const [titleContent, setTitleContent] = useState<string>(props.title);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleContent(event.target.value);
  };

  const [descriptionContent, setDescriptionContent] = useState<string>(
    props.description
  );

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
      `${process.env.NEXT_PUBLIC_API}/posts/${props.slug}`,
      "PUT",
      JSON.stringify({
        title: title,
        description: description,
        content: content,
        tag: tags,
        image: fullUploadedImagePath,
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
    props.setModalState(false);
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

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API}/posts/upload`,
        {
          body: formData,
        }
      );

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
    <>
      <div className="fixed inset-0 opacity-25 bg-black"></div>
      <div className="fixed inset-0 flex justify-center items-center z-10">
        <div className="bg-secondWhite-200 dark:bg-slate-900 text-black dark:text-white rounded-3xl w-11/12 sm:w-4/5 lg:w-2/3 xl:w-1/2 2xl:w-1/3 h-2/3">
          <div className="flex justify-end">
            <button
              className="hover:bg-red-100 rounded-3xl py-3 px-4 m-3"
              onClick={() => props.setModalState(false)}
            >
              <Image src={"/cross.svg"} alt="Close" height={20} width={20} />
            </button>
          </div>
          <div>
            <form action="" onSubmit={onPostSubmit} className="">
              {isTagModalOpen === false && (
                <div>
                  <div className="flex justify-center pb-4">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      placeholder="Your title..."
                      className="border-2 border-slate-800 bg-transparent rounded-3xl w-3/4 px-3 py-2 mx-3"
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
                      className="border-2 border-slate-800 bg-transparent rounded-3xl w-4/5 px-3 py-2 mx-3"
                      value={descriptionContent}
                      onChange={handleChangeDescription}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <textarea
                      name="content"
                      className="textarea bg-transparent border-2 border-white rounded-2xl p-2 text-xl w-11/12 flex justify-center focus:outline-none h-80"
                      placeholder="Today, my day was..."
                      id="content"
                      value={contentText}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              {isTagModalOpen && (
                <div className="flex items-center justify-center">
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    placeholder="Your tag"
                    className="border-2 border-slate-800 bg-transparent rounded-3xl w-1/2 px-3 py-2 mx-3"
                    value={tagsContent}
                    onChange={handleChangeTags}
                  />
                  <button
                    className="p-2 bg-red-200 rounded-3xl duration-150 hover:bg-red-100 mx-2 md:mx-5"
                    onClick={() => setTagModalOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setTagModalOpen(false)}
                    className="p-2 bg-primary rounded-3xl duration-150 hover:bg-hover hover:text-black"
                  >
                    Done
                  </button>
                </div>
              )}
              {isTagModalOpen === false && (
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
                    <button onClick={() => setTagModalOpen(true)}>
                      <Image
                        src={"/hashtags.svg"}
                        alt="Add tags"
                        height={45}
                        width={45}
                        className="ml-5"
                      />
                    </button>
                  </div>
                  <div className="mr-9">
                    <button
                      className="bg-primary text-white p-3 rounded-2xl duration-150 hover:bg-hover hover:text-black"
                      type="submit"
                      onClick={() => {
                        onPostSubmit;
                      }}
                    >
                      Modifier le post
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          onClose={() => setNotification(null)}
          status={notification.status}
        />
      )}
    </>
  );
};

export default ModalPostEditing;

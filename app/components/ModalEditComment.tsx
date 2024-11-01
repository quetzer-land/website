import { FormEvent, useState } from "react";
import { customFetch } from "../utils/functions_utils";
import Image from "next/image";
import Notification from "./Notification";

const ModalEditComment = (props: any) => {
  const [notification, setNotification] = useState<{
    message: string;
    status: "success" | "error";
  } | null>(null);

  const [contentText, setContent] = useState<string>(props.content);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  async function updateComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const content = contentText;

    const res = await customFetch(
      `${process.env.NEXT_PUBLIC_API}/comments/${props.id}`,
      "PUT",
      JSON.stringify({
        content: content,
      })
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
      message: `Commentaire modifié avec succès !`,
      status: "success",
    });
    props.setModalState(false);
  }

  return (
    <>
      <div className="fixed inset-0 opacity-25 bg-black"></div>
      <div className="fixed inset-0 flex justify-center items-center z-10">
        <div className="bg-secondWhite-200 dark:bg-slate-900 text-black dark:text-white rounded-3xl w-11/12 sm:w-4/5 lg:w-2/3 xl:w-1/2 2xl:w-1/3 h-auto">
          <div className="flex justify-end">
            <button
              className="hover:bg-red-100 rounded-3xl py-3 px-4 m-3"
              onClick={() => props.setModalState(false)}
            >
              <Image src={"/cross.svg"} alt="Close" height={20} width={20} />
            </button>
          </div>
          <div className="mb-10">
            {" "}
            <form action="" onSubmit={updateComment} className="">
              <div className="flex items-center justify-center">
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  placeholder="Your content"
                  className="border-2 border-slate-800 bg-transparent rounded-3xl w-1/2 px-3 py-2 mx-3"
                  value={contentText}
                  onChange={handleChange}
                />
                <button
                  type="submit"
                  className="p-2 bg-primary rounded-3xl duration-150 hover:bg-hover hover:text-black"
                >
                  Done
                </button>
              </div>
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

export default ModalEditComment;

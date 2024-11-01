"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { customFetch } from "../utils/functions_utils";
import ModalPostCreation from "./ModalPostCreation";
import Notification from "./Notification";
import { useUser } from "./UserContext";
import ThemeToggle from "./ThemeToggle";
import ThemeToggleIcon from "./ThemeToggle";

const Dropdown = () => {
  const [notification, setNotification] = useState<{
    message: string;
    status: "success" | "error";
  } | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const { user } = useUser();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  function delete_cookie() {
    document.cookie = "token" + "=; expires=Thu, 01-Jan-70 00:00:01 GMT;";
  }

  async function logout() {
    const res = await customFetch(
      `${process.env.NEXT_PUBLIC_API}/auth/logout`,
      "DELETE"
    );
    // delete_cookie();

    if (!res.ok) {
      setNotification({
        message: await res.json(),
        status: "error",
      });
      return;
    }
    setNotification({
      message: "Déconnecté avec succès !",
      status: "success",
    });
  }

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => { };
  }, []);

  const [modalState, setModalState] = useState(false);

  return (
    <div className="">
      {modalState && <ModalPostCreation setModalState={setModalState} />}
      <div className="relative inline-block">
        <div className="flex items-center">
          {user && user?.permission > 0 && (
            <button
              onClick={() => {
                closeDropdown();
                setModalState(true);
              }}
            >
              <Image
                src={"/new.svg"}
                alt="Create new story"
                height={65}
                width={65}
              />
            </button>
          )}
          <button
            type="button"
            className="px-4 py-2 text-white font-medium rounded-lg"
            onClick={toggleDropdown}
          >
            <Image src={"/user.svg"} alt="User image" height={80} width={80} />
          </button>
        </div>

        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <ul
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <li>
                <p className="block px-4 py-2 text-sm text-black">
                  Hello {user?.username} !
                </p>
              </li>
              <li>
                <Link
                  href="/me"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray rounded-lg"
                  onClick={closeDropdown}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray rounded-lg"
                  onClick={closeDropdown}
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray rounded-lg"
                  onClick={closeDropdown}
                >
                  About
                </Link>
              </li>
              {user?.permission === 3 && (
                <li>
                  <Link
                    href="/panel"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray rounded-lg"
                    onClick={closeDropdown}
                  >
                    Panel
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="#"
                  className="block px-4 py-2 text-sm text-black hover:bg-red-200 rounded-lg"
                  onClick={() => {
                    closeDropdown;
                    logout();
                    delete_cookie();
                    window.location.assign("/")
                  }}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
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
  );
};

export default Dropdown;

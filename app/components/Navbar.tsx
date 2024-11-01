import React from "react";
import Image from "next/image";
import { isConnected } from "../utils/functions_utils";
import Link from "next/link";
import Dropdown from "./Dropdown";

export const Navbar = () => {
  return (
    <div className="sticky top-0 bg-secondWhite-50 dark:bg-slate-900 z-50">
      <div className="flex justify-between items-center">
        <div className="">
          <Link href={"/"} passHref className="flex items-center">
            <Image
              src={"/quetzer.png"}
              alt="Quetzer Social Logo"
              height={"100"}
              width={"100"}
              suppressHydrationWarning
            />
            <h1 className="text-5xl lg:text-6xl text-primary font-zamanda hidden sm:block">
              Quetzer
            </h1>
          </Link>
        </div>
        <div>
          {isConnected() === true && (
            <div>
              <Dropdown />
            </div>
          )}
          {isConnected() === false && (
            <div>
              <Link
                className="text-primary text-3xl sm:text-4xl xl:text-5xl font-zamanda pl-1 pr-3 sm:px-2 lg:px-4 xl:px-7 pb-2 duration-100 hover:border-b-2 hover:text-hover"
                href={"/login"}
              >
                Login
              </Link>
              <Link
                className="text-primary text-3xl sm:text-4xl xl:text-5xl font-zamanda pl-3 pr-1 sm:px-2 lg:px-4 xl:px-7 pb-2 duration-100 hover:border-b-2 hover:text-hover"
                href={"/register"}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
      <div></div>
    </div>
  );
};

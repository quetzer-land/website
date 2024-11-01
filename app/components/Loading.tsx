"use client";
import { Navbar } from "../components/Navbar";
export default function Loading() {
  return (
    <div className="bg-slate-800">
      <main className="flex items-center justify-center h-screen">
        <div className="w-11/12 sm:w-4/5 lg:w-3/4 max-w-screen-lg h-full p-8 bg-slate-900">
          <Navbar />
          <div className="flex min-h-full flex-col justify-center px-6 pb-12 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-white text-4xl">
              <h2>Please wait</h2>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

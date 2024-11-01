import { useState } from "react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

function getHumanDate(date: string, locale: string = 'en') {
  try {
    const selectedLocale = locale === 'fr' ? fr : enUS;
    const dateFormat = locale === 'fr' ? "dd MMMM yyyy" : "MM/dd/yyyy";
    return format(new Date(date), dateFormat, { locale: selectedLocale });
  } catch (error) {
    return "Date non valide";
  }
}

function getToken() {
  if (typeof document !== "undefined") {
    let cookies = document.cookie;
    let token = cookies.split("; ").find((e) => e.startsWith("token="));
    if (token === undefined) {
      return "";
    }
    return token.split("=")[1];
  }
  return "";
}

function isConnected() {
  return getToken().length != 0;
}

function getCookie(name: any) {
  return document.cookie.split(";").some((c) => {
    return c.trim().startsWith(name + "=");
  });
}

function getError(error: any) {
  return error.errors[0].message;
}

async function customFetch(
  url: string,
  method: string = "GET",
  body?: BodyInit,
  json: boolean = true
) {
  let headers = {};
  if (json) {
    headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
  } else {
    headers = {
      Authorization: `Bearer ${getToken()}`,
    };
  }

  return await fetch(url, {
    method: method,
    body: body,
    headers: headers,
  });
}

async function uploadPostWithImage(
  url: string,
  content: string,
  tags: string,
  imageFile: File,
  json: boolean = true
) {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("tags", tags);
  formData.append("image", imageFile);

  let headers = {};
  if (json) {
    headers = {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
  } else {
    headers = {
      Authorization: `Bearer ${getToken()}`,
    };
  }

  const options: RequestInit = {
    method: "POST",
    headers: headers,
    body: formData,
  };

  return await fetch(url, options);
}

export function displayError(
  errorText: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
  errorTimer: ReturnType<typeof setTimeout> | undefined,
  setErrorTimer: React.Dispatch<
    React.SetStateAction<ReturnType<typeof setTimeout> | undefined>
  >
) {
  setError(errorText);
  if (errorTimer) {
    clearTimeout(errorTimer);
  }
  setErrorTimer(
    setTimeout(() => {
      setError("");
    }, 2000)
  );
}

export function displaySuccess(
  successText: string,
  setSuccess: React.Dispatch<React.SetStateAction<string>>,
  successTimer: ReturnType<typeof setTimeout> | undefined,
  setSuccessTimer: React.Dispatch<
    React.SetStateAction<ReturnType<typeof setTimeout> | undefined>
  >
) {
  setSuccess(successText);
  if (successTimer) {
    clearTimeout(successTimer);
  }
  setSuccessTimer(
    setTimeout(() => {
      setSuccess("");
    }, 2000)
  );
}

function findPermissions(permission: number) {
  if (permission === -1) {
    return "Suspendu";
  } else if (permission === 0) {
    return "Membre";
  } else if (permission === 1) {
    return "Rédacteur";
  } else if (permission === 2) {
    return "Modérateur";
  } else {
    return "Admin";
  }
}

function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength - 3) + "...";
}

export {
  getHumanDate,
  getToken,
  isConnected,
  getError,
  customFetch,
  getCookie,
  findPermissions,
  uploadPostWithImage,
  truncateContent,
};

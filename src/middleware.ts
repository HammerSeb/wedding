import { defineMiddleware } from "astro:middleware";
import { loadEnv } from "vite";

export const onRequest = defineMiddleware(
  async ({ request, redirect, cookies, locals }, next) => {
    const { USE_PASSWORD, PASSWORD } = loadEnv(
      process.env.NODE_ENV!,
      process.cwd(),
      ""
    );
    const usePassword = USE_PASSWORD.toLowerCase() === "true";
    console.log(`Processing request. usePassword is set to: ${usePassword}`);
    if (!usePassword) return next();

    // ===== LANGUAGE HANDLING (no redirects) =====
    const cookieLang = cookies.get("lang")?.value;
    let lang: "de" | "en";

    if (cookieLang === "de" || cookieLang === "en") {
      lang = cookieLang;
    } else {
      const header =
        request.headers.get("accept-language")?.toLowerCase() ?? "";
      lang = header.startsWith("de") ? "de" : "en";
      console.log(`browser language is ${lang}`);
      // set a cookie so the client can reuse it
      cookies.set("lang", lang, {
        path: "/",
        sameSite: "lax",
        httpOnly: false,
      });
    }

    locals.lang = lang;
    locals.isGerman = lang === "de";

    // Parse cookies from the request
    const password = cookies.get("password");

    // Get the current path
    const url = new URL(request.url);
    const path = url.pathname;

    // Skip authentication check for the login page itself and its form action
    if (path === "/login") {
      return await next();
    }

    // Check if auth cookie exists and is valid
    if (!password || password.value !== PASSWORD) {
      // If not authenticated, redirect to login page
      return redirect("/login");
    }

    // User is authenticated, proceed to the requested page
    return await next();
  }
);

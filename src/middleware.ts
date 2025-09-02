import { defineMiddleware } from 'astro:middleware'

// Define your secret password here (in a real app, use environment variables)
const CORRECT_PASSWORD = import.meta.env.PASSWORD;

export const onRequest = defineMiddleware(async ({ request, redirect, cookies }, next) => {
  // Parse cookies from the request
  const password = cookies.get("password")
  
  // Get the current path
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Skip authentication check for the login page itself and its form action
  if (path === '/login') {
    return await next();
  }
  
  // Check if auth cookie exists and is valid
  if (!password || password.value !== CORRECT_PASSWORD) {
    // If not authenticated, redirect to login page
    return redirect('/login');
  }
  
  // User is authenticated, proceed to the requested page
  return await next();
});
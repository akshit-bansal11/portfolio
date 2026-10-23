/*
 * theme.ts
 * Shared constants for the reader's light/dark choice. The key is the
 * blog's own, so a pick on the home page carries over to /blog.
 */

export const THEME_STORAGE_KEY = "blog-theme";

// Runs in <head> before first paint (static string, no input) so a stored
// choice never flashes: "light"/"dark" set data-theme, anything else leaves it off.
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

import { info, warning } from "https://deno.land/std@v0.55.0/log/mod.ts";
import {
  Application,
  send,
  Middleware,
} from "https://deno.land/x/oak@v5.0.0/mod.ts";

import {
  isNpmInstalled,
  restoreNpmPackages,
  runNpmScript,
} from "https://deno.land/x/helix/mod.ts";

info("Creating the Application");

const app = new Application();

info("Setting up CORS");
const cors: Middleware = (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  return next();
};

info("Setting up the Portal");
if (await isNpmInstalled()) {
  info("Restoring web dependencies");
  await restoreNpmPackages("./web/");
  info("Building the Portal");
  await runNpmScript("build", "./web/");
  info("Portal built successfully");
} else {
  warning(
    "Error trying to Setup the Portal, a static version may be served instead",
  );
}

const servePortal: Middleware = async (ctx) => {
  await send(ctx, ctx.request.url.pathname, {
    root: Deno.cwd() + "/web/public",
    index: "index.html",
  });
};

app.use(
  cors,
  servePortal,
);

info("Listening to port 8000");
await app.listen({ port: 8000 });

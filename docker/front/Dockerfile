FROM hayd/alpine-deno:1.1.1 as base-deno
WORKDIR /src
COPY ["../../front/*.ts", "./"]
RUN ["deno", "cache", "--unstable", "./app.ts"]
RUN ["deno", "bundle", "--unstable", "./app.ts", "front.bundle.js"]

FROM base-deno as base-npm
USER root
RUN apk add --update npm

FROM base-npm as final
EXPOSE 8000
WORKDIR /app
COPY --from=base-npm ["/src/front.bundle.js", "."]
COPY ["../../front/web/", "./portal/"]
CMD [ "run", "--allow-net", "--allow-read", "--allow-run", "--unstable", "./front.bundle.js" ]

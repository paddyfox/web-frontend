# web-frontend
This is an example front end React service for the purpose of teaching testing skills.

## Synopsis
> Important: This project uses plethora of dot files. If your container does not contain what you expect it is probably time to consult `.dockerignore` file.

## Application
React simple single page application.
Uses server side rendering in Node.js.

# How to run
## Local Node.js development
Requires Node.js v12 and npm, yarn ecosystem installed on your machine.
Uses port 3001.

If you do not have `yarn` installed this installs it globally.
`npm install -g yarn`

Install dependencies. This takes some time first time.
`yarn install`

Run dev environment with dev server on port 3001.
Runs with integrated HOT reload.
Runs with integrated linter.
`yarn start`

## To Run tests
`yarn test`

## Run standalone linter.
`yarn lint`

## Run standalone-audit. Checks installed packages for known vulnerabilities.
`yarn audit`

## Docker image
Exposes `/healthcheck` and `/version` endpoints.

`docker-compose.yml` defines BUILD_FORCE build argument.

- If set to `yes` it will rebuild everything for production.
- If set to anything else it will use content of `/build` directory for production image. This would be typically populated during running build command in development phase.

## Build production image.
If `BUILD_FORCE=yes` it will build and install all dependencies from base image.
`docker-compose build web-frontend-prod`

The same command without docker-compose. The last dot is important!
`docker build -t web-frontend-prod -f ./ops/Dockerfile --build-arg BUILD_FORCE=no --build-arg VERSION=0.0.1 .`

Run prod image.
Will also build before run if build not present.
`docker-compose up web-frontend-prod`

The same command without docker-compose.
`docker run -it -p 3000:3000 web-frontend-prod`

Or run in the background.
`docker-compose up -d web-frontend-prod`

The same command without docker-compose.
`docker run -d -p 3000:3000 web-frontend-prod`


## Endpoints
Non exhausting list of endpoints to get you started. Your dev environment will be on `localhost:3001`, e.g. full RUI to /healthcheck would be `localhost:3001/healthcheck`.
- /
- /healthcheck
- /version
- /create-record

## Coding style
This repository is using code style from official create react app.

## Useful resources
- https://github.com/veggiemonk/awesome-docker

## Useful docker commands
- docker volume ls # Lists the volumes.
- docker volume prune # Prunes the volumes. You may need to delete containers first.
- docker rm -v $(docker ps -a -q -f status=exited) # Remove exited containers.
- docker rmi $(docker images -f "dangling=true" -q) # Remove unwanted images.

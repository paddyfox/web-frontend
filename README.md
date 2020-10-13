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

# To Run tests
`yarn test`

# Run standalone linter.
yarn lint

# Run standalone audit. Checks installed packages for known vulnerabilities.
yarn audit
```

## Containerized development

> Important: This project uses plethora of dot files. If your container does not contain what you expect it is probably time to consult `.dockerignore` file.

Requires docker and docker-compose installed.

Uses port 3001.

Uses volumes.

_Note on Sass and volumes_: This application speaks Sass(CSS preprocessor).
However, Sass libraries for Node.js differ between operating systems and are generally incompatible. This is solved by anonymous volume for node_modules, so in a container you will have appropriate libraries installed.

2 services are defined in the provided `docker-compose.yml`, one for development and one for production.
During development you need too spin up only dev service named `lsr-dev` defined in docker-compose.yml file.

```
# Build dev image with HOT reloading.
# If `node_modules` not present in your volume it will install all dependencies into it.
docker-compose build lsr-dev

# The same command without docker-compose. The last dot is important!
docker build -t lsr-dev -f ./ops/Dockerfile-dev .

# Run dev image with HOT reloading.
# Will also build before run if the build is not present.
docker-compose up lsr-dev

# The same command without docker-compose.
docker volume create --name lsr_node_modules \
&& docker run -v `pwd`:/app -v lsr_node_modules:/app/node_modules -it -p 3001:3001 lsr-dev

# Or run in the background.
docker-compose up -d lsr-dev

# The same command without docker-compose.
docker volume create --name lsr_node_modules \
&& docker run -v `pwd`:/app -v lsr_node_modules:/app/node_modules -d -p 3001:3001 lsr-dev

# Run tests in a container, pass RUN_TESTS=true to container.
# Providing lsr_node_modules volume has been created earlier.
# Will run linter, tests and audit.
export RUN_TESTS=true && docker-compose up lsr-dev

# The same command without docker-compose.
# Providing lsr_node_modules volume has been created earlier.
docker run -e RUN_TESTS=true -v `pwd`:/app -v lsr_node_modules:/app/node_modules -it -p 3001:3001 lsr-dev

```

## Production image

Production version runs from Nginx base image serving React app.

Uses port 3000.

Uses BUILD_FORCE argument for build.

Exposes /healthcheck endpoint.

Requires docker.

`docker-compose.yml` defines BUILD_FORCE build argument.

- If set to `yes` it will rebuild everything for production.
- If set to anything else it will use content of `/build` directory for production image. This would be typically populated during running build command in development phase.

```
# Build production image.
# If `BUILD_FORCE=yes` it will build and install all dependencies from base image.
docker-compose build lsr-prod

# The same command without docker-compose. The last dot is important!
docker build -t lsr-prod -f ./ops/Dockerfile --build-arg BUILD_FORCE=no --build-arg VERSION=0.0.1 .

# Run prod image.
# Will also build before run if build not present.
docker-compose up lsr-prod

# The same command without docker-compose.
docker run -it -p 3000:3000 lsr-prod

# Or run in the background.
docker-compose up -d lsr-prod

# The same command without docker-compose.
docker run -d -p 3000:3000 lsr-prod

```
# Endpoints

Non exhausting list of endpoints to get you started. Your dev environment will be on `localhost:3001`, e.g. full RUI to /healthcheck would be `localhost:3001/healthcheck`.

- /
- /healthcheck
- /version
- /create-record

# Coding style

This repository is using code style from official create react app.

# Useful resources

- https://github.com/veggiemonk/awesome-docker

# Useful docker commands

- docker volume ls # Lists the volumes.
- docker volume prune # Prunes the volumes. You may need to delete containers first.
- docker rm -v $(docker ps -a -q -f status=exited) # Remove exited containers.
- docker rmi $(docker images -f "dangling=true" -q) # Remove unwanted images.

FROM node:12-alpine as react-build

ENV NPM_CONFIG_LOGLEVEL info
WORKDIR /app
VOLUME ["/app/node_modules"]

ARG http_proxy
ARG https_proxy
ARG no_proxy

ARG BUILD_FORCE
ENV BUILD_FORCE "$BUILD_FORCE"

COPY . .
RUN if [ "$BUILD_FORCE" = "yes" ]; \
    then yarn install --silent --ignore-optional && yarn build; \
    else echo 'Using prebuilt app in /build directory' && ls -la /app; \
    fi;

### Production stage
FROM node:12-alpine

WORKDIR /app
# VOLUME ["/app/node_modules"]

ARG VERSION
ENV VERSION "$VERSION"

ARG BUILD_DATETIME_UTC
ENV BUILD_DATETIME_UTC "$BUILD_DATETIME_UTC"

ARG BUILD_FORCE
ENV BUILD_FORCE "$BUILD_FORCE"

COPY --from=react-build /app /app
# COPY --from=react-build /app/build /app/build
# COPY ./ops/nginx.conf /etc/nginx/conf.d/default.template

### Building /version endpoint".
### Using envsubst for template variables replacement.
RUN if [ "$BUILD_FORCE" = "yes" ]; \
    then yarn install --prod --ignore-optional && ls -la /app/node_modules; \
    else echo 'Using prebuilt app in /build directory' && ls -la /app; \
    fi;

EXPOSE 3000
CMD ["yarn", "ssr"]
# CMD ["ls", "-la", "node_modules"]
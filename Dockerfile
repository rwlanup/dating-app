
# Base node image
FROM node:16-alpine

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Declaring user based arguments
ARG GROUP_ID
ARG GROUP_NAME
ARG USER_ID
ARG USER_NAME

# Removing default user
RUN deluser --remove-home node

# Adding user group
RUN addgroup --system --gid ${GROUP_ID} ${GROUP_NAME}
RUN adduser --system --uid ${USER_ID} ${USER_NAME}

# Working directory
WORKDIR /app
RUN chown ${USER_NAME}:${GROUP_NAME} /app

# Using given user for any action
USER ${USER_NAME}:${GROUP_NAME}

# Copy and install dependencies
COPY --chown=${USER_NAME}:${GROUP_NAME} package*.json .
RUN npm ci

# Run development server
CMD [ "npm", "run", "dev" ]
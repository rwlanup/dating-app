## Dating App

A dating app built for privacy or find your soul mates from your interests.

### Table of content

1. [Requirements](#requirements)
1. [Tech stack](#tech-stack)
1. [How to setup application?](#how-to-setup-application)
1. [Some helpful commands](#some-helpful-commands)

### Requirements

- [Docker](https://www.docker.com/)
- [Docker compose](https://docs.docker.com/compose/)

### Tech stack

- [Next.js](https://nextjs.org/)

  It uses Next.js as full stack framework.

- [Prisma](https://www.prisma.io/)

  It uses Prisma as database ORM. It uses MySQL database.

- [tRPC](https://trpc.io/)

  It uses tRPC for type safety between client and server side.

- [Tailwind](https://tailwindcss.com/)

  It uses tailwind css for styling purpose.

- [Next Auth](https://next-auth.js.org/)

  It uses Next Auth for authentication service.

### How to setup application?

1. First you need to install **[docker](https://www.docker.com/)** and **[docker compose](https://docs.docker.com/compose/)** in your system.
2. Create `env` file on root folder of project.
   Copy `sample.env` file from root project and replace all the values for your local system. You can find what values you need by using the command specified on `sample.env`.
3. To build the app for development purpose run
   ```
   docker compose build
   ```
4. To run the project run
   ```
   docker compose up
   ```
5. Then you can visit your app on [http://localhost:3000](http://localhost:3000)

### Some helpful commands

1. To get inside the application container, run
   ```
   docker exec -it dating-app sh
   ```
2. To run app on detached mode run

   ```
   docker compose up -d
   ```

3. To force recreate on container for running application run
   ```
   docker compose up --force-recreate
   ```
4. To build application without cache run
   ```
   docker compose build --no-cache
   ```
5. To kill application with volume run
   ```
   docker compose down -v
   ```

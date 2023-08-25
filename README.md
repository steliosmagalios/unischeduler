# UniScheduler

An application to create timetables for universities

## How to use

### Clerk

This application uses Clerk for authentication. To use this application, you need to create a new project on Clerk and add the secret and publishable keys for the project in the environment variables of the projects (`.env`).

This app also depends on webhooks to sync user clerk accounts with the database. Therefore, you also need to create two webhooks to the following endpoints:

- /api/webhooks/session
- /api/webhooks/user

For those endpoints, you also need to provide the webhook secrets to the relevant environment variables (`CLERK_WEBHOOK_SECRET_SESSION` and `CLERK_WEBHOOK_SECRET_USER`).

To test the webhooks locally, you can use a tunneling application (e.g. [ngrok](https://ngrok.com/)).

### Database migrations

This app uses Prisma. The migration files are located at `/prisma/migrations`. You need to perform the migrations manually.

### Scheduler

The scheduler used in the app to generate timetables is custom-made and available [here](https://github.com/steliosmagalios/university-scheduler). Since the scheduler is made in ECLiPSe Prolog you can use [this server](https://github.com/steliosmagalios/unischeduler-server) to run and interact with it.

### Running the application

To run the application you need to setup the environment based on the above paragraphs. Alternatively, you can use the included `docker-compose` file to start a postgres database and a scheduler.

NOTE: For the database to work properly you need to perform the migrations first. To perform the migrations you can use Prisma and run the following command `pnpm prisma migrate deploy`. Since this project uses `pnpm` it is advised to it instead of another package manager (e.e. `npm`). You can install `pnpm` by having nodejs installed and running the folowing command `npm install -g pnpm`.

## Docker

This app was built to be hosted in a docker-compose. You can run the whole app be having docker installed and running `docker-compose up`.

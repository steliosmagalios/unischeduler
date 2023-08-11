# UniScheduler

An application to create timetables for universities

## How to use

To use this application you need:

- A PostgreSQL database
- The university-scheduler prolog application. You can find it [here](https://github.com/steliosmagalios/university-scheduler)

The above are provided through a docker-compose file (see `docker-compose.yml`). You will also need to build the NextJS app to use in production.

To start the application simply `docker-compose up` the containers, `npm run build` the NextJS application (this requires to have node.js and npm installed in your machine), and voila.

## Scheduler Image

The docker image for the [university-scheduler](https://github.com/steliosmagalios/university-scheduler) is a SpringBoot server with a custom container of tomcat that ECLiPSe Prolog was installed into, you can find it [here](https://hub.docker.com/repository/docker/stmagalios/tomcat_eclipseclp)

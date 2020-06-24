# Public Accountability Chain

A public database tracking accountibility from various sources and APIs. Optionally submits BEACON hashes to
FUND Mainchain.

## Development

Docker, Docker Compose and `make` are the recommended minimum requirements for development.

1. Copy `.env.example` to `.env` and edit. Copy `.env` to `src/ui/.env.local`

2. Initialise the build environment

```bash 
make init-dev
```

Or without `make`:

```bash 
docker-compose -f docker-compose.builder.yml run --rm install
```

3. Run the development environment:

```bash 
make dev
```

Or, without `make`:

```bash 
docker-compose up
```

Once up, the front-end UI can be accessed via [http://localhost:3000](http://localhost:3000)

Changes can now be made, and will be hot loaded in the Docker environment.

To bring the composition down, hit Ctrl+C, then run:

```bash 
make dev-down
```

Or, without `make`:

```bash 
docker-compose down
```

**Note**: The Dockerised development environment does not at this time submit hashes to BEACON on Mainchain.
In order to test BEACON hash submission, FUND DevNet must be running, and PAC run outside
of Docker.

## Components

### src/daemon

The Daemon runs as a service gathering data from the available APIs. Data is standardised and structured
before being inserted into the MongoDB database.

### src/ui

A Next.js (REACT) front-end that reads data from the MongoDB database.

## Developing/testing outside Docker environment

A MongoDB service is required, either running locally or via the cloud.

1. Run `npm install`
2. Copy `example.env` to `.env` and edit. Copy `.env` to `src/ui/.env.local`
3. Run `npm run start-dev-stack`

## Static data attribution

The `the-counted-2015.csv` & `the-counted-2016.csv` data contained in the `data/static` 
directory obtained from [The Guardian](http://www.theguardian.com/thecounted)
and included here for convenience.

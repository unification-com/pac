# Public Accountability Chain

A public database tracking accountibility from various sources and APIs. Optionally submits BEACON hashes to
FUND Mainchain.

## Development - Quick Start

Requires Node JS >= v14.4.x

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

**Note**: the Docker composition internally runs the `start-dev-stack` script,
which only runs the UI and Data Daemon. It is intended for developers who wish to 
add data sources, or modify the UI.

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

There are currently 4 Daemons which can be run independently:

1. **Data Daemon** - gathers data from APIs and data sources, and standardises it into a common
data structure before inserting into the MongoDB collection. If an indident report exists, the
daemon will check from cross references and update the record with links to the duplicate data
as required.
2. **BEACON Daemon** - if BEACON variables have been configured in `.env`, this daemon will
submit the data hashes in batches to the Unification Mainchain. The hashes submitted
are generated from the standardised data.
3. **Merkle Tree Daemon** - generates a Merkle tree from the hashes that have been submitted to
Unification Mainchain. The root hash is also submitted to Mainchain.
4. **Backup Daemon** - creates a full backup of all collections in the MongoDb database. This backup
is saved to IPFS offering an immutible copy of the entire database to be
available at all times.

Daemons can be configured to run with the desired frequency using a tool such as `cron`

For example:

```bash 
crontab -e
```

and setting

```bash 
0 * * * * /path/to/node /path/to/lib/daemon data  >> /path/to/log_file.log 2>&1
```

will run the Data Daemon every hour, and log the results to a file

### src/ui

A Next.js (React) front-end that reads data from the MongoDB database.

## Developing/testing outside Docker environment

A MongoDB service is required, either running locally or via the cloud.

1. Run `npm install`
2. Copy `example.env` to `.env` and modify MongoDB settings etc. as required. 
3. Copy `.env` to `src/ui/.env.local`
4. Run `node src/db_utils/create_db.js` to create DB, collections and indexes
5. Run `npm run start-dev-stack`

**Note**: the `start-dev-stack` script will only run the UI and Data Daemon. It is intended
for developers who wish to add data sources, or modify the UI.

## Running in Production

TODO

## Static data attribution

The `the-counted-2015.csv` & `the-counted-2016.csv` data contained in the `data/static` 
directory obtained from [The Guardian](http://www.theguardian.com/thecounted)
and included here for convenience.

## Data Sources

The data used in `src/daemon/apis` is currently sourced from the following. More will be added over time.

- [Police Brutality](https://github.com/2020PB/police-brutality)
- [fatalencounters.org](https://fatalencounters.org)
- [The Guardian](https://www.theguardian.com/us-news/ng-interactive/2015/jun/01/about-the-counted)
- [Killed By Police](https://killedbypolice.net)
- [Mapping Police Violence](https://mappingpoliceviolence.org)
- [US Police Shootings](https://docs.google.com/spreadsheets/d/1cEGQ3eAFKpFBVq1k2mZIy5mBPxC6nBTJHzuSWtZQSVw)
- [Washington Post](https://raw.githubusercontent.com/washingtonpost/data-police-shootings/master/fatal-police-shootings-data.csv)

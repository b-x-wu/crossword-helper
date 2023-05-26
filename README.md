# Crossword Helper

## About

The goal of this project is to make crossword creation more accessible and streamline the process for those already experienced in the craft.

## Quick Start

To run the demo, first, download the crossword data from [here](https://xd.saul.pw/xd-clues.zip) (courtesy of [xd.saul.pw](https://xd.saul.pw/)). Save `clues.tsv` to the root directory of this project. Also, be sure to have MongoDB running on `localhost:27017`. Then, from the root directory, run

```bash
npm start:db
```

It may take a while before everything is inserted into the database, even past when the stream is done reading. To start the web server, run

```bash
npm start
cd client && npm start
```

and navigate to `localhost:3001`.

## Scope

Currently, this is just a demo. There's a million and one things that still need to be done.

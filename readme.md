# Agnostic Mesh Prototype

## Install Node.js

> https://nodejs.org/

## Clone this project

```sh
git clone git@github.com:agnostic-mesh/prototype.git agm-proto
```

## Get started

### Install dependencies

```sh
cd agm-proto

npm i -g yarn

yarn install
```

### Place .tsv files inside of `./tsv` folder

Please download the .tsv files from https://docs.google.com/spreadsheets/d/1B3G7IPvT-dHcHdp4mkLrzcW0Jtwy4xQ-D8qLlvztrRc/edit?usp=sharing

### Run

```sh
yarn dev
```

### And customize `.env` in project root folder

```
EXPORT_HTTP_PORT=3333
DEBUG=FALSE
```

### Try HTTP Exports

```
http://localhost:3333/....
```

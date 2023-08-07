# Electro App Backend API

![Node.js](https://img.shields.io/badge/-Node.js-43853d?style=flat-square&logo=Node.js&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-black?style=flat-square&logo=JSON%20web%20tokens)
![Express.js](https://img.shields.io/badge/-Express.js-404D59?style=flat-square)
![Mongoose](https://img.shields.io/badge/-Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-black?style=flat-square&logo=mongodb)

This repository contains the source code for the API for an Electricity Distribution Management Dashboard

## Getting Started

The following steps will ensure you can set up the project on your local nachine for development.


### System Requirements

- A Linux system based on Debian distributions such as Ubuntu (recommended).
- Windows users can install [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install-manual) to run the project.


### Prerequisites

- Node.js (v18.0 or later)
- MongoDB Compass


### Installing

1. Clone the repository:

```sh
git clone https://github.com/Adura-Hephzibah/electro_app_backend.git
```

2. Enter Project Repo

```sh
cd electro_app_backend
```

3. Install NPM packages:

```sh
npm install
```


## Setting Up Environment Variables

For development, create a `.env` file in root of the repo with the following variables: 
```bash
NODE_ENV=development
PORT=5000
MONGO_URI=Your_MongoDB_URI
JWT_SECRET=Your_own_secret
JWT_COOKIE_EXPIRES_IN=90
```

Include `.env` file in your `.gitignore` file.


## Running the Server

To start server after installing dependencies and setting up the `.env` file:

```sh
npm run server
```


## Testing 
The API can be tested using Postman
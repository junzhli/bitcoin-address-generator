# Backend APIs
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Bitcoin-Address-Generator](https://circleci.com/gh/junzhli/bitcoin-address-generator.svg?style=svg)

## Table of Contents
- [Backend APIs](#backend-apis)
  - [Table of Contents](#table-of-contents)
  - [Prerequisite](#prerequisite)
  - [Building](#building)
  - [Run](#run)
  - [Available APIs](#available-apis)
  - [Author](#author)
  - [License](#license)

Prerequisite
-----
* Nodejs >= v12
* Yarn

Building
-----

* Build
  
```bash
$ yarn install --frozen-lockfile
```

Run
-----
Open port at 8080 or specified one in environment variable `PORT`

* For development

Run server in dev mode
```bash
$ yarn start
```

Integration testing & testing unit
```bash
$ yarn test
```

Linting codebase
```bash
$ yarn run lint-fix
```

* For production

```bash
$ yarn run prod
```

Available APIs
-----

See on Swagger /api-docs or OpenAPI docs `swagger.json` (open with Swagger viewer) under root project for more details

Author
-----
Jeremy Li

License
-----
MIT License

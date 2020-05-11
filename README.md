# BRBAC

A middleware to authorizer paths with Vault, main functions as READ, WRITE, DELETE, LIST.

## Depends on
* [Roles & Profiles microservice](https://github.com/ExponentialEducation/roles-profiles-microservice)
* [Account microservice](https://github.com/ExponentialEducation/account-microservice)
* [Vault Server & Policies](https://github.com/braulioinf/vault-poc)
* [Firebase Certs](https://github.com/braulioinf/brbac#firebase)

## Firebase Certs
JSON firebase (required) in test path [Firebase Cert](https://raw.githubusercontent.com/ExponentialEducation/account-microservice/develop/firebase-admin.development.json?token=AANUGYNMJHMNP6INZE6BHT26YMEEE)

Copy `.json` to `test/` and `examples/express/` folders.

## Install (TODO)
```shell
$ npm <npm-project> install --save
```

## Quickstart
```js
const rbac = new RBAC(options)
rbac.initialize();

// return bool
const granted = rbac.authorizer(headers, method, path);
```

## Test
```shell
$ git clone git@github.com:braulioinf/brbac.git
$ cd project & npm install
$ yarn build
$ cd test & yarn test
```

## Exemples
* [ExpressJS]()

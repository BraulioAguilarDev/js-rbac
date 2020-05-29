# JS-RBAC

A middleware to authorizer paths with Vault, main functions as READ, WRITE, DELETE, LIST.

## Depends on
* [Roles & Profiles microservice](https://github.com/ExponentialEducation/roles-profiles-microservice)
* [Account microservice](https://github.com/ExponentialEducation/account-microservice)
* [Vault Server & Policies](https://github.com/braulioinf/vault-poc)

## Firebase config

Use .env file

```js
FIREBASE_PROJECTID=test_project
FIREBASE_CLIENTEMAIL=test_client
FIREBASE_PRIVATEKEY=test_private_key
```

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

## Examples
* [ExpressJS](https://github.com/ExponentialEducation/js-rbac/tree/develop/examples/express)

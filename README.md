# JS-RBAC

A middleware to authorizer paths with Vault, main functions as READ, WRITE, DELETE, LIST.

## Depends on
* [Roles & Profiles microservice](https://github.com/ExponentialEducation/roles-profiles-microservice)
* [Account microservice](https://github.com/ExponentialEducation/account-microservice)
* [Vault](https://github.com/ExponentialEducation/vault)

## Quickstart
```js
const rbac = new RBAC(options)
rbac.initialize();

// return bool
const granted = rbac.authorizer(headers, method, path);
```

## Test
```shell
$ git clone git@github.com:ExponentialEducation/js-rbac.git
$ cd project & npm install
$ yarn build
$ FIREBASE_PROJECTID="auth_test" FIREBASE_CLIENTEMAIL="firebase_test@authdemo.iam.gserviceaccount.com" FIREBASE_PRIVATEKEY="-----PRIVATE KEY-----" yarn test
```

## Examples
* [ExpressJS](https://github.com/ExponentialEducation/js-rbac/tree/develop/examples/express)

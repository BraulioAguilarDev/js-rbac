const RBAC = require('./../dist/rbac')

const VAULT_API = "http://127.0.0.1:8200"
const USERNAME = "authorizer"
const VAULT_PASSWORD = "helloworld"
const ROLES_API = "http://localhost:8080"

const Options = {
  username: USERNAME,
  password: VAULT_PASSWORD,
  vaultApi: VAULT_API,
  rolesApi: ROLES_API
};

const tests = [{
    input: {
      method: 'GET',
      role: 'admin',
      path: 'v1/data/lms/capture/programs'
    },
    want: true
  },
  {
    input: {
      method: 'GET',
      role: 'admin',
      path: 'v1/data/lms/capture/modules'
    },
    want: true
  },
  {
    input: {
      method: 'GET',
      role: 'qa',
      path: 'v1/data/lms/capture/sessions'
    },
    want: true
  },
  {
    input: {
      method: 'GET',
      role: 'qa',
      path: 'v1/data/lms/capture/programs'
    },
    want: true
  },
  {
    input: {
      method: 'GET',
      role: 'insdessr',
      path: 'v1/data/lms/capture/modules/publish'
    },
    want: true
  },
  {
    input: {
      method: 'POST',
      role: 'qa',
      path: 'v1/data/lms/capture/courses'
    },
    want: false
  },
  {
    input: {
      method: 'DELETE',
      role: 'insdes',
      path: 'v1/data/lms/capture/courses/publish'
    },
    want: false
  }
];


describe('Testing suit for RBAC functions', () => {
  const rbac = new RBAC(Options);

  test(`Running happy paht, Role:admin, Method:GET, PATH:v1/data/lms/capture/programs the output must be true.`, async () => {
    await rbac.initialize();

    const {
      input,
      want
    } = tests[0];
    const result = await rbac.GrantAccess([input.role], input.method, input.path);

    await expect(result).toBe(want);
  });

  tests.forEach(({
    input,
    want
  }) => {
    test(`Running request with [role:${input.role}], [method:${input.method}], [path:${input.path}] the output must be [granted:${want}]`, async () => {

      await rbac.initialize();
      const result = await rbac.GrantAccess([input.role], input.method, input.path);

      await expect(result).toBe(want);
    });
  });
});

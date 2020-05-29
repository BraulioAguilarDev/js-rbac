'use strict';

const express = require('express');
const RBAC = require('../../dist/rbac')

const VAULT_API = "https://vault.pitakill.net:8200"
const USERNAME = "authorizer"
const VAULT_PASSWORD = "helloworld"
const ROLE_API = "http://localhost:8080"

const options = {
  "username": USERNAME,
  "password": VAULT_PASSWORD,
  "vaultApi": VAULT_API,
  "rolesApi": ROLE_API
};

// Constants
const PORT = 9090;
const HOST = '0.0.0.0';
// App
const app = express();

const rbac = new RBAC(options)
rbac.initialize();

//  wrapper dummy
async function validaUser(req, res, next) {
  try {
    // Set headers for dummy request without Authorization header
    // When login implemented remove this
    const { authorization } = req.headers;
    const custumHeaders = Object.assign({}, req.headers, {
      'Authorization': authorization,
    });

    // example path tu use, "v1/data/lms/programs"
    var path = req.path.substring(1);

    // Main params
    const granted = await rbac.authorizer(custumHeaders, req.method, path);
    
    if (!granted) {
      res.status(403)
      res.json("You can't access this resource.")
      return
    }

    next()  
  } catch (e) {
    next(e.message)
  }
}

app.use(validaUser);

app.post('/v1/data/lms/capture/sessions', (req, res) => {
  res.json({
    "data": {
      "path": "v1/data/lms/capture/sessions",
      "granteds": ["admin", "insdes"],
      "mehods": ["POST"]
    }
  })
});

// roles: ["admin", "insdessr"]
app.get('/v1/data/lms/capture/programs/publish', (req, res) => {
  res.json({
    "data": {
      "path": "/v1/data/lms/capture/programs/publish",
      "granteds": ["admin", "insdessr"],
      "methods": ["GET"]
    }
  })
});

// roles: ["admin", "insdes", "qa", "insdessr"],
app.get('/v1/data/lms/capture/courses', (req, res) => {
  res.json({
    "data": {
      "path": "v1/data/lms/capture/courses",
      "granteds": ["admin", "insdes", "qa", "insdessr"],
      "methods": ["GET", "UPDATE"]
    }
  })
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

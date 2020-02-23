/* eslint-disable */
const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require("child_process");

const version = crypto.randomBytes(10).toString('hex');

const DOCKER_IMAGE = `gcr.io/revolution-uc-2020/api-server:${version}`;

const file = fs.readFileSync(__dirname + '/../kubernetes/deployment.yaml', 'utf8');
fs.writeFileSync(__dirname + '/../kubernetes/deployment.yaml', file.replace(/gcr\.io\/revolution-uc-2020\/api-server:([0-9]+\.[0-9]+\.[0-9]+)/g, DOCKER_IMAGE));

execSync(`docker build -t ${DOCKER_IMAGE} .`, {
  env: process.env,
  stdio: 'inherit'
});
execSync(`docker push ${DOCKER_IMAGE}`,{
  env: process.env,
  stdio: 'inherit'
});
execSync(`kubectl apply -f ${__dirname}/../kubernetes/`,{
  env: process.env,
  stdio: 'inherit'
});
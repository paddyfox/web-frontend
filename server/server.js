/*eslint semi: ["error", "always", { "omitLastInOneLineBlock": true}] */

import yenv from 'yenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import bodyParser from 'body-parser';
import ReactDOMServer from 'react-dom/server';

import { App } from '../src/App';

// Injected via consul during deployment.
const env = yenv('./config.yaml');

const extendLoggerConfig = {
  app: env.logs.app,
  error: env.logs.error,
  console: env.logs.console,
  dateRotate: env.logs.dateRotate,
  maxFiles: env.logs.maxFiles,
  meta: env.logs.meta,
  requestMeta: env.logs.requestMeta,
};

const SERVICE_NAME = env.services.dataGateway.v1.NAME || 'data-gateway';
const VERSION = process.env.VERSION || '0.0.1';
const BUILD_NUMBER = process.env.BUILD_NUMBER || '1';
const PORT = env.server.PORT || 3000;
const CREATE_LS_RECORD_URL = env.services.dataGateway.v1.URL + '/lsrecords';
const TIMEOUT_MILLISECOND = env.services.dataGateway.v1.TIMEOUT_MILLISECOND || 4000;

const app = express();

// Middleware.
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.use(express.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// Routing.
// IMPORTANT! Order of the routes is important.
app.get('/healthcheck', (req, res) => {
  res.send({ status: 'UP' });
});

app.get('/version', (req, res) => {
  fs.readFile(path.resolve('./ops/version.json'), 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      const errMessage = {
        status: 'error',
        code: 500,
        message: 'Sorry, could not find the template for the version..',
        details: err
      };

      return res.status(500).send(errMessage);
    }

    let version = {};
    try {
      let versionData = data.replace(
        '$VERSION',
        `${VERSION}`
      );
      versionData = versionData.replace(
        '$BUILD_NUMBER',
        `${BUILD_NUMBER}`
      );

      version = JSON.parse(versionData);
    } catch (err) {
      logger.error(err);
      return res.status(500).send('Sorry, could not parse the template for the version.');
    }

    logger.info('Version /version uri has been accessed.');
    return res.json(
      version
    );
  });
});

// React Server Side Rendered.
app.get('/*', (req, res) => {
  fs.readFile(path.resolve('./build/index.html'), 'utf-8', (err, data) => {
    if (err) {
      logger.error(err);
      return res.status(500).send('Sorry, something went wrong with the server side rendering.');
    }
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ReactDOMServer.renderToString(App)}</div>`
      )
    );
  });
});

app.post('/create-record', (req, res) => {
  const payload = req.body;

  // Trim form data.
  Object.keys(payload).map(key => payload[key] = payload[key].trim());

  axios({
    method: 'POST',
    url: CREATE_LS_RECORD_URL,
    data: payload,
    timeout: TIMEOUT_MILLISECOND,
  }).then((response) => {
    if (response.status === 200) {
      res.send(response.data);
    } else if (response.status === 500) {
      // Consider factory.
      const errMessage = {
        status: 'error',
        code: 500,
        message: `Service ${SERVICE_NAME} responded with internal error.`,
        details: response.data
      };

      logger.error(errMessage);

      return res.status(500).send(errMessage);
    } else {
      const errMessage = {
        status: 'error',
        code: 502,
        message: `Sorry, service ${SERVICE_NAME} could not process the request.`,
        details: response.data
      };

      logger.error(errMessage);
      return res.status(502).send(errMessage);
    }
  }).catch((err) => {
    logger.error(err);
    const errMessage = {
      status: 'error',
      code: 500,
      message: `Sorry, Something went wrong.`,
      details: err
    };

    return res.status(500).send(errMessage);
  });
});

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});

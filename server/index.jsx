// I REMOVED ALL ORIGIONAL COMMENTS
// I HAVE ADDED SOME MY OWN COMMENTS BELOW

import path from 'path';
import express from 'express';
import webpack from 'webpack';
import yields from 'express-yields';
import fs from 'fs-extra';
import App from '../src/App';
import { delay } from 'redux-saga';
import { renderToString } from 'react-dom/server'
import React from 'react'
import { argv } from 'optimist';
import { questions, question } from '../data/api-real-url';
import { get } from 'request-promise';
import { ConnectedRouter } from 'react-router-redux';
import getStore from '../src/getStore'
import { Provider } from 'react-redux';
import createHistory from 'history/createMemoryHistory';

// THIS IS OUR SHARED ROUTER
import { matchRoutes } from 'react-router-config';

const port = process.env.PORT || 3000;
const app = express();

// WANT USE A PROXY FOR API  ALLOWING THE SERVER TO FOCUS ON RENDERING
// app.use(
//   '/api',
//   proxy('http://react-ssr-api.herokuapp.com', {
//     proxyReqOptDecorator(opts) {
//       opts.headers['x-forwarded-host'] = 'localhost:3000';
//       return opts;
//     }
//   })
// );

const useServerRender = argv.useServerRender === 'true';
const useLiveData = argv.useLiveData === 'true';

if(process.env.NODE_ENV === 'development') {
    const config = require('../webpack.config.dev.babel.js').default;
    const compiler = webpack(config);
    app.use(require('webpack-dev-middleware')(compiler,{
        noInfo: true,
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }
    }));
    app.use(require('webpack-hot-middleware')(compiler));
} else {
    app.use(express.static(path.resolve(__dirname, '../dist')));
}

// I WANT USE SHARED ROUTER WITH A FUCNTION TO GET DATA IF REQUIRED BY THE ROUTE
// SO ALL QUESTIONS STUFF THAT WAS HERE HAS TO GO

// USING A STAR INSTEAD AS WE WANT USE A ROUTER
app.get("*", function *(req,res){

    let index = yield fs.readFile('./public/index.html',"utf-8");

    const history = createHistory({
        initialEntries: [req.path],
    });

    // DIFFERENT CREATE STORE
    const store = getStore(history, { questions: [] });

    // NEED CYCLE THROUGH ROUTES AND GET DATA WHERE REQUIRED
    const promises = matchRoutes(Routes, req.path)
      .map(({ route }) => route.loadData ? route.loadData(store) : null)
      .map(promise => {
        if (promise) {
          return new Promise((resolve, reject) => {
            promise.then(resolve).catch(resolve);
          });
        }
      });

    // ADDITION PROMISE WRAPPER SO THAT ALL PROMISES ABOVE RESOLVE EVEN IF ONE FAILED
    Promise.all(promises).then(() => {
      // NOW WE RUN CODE IN HERE
      if (useServerRender) {
          const appRendered = renderToString(
              <Provider store={store}>
                  <ConnectedRouter history={history}>
                      <App />
                  </ConnectedRouter>
              </Provider>
          );
          index = index.replace(`<%= preloadedApplication %>`, appRendered)
      } else {
          index = index.replace(`<%= preloadedApplication %>`,`Please wait while we load the application.`);
      }
      res.send(index);
    });

});

app.listen(port, '0.0.0.0', ()=>console.info(`Listening at http://localhost:${port}`));

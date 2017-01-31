/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const _ = require('lodash')
const Promise = require('bluebird')
const retry = require('bluebird-retry')

const Horseman = require('node-horseman')

const UserAgent = require('./user-agent')

function vote (pollUrl, pollId, pollOptionId, evaluate) {
  const userAgent = UserAgent.getRandom()

  return this.horseman
    .on('alert', (message) => {
      throw new Error(message)
    })
    .on('error', (message) => {
      throw new Error(message)
    })
    .cookies([]) // clear cookies
    .userAgent(userAgent)
    .openTab(pollUrl)
    .evaluate(evaluate, pollId, pollOptionId)
    .closeTab(0)
}

class PollMommy {
  constructor (options = {}) {
    this.options = _.defaults(options, { timeout: 30000, maxRetries: 0, retryInterval: 1000 })

    this.horseman = new Horseman({
      phantomPath: 'node_modules/.bin/phantomjs',
      loadImages: false,
      timeout: this.options.timeout,
      proxy: this.options.proxy,
      proxyType: this.options.proxyType,
      proxyAuth: this.options.proxyAuth,
      injectBluebird: true,
      webSecurity: false
    })
  }

  vote (pollUrl, pollId, pollOptionId) {
    if (!pollUrl || !pollId || !pollOptionId) {
      return Promise.reject(new Error('invalid parameters'))
    }

    const evaluate = function (pollId, pollOptionId) {
      /* eslint-disable */
      var p = pollId;
      var a = pollOptionId + ',';
      var b = 1;
      var o = '';
      var va = 0;
      var cookie = 0;
      var url = encodeURIComponent(window.location.origin);
      var now = new Date().getTime();

      return new Promise(function (resolve, reject) {
        $.ajax({
          url: 'http://static.polldaddy.com/p/' + p + '.js',
          type: 'GET',
          crossDomain: true,
          success: function (data, status, xhr) {
            var h;
            try {
              h = data.match(/var PDV_h\d+ = \'(.*)\';/)[ 1 ];
            } catch (error) {
              return reject(error)
            }

            resolve(h);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            reject(errorThrown)
          }
        });
      })
        .then(function (h) {
          return new Promise(function (resolve, reject) {
            $.ajax({
              url: 'https://polldaddy.com/n/' + h + '/' + p + '?' + now,
              type: 'GET',
              crossDomain: true,
              success: function (data, status, xhr) {
                var n;
                try {
                  n = data.match(/PDV_n\d+=\'(.*)\';.*/)[ 1 ];
                } catch (error) {
                  return reject(error)
                }

                resolve(n);
              },
              error: function (jqXHR, textStatus, errorThrown) {
                reject(errorThrown)
              }
            });
          })
        })
        .then(function (n) {
          return new Promise(function (resolve, reject) {
            $.ajax({
              url: 'http://polls.polldaddy.com/vote-js.php?p=' + p + '&a=' + a + '&b=' + b + '&o=' + o + '&va=' + va + '&cookie=' + cookie + '&n=' + n + '&url=' + url,
              type: 'GET',
              crossDomain: true,
              success: function (data, status, xhr) {
                resolve();
              },
              error: function (jqXHR, textStatus, errorThrown) {
                reject(errorThrown)
              }
            });
          })
        });
      /* eslint-enable */
    }

    return retry(() => vote.bind(this)(pollUrl, pollId, pollOptionId, evaluate),
      { max_tries: this.options.maxRetries, interval: this.options.retryInterval })
  }
}

module.exports = PollMommy

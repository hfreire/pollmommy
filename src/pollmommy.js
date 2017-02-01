/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const _ = require('lodash')
const Promise = require('bluebird')

const Nightmare = require('nightmare')

const UserAgent = require('./user-agent')

const path = require('path')

function vote (pollUrl, pollId, pollOptionId, evaluate) {
  const userAgent = UserAgent.getRandom()

  return this.nightmare
    .useragent(userAgent)
    .goto(pollUrl)
    .inject('js', path.join(__dirname, '../share/jquery/jquery-3.1.0.min.js'))
    .evaluate(evaluate, pollId, pollOptionId)
    .end()
}

class PollMommy {
  constructor (options = {}) {
    this.options = _.defaults(options, { timeout: 30000 })

    this.nightmare = Nightmare({
      show: false,
      webPreferences: {
        webSecurity: false
      }
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

    return vote.bind(this)(pollUrl, pollId, pollOptionId, evaluate)
  }
}

module.exports = PollMommy

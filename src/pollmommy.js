/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const POLLDADDY_URL = 'https://polldaddy.com/poll'

const _ = require('lodash')
const Promise = require('bluebird')
const retry = require('bluebird-retry')

const Horseman = require('node-horseman')

const UserAgent = require('./user-agent')

function vote (pollUrl, pollOptionId) {
  return this.horseman
    .on('alert', (message) => {
      throw new Error(message)
    })
    .on('error', (message) => {
      throw new Error(message)
    })
    .cookies([]) // clear cookies
    .userAgent(UserAgent.getRandom())
    .open(pollUrl)
    .click(`label[for=${pollOptionId}]`)
    .evaluate(function () {
      /* eslint-disable */
      function vote () {
        var F = jQuery(".vote-button").data("vote");
        log(F);
        var G = "";
        var E = "";
        var C = "PDjs_poll_" + F.id + (F.v > 0 ? "_" + F.v : "");
        log(C);
        for (i = 0; i < document.formPoll.elements.length; i++) {
          if (document.formPoll.elements[ i ].type == "checkbox" || document.formPoll.elements[ i ].type == "radio") {
            if (document.formPoll.elements[ i ].checked) {
              G += document.formPoll.elements[ i ].value + ","
            }
          }
        }
        if (document.formPoll.pz !== undefined) {
          var B = document.formPoll.pz.value
        } else {
          var B = 1
        }
        if (parseInt(F.o) == 1) {
          E = _$("PDI_OtherText").value
        }
        if (typeof document.formPoll.tags != "undefined") {
          tags = "&tags=" + urlEncode(document.formPoll.tags.value)
        } else {
          tags = ""
        }
        if (G.length > 0 || E.length > 0) {
          url = "/vote.php?va=" + F.at + tags + "&pt=" + F.m + "&r=" + F.b + "&p=" + F.id + "&a=" + urlEncode(G) + "&o=" + urlEncode(E) + "&t=" + F.t + "&token=" + F.n + "&pz=" + B;
          if (F.b > 0) {
            if (getCookie(C, F.e) == "true") {
              url = "/poll/" + F.id + "/?view=results&msg=revoted"
            } else {
              setCookie(C, F.e)
            }
          }
          location.href = url
        } else {
          alert(alert_no_answer)
        }
      }

      vote();
      /* eslint-enable */
    })
}

class PollMommy {
  constructor (options = {}) {
    const _options = _.defaults(options, { timeout: 10000, maxRetries: 5, retryInterval: 1000 })

    this.horseman = new Horseman({
      phantomPath: 'node_modules/.bin/phantomjs',
      loadImages: false,
      timeout: _options.timeout,
      proxy: _options.proxy,
      proxyType: _options.proxyType,
      proxyAuth: _options.proxyAuth
    })

    this.maxRetries = _options.maxRetries
    this.retryInterval = _options.retryInterval
  }

  vote (pollId, pollOptionId) {
    if (!pollId || !pollOptionId) {
      return Promise.reject(new Error('invalid parameters'))
    }

    const pollUrl = `${POLLDADDY_URL}/${pollId}/`

    return retry(() => vote.bind(this)(pollUrl, pollOptionId),
      { max_tries: this.maxRetries, interval: this.retryInterval })
  }
}

module.exports = PollMommy

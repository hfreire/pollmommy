/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const _ = require('lodash')
const Promise = require('bluebird')

const Nightmare = require('nightmare')
Nightmare.Promise = Promise

const RandomHttpUserAgent = require('random-http-useragent')

const { join } = require('path')

const jqueryPath = join(__dirname, '../share/jquery/jquery-3.1.0.min.js')

const vote = require('./vote')

const defaultOptions = {
  nightmare: {
    show: false,
    webPreferences: {
      webSecurity: false
    }
  },
  'random-http-useragent': {}
}

class Pollmommy {
  constructor (options = {}) {
    this._options = _.defaultsDeep(options, defaultOptions)

    RandomHttpUserAgent.configure(_.get(this._options, 'random-http-useragent'))
  }

  vote (pollUrl, pollId, pollOptionId) {
    return Promise.try(() => {
      if (!pollUrl || !pollId || !pollOptionId) {
        throw new Error('invalid arguments')
      }
    })
      .then(() => RandomHttpUserAgent.get())
      .then((userAgent) => {
        const nightmare = Nightmare(this._options.nightmare)

        return nightmare
          .useragent(userAgent)
          .goto(pollUrl)
          .inject('js', jqueryPath)
          .evaluate(vote, pollId, pollOptionId)
          .end()
          .catch(() => {
            throw new Error('poll not available')
          })
      })
  }
}

module.exports = Pollmommy

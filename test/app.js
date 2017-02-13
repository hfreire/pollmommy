/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('app', () => {
  let subject // eslint-disable-line no-unused-vars
  let commander
  let pollmommy
  let log
  let error

  before(() => {
    pollmommy = td.object([ 'vote' ])
  })

  beforeEach(() => {
    commander = td.replace('commander', td.object([ 'version', 'arguments', 'action', 'parse', 'outputHelp' ]))

    const captor = td.matchers.captor()

    td.when(commander.version(), { ignoreExtraArgs: true }).thenReturn(commander)
    td.when(commander.arguments(), { ignoreExtraArgs: true }).thenReturn(commander)
    td.when(commander.action(captor.capture())).thenReturn(commander)
    td.when(commander.parse(), { ignoreExtraArgs: true }).thenDo(() => {
      const action = captor.value

      action('my-poll-url', 'my-poll-id', 'my-poll-option-id')

      return commander
    })

    td.replace('../lib', function () { return pollmommy })
  })

  afterEach(() => {
    td.reset()
  })

  describe('when voting', () => {
    beforeEach(() => {
      td.when(pollmommy.vote(), { ignoreExtraArgs: true }).thenResolve()
    })

    afterEach(() => {
      delete require.cache[ require.resolve('../src/app') ]
    })

    it('should set commander version', (done) => {
      log = console.log
      console.log = td.function()

      subject = require('../src/app')

      td.verify(commander.version(), { times: 1, ignoreExtraArgs: true })

      setTimeout(() => {
        console.log = log

        done()
      }, 10)
    })

    it('should vote', (done) => {
      log = console.log
      console.log = td.function()

      subject = require('../src/app')

      td.verify(pollmommy.vote(), { times: 1, ignoreExtraArgs: true })

      setTimeout(() => {
        console.log = log

        done()
      }, 10)
    })

    it('should write "Voted successfully!" to stdout', (done) => {
      log = console.log
      console.log = td.function()

      subject = require('../src/app')

      setTimeout(() => {
        td.verify(console.log('Voted successfully!'), { times: 1 })

        console.log = log

        done()
      }, 10)
    })
  })

  describe('when failing to vote', () => {
    const _error = new Error('my-error-message')

    beforeEach(() => {
      td.when(pollmommy.vote(), { ignoreExtraArgs: true }).thenReject(_error)
    })

    afterEach(() => {
      delete require.cache[ require.resolve('../src/app') ]
    })

    it('should write error to stderr', (done) => {
      error = console.error
      console.error = td.function()

      subject = require('../src/app')

      setTimeout(() => {
        td.verify(console.error(_error), { times: 1 })

        console.error = error

        done()
      }, 10)
    })
  })
})

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
  let exit

  before(() => {
    pollmommy = td.object([ 'vote' ])
  })

  beforeEach(() => {
    commander = td.replace('commander', td.object([ 'version', 'arguments', 'action', 'parse', 'outputHelp' ]))

    td.when(commander.version(), { ignoreExtraArgs: true }).thenReturn(commander)
    td.when(commander.arguments(), { ignoreExtraArgs: true }).thenReturn(commander)

    td.replace('../lib', function () { return pollmommy })
  })

  afterEach(() => {
    td.reset()
  })

  describe('when voting successfully', () => {
    beforeEach(() => {
      const captor = td.matchers.captor()

      td.when(commander.action(captor.capture())).thenReturn(commander)
      td.when(commander.parse(), { ignoreExtraArgs: true }).thenDo(() => {
        const action = captor.value

        action('my-poll-url', 'my-poll-id', 'my-poll-option-id')

        return commander
      })

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

    it('should set commander arguments', (done) => {
      log = console.log
      console.log = td.function()

      subject = require('../src/app')

      td.verify(commander.arguments('<pollUrl> <pollId> <pollOptionId>'), { times: 1 })

      setTimeout(() => {
        console.log = log

        done()
      }, 10)
    })

    it('should parse process arguments', (done) => {
      log = console.log
      console.log = td.function()

      subject = require('../src/app')

      td.verify(commander.parse(process.argv), { times: 1 })

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

  describe('when failing to vote because of arguments', () => {
    beforeEach(() => {
      td.when(commander.action(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.parse(), { ignoreExtraArgs: true }).thenReturn(commander)

      td.when(pollmommy.vote(), { ignoreExtraArgs: true }).thenResolve()
    })

    afterEach(() => {
      delete require.cache[ require.resolve('../src/app') ]
    })

    it('should process exit with value 1', () => {
      log = console.log
      console.log = td.function()

      exit = process.exit
      process.exit = td.function()

      subject = require('../src/app')

      td.verify(process.exit(1), { times: 1 })

      console.log = log

      process.exit = exit
    })
  })

  describe('when failing to vote because of error', () => {
    const _error = new Error('my-error-message')

    beforeEach(() => {
      const captor = td.matchers.captor()

      td.when(commander.action(captor.capture())).thenReturn(commander)
      td.when(commander.parse(), { ignoreExtraArgs: true }).thenDo(() => {
        const action = captor.value

        action('my-poll-url', 'my-poll-id', 'my-poll-option-id')

        return commander
      })

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

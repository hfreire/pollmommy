/* eslint-disable no-unused-vars,unicorn/no-process-exit */

/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('App', () => {
  let subject
  let commander
  let Pollmommy

  before(() => {
    Pollmommy = td.constructor([ 'vote' ])

    commander = td.object([ 'version', 'arguments', 'action', 'parse', 'outputHelp' ])
  })

  afterEach(() => td.reset())

  describe('when voting successfully', () => {
    let log

    before(() => {
      log = console.log
    })

    beforeEach(() => {
      console.log = td.function()

      const captor = td.matchers.captor()
      td.when(commander.version(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.arguments(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.action(captor.capture())).thenReturn(commander)
      td.when(commander.parse(), { ignoreExtraArgs: true }).thenDo(() => {
        const action = captor.value

        action('my-poll-url', 'my-poll-id', 'my-poll-option-id')

        return commander
      })
      td.replace('commander', commander)

      td.when(Pollmommy.prototype.vote(), { ignoreExtraArgs: true }).thenResolve()
      td.replace('../lib/pollmommy', Pollmommy)

      subject = require('../src/app')
    })

    after(() => {
      console.log = log
    })

    it('should set commander version', () => {
      td.verify(commander.version(), { times: 1, ignoreExtraArgs: true })
    })

    it('should set commander arguments', () => {
      td.verify(commander.arguments('<pollUrl> <pollId> <pollOptionId>'), { times: 1 })
    })

    it('should parse process arguments', () => {
      td.verify(commander.parse(process.argv), { times: 1 })
    })

    it('should vote', () => {
      td.verify(Pollmommy.prototype.vote(), { times: 1, ignoreExtraArgs: true })
    })

    it('should write "Voted successfully!" to stdout', (done) => {
      setImmediate(() => {
        td.verify(console.log('Voted successfully!'), { times: 1 })

        done()
      })
    })
  })

  describe('when failing to vote because of arguments', () => {
    let log
    let error
    let exit

    before(() => {
      log = console.log

      exit = process.exit
    })

    beforeEach(() => {
      console.log = td.function()

      process.exit = td.function()

      td.when(commander.version(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.arguments(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.action(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.parse(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.replace('commander', commander)

      td.when(Pollmommy.prototype.vote(), { ignoreExtraArgs: true }).thenResolve()
      td.replace('../lib/pollmommy', Pollmommy)

      subject = require('../src/app')
    })

    after(() => {
      console.log = log

      process.exit = exit
    })

    it('should process exit with value 1', () => {
      td.verify(process.exit(1), { times: 1 })
    })
  })

  describe('when failing to vote because of error', () => {
    let error

    const _error = new Error('my-error-message')

    before(() => {
      error = console.error
    })

    beforeEach(() => {
      console.error = td.function()

      const captor = td.matchers.captor()
      td.when(commander.version(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.arguments(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.action(captor.capture())).thenReturn(commander)
      td.when(commander.parse(), { ignoreExtraArgs: true }).thenDo(() => {
        const action = captor.value

        action('my-poll-url', 'my-poll-id', 'my-poll-option-id')

        return commander
      })
      td.replace('commander', commander)

      td.when(Pollmommy.prototype.vote(), { ignoreExtraArgs: true }).thenReject(_error)
      td.replace('../lib/pollmommy', Pollmommy)

      subject = require('../src/app')
    })

    after(() => {
      console.error = error
    })

    it('should write error to stderr', (done) => {
      setImmediate(() => {
        td.verify(console.error(_error), { times: 1 })

        done()
      })
    })
  })

  describe('when catching an uncaught exception', () => {
    let error
    let on
    let exit
    let callback
    const _error = new Error('my-error-message')

    before(() => {
      error = console.error

      on = process.on
      exit = process.exit
    })

    beforeEach(() => {
      console.error = td.function()

      process.on = td.function()
      process.exit = td.function()

      td.when(process.on('uncaughtException'), { ignoreExtraArgs: true }).thenDo((event, _callback) => { callback = _callback })

      const captor = td.matchers.captor()
      td.when(commander.version(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.arguments(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.action(captor.capture())).thenReturn(commander)
      td.when(commander.parse(), { ignoreExtraArgs: true }).thenDo(() => {
        const action = captor.value

        action('my-poll-url', 'my-poll-id', 'my-poll-option-id')

        return commander
      })
      td.replace('commander', commander)

      td.when(Pollmommy.prototype.vote(), { ignoreExtraArgs: true }).thenReject(_error)
      td.replace('../lib/pollmommy', Pollmommy)

      subject = require('../src/app')
    })

    after(() => {
      console.error = error

      process.on = on
      process.exit = exit
    })

    it('should log error', () => {
      callback(_error)

      setImmediate(() => td.verify(console.error(_error), { times: 1 }))
    })

    it('should exit process with return value 1', () => {
      callback()

      setImmediate(() => td.verify(process.exit(1), { times: 1 }))
    })
  })

  describe('when catching an unhandled rejection', () => {
    let error
    let on
    let exit
    let callback
    const _error = new Error('my-error-message')

    before(() => {
      error = console.error

      on = process.on
      exit = process.exit
    })

    beforeEach(() => {
      console.error = td.function()

      process.on = td.function()
      process.exit = td.function()

      td.when(process.on('unhandledRejection'), { ignoreExtraArgs: true }).thenDo((event, _callback) => { callback = _callback })

      const captor = td.matchers.captor()
      td.when(commander.version(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.arguments(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.action(captor.capture())).thenReturn(commander)
      td.when(commander.parse(), { ignoreExtraArgs: true }).thenDo(() => {
        const action = captor.value

        action('my-poll-url', 'my-poll-id', 'my-poll-option-id')

        return commander
      })
      td.replace('commander', commander)

      td.when(Pollmommy.prototype.vote(), { ignoreExtraArgs: true }).thenReject(_error)
      td.replace('../lib/pollmommy', Pollmommy)

      subject = require('../src/app')
    })

    after(() => {
      console.error = error

      process.on = on
      process.exit = exit
    })

    it('should log error', () => {
      callback(_error)

      setImmediate(() => td.verify(console.error(_error), { times: 1 }))
    })

    it('should exit process with return value 1', () => {
      callback()

      setImmediate(() => td.verify(process.exit(1), { times: 1 }))
    })
  })
})

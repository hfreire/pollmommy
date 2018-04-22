/* eslint-disable no-unused-vars,unicorn/no-process-exit */

/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('App', () => {
  let subject
  let commander
  let Pollmommy

  before(() => {
    Pollmommy = td.constructor([ 'vote' ])

    commander = td.object([ 'version', 'option', 'parse', 'outputHelp' ])
  })

  afterEach(() => td.reset())

  describe('when voting successfully', () => {
    const pollUrl = 'my-poll-url'
    const pollId = 'my-poll-id'
    const pollOptionId = 'my-poll-option-id'
    let log

    before(() => {
      log = console.log

      console.log = td.function()

      commander.pollUrl = pollUrl
      commander.pollId = pollId
      commander.pollOptionId = pollOptionId
    })

    beforeEach(() => {
      td.when(commander.version(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.option(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.parse(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.replace('commander', commander)

      td.when(Pollmommy.prototype.vote(), { ignoreExtraArgs: true }).thenResolve()
      td.replace('../lib/pollmommy', Pollmommy)

      subject = require('../src/app')
    })

    after(() => {
      console.log = log

      delete commander.pollUrl
      delete commander.pollId
      delete commander.pollOptionId
    })

    it('should set commander version', () => {
      td.verify(commander.version(), { times: 1, ignoreExtraArgs: true })
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
    let exit

    before(() => {
      log = console.log

      console.log = td.function()

      exit = process.exit

      process.exit = td.function()
    })

    beforeEach(() => {
      td.when(commander.version(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.option(), { ignoreExtraArgs: true }).thenReturn(commander)
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
    const pollUrl = 'my-poll-url'
    const pollId = 'my-poll-id'
    const pollOptionId = 'my-poll-option-id'
    let error
    let exit
    const _error = new Error('my-error-message')

    before(() => {
      error = console.error

      console.error = td.function()

      exit = process.exit

      process.exit = td.function()

      commander.pollUrl = pollUrl
      commander.pollId = pollId
      commander.pollOptionId = pollOptionId
    })

    beforeEach(() => {
      td.when(commander.version(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.option(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.parse(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.replace('commander', commander)

      td.when(Pollmommy.prototype.vote(), { ignoreExtraArgs: true }).thenReject(_error)
      td.replace('../lib/pollmommy', Pollmommy)

      subject = require('../src/app')
    })

    after(() => {
      console.error = error

      process.exit = exit

      delete commander.pollUrl
      delete commander.pollId
      delete commander.pollOptionId
    })

    it('should write error to stderr', (done) => {
      setImmediate(() => {
        td.verify(console.error(`Error: ${_error.message}`), { times: 1 })

        done()
      })
    })
  })

  describe('when catching an uncaught exception', () => {
    const pollUrl = 'my-poll-url'
    const pollId = 'my-poll-id'
    const pollOptionId = 'my-poll-option-id'
    let error
    let on
    let exit
    let callback
    const _error = new Error('my-error-message')

    before(() => {
      error = console.error

      console.error = td.function()

      on = process.on

      process.on = td.function()

      exit = process.exit

      process.exit = td.function()

      commander.pollUrl = pollUrl
      commander.pollId = pollId
      commander.pollOptionId = pollOptionId
    })

    beforeEach(() => {
      td.when(process.on('uncaughtException'), { ignoreExtraArgs: true }).thenDo((event, _callback) => { callback = _callback })

      td.when(commander.version(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.option(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.parse(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.replace('commander', commander)

      td.when(Pollmommy.prototype.vote(), { ignoreExtraArgs: true }).thenReject(_error)
      td.replace('../lib/pollmommy', Pollmommy)

      subject = require('../src/app')
    })

    after(() => {
      console.error = error

      process.on = on

      process.exit = exit

      delete commander.pollUrl
      delete commander.pollId
      delete commander.pollOptionId
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
    const pollUrl = 'my-poll-url'
    const pollId = 'my-poll-id'
    const pollOptionId = 'my-poll-option-id'
    let error
    let on
    let exit
    let callback
    const _error = new Error('my-error-message')

    before(() => {
      error = console.error

      console.error = td.function()

      on = process.on

      process.on = td.function()

      exit = process.exit

      process.exit = td.function()

      commander.pollUrl = pollUrl
      commander.pollId = pollId
      commander.pollOptionId = pollOptionId
    })

    beforeEach(() => {
      td.when(process.on('unhandledRejection'), { ignoreExtraArgs: true }).thenDo((event, _callback) => { callback = _callback })

      td.when(commander.version(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.option(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.when(commander.parse(), { ignoreExtraArgs: true }).thenReturn(commander)
      td.replace('commander', commander)

      td.when(Pollmommy.prototype.vote(), { ignoreExtraArgs: true }).thenReject(_error)
      td.replace('../lib/pollmommy', Pollmommy)

      subject = require('../src/app')
    })

    after(() => {
      console.error = error

      process.on = on

      process.exit = exit

      delete commander.pollUrl
      delete commander.pollId
      delete commander.pollOptionId
    })

    it('should log error', () => {
      callback(_error)

      setImmediate(() => td.verify(console.error(_error), { times: 1 }))
    })

    it('should exit process with return value 1', () => {
      callback()

      setImmediate(() => td.verify(process.exit(1)))
    })
  })
})

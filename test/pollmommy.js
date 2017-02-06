/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('pollmommy', () => {
  let Pollmommy
  let subject
  let nightmare
  let RandomUserAgent

  before(() => {
    RandomUserAgent = td.replace('random-http-useragent', td.object('get'))

    nightmare = td.object([ 'useragent', 'goto', 'inject', 'evaluate', 'end' ])
    td.replace('nightmare', function () { return nightmare })

    Pollmommy = require('../src/pollmommy')
  })

  beforeEach(() => {
    td.when(nightmare.useragent(td.matchers.anything())).thenReturn(nightmare)
    td.when(nightmare.goto(td.matchers.anything())).thenReturn(nightmare)
    td.when(nightmare.inject(td.matchers.anything(), td.matchers.anything())).thenReturn(nightmare)
    td.when(nightmare.evaluate(td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(nightmare)
    td.when(nightmare.end()).thenResolve()
  })

  afterEach(() => {
    td.reset()
  })

  describe('when voting successfully', () => {
    const pollUrl = 'my-url'
    const pollId = 'my-poll-id'
    const pollOptionId = 'my-poll-option-id'
    const maxRetries = 0
    const userAgent = 'my-user-agent'

    before(() => {
      subject = new Pollmommy({ maxRetries })
    })

    beforeEach(() => {
      td.when(RandomUserAgent.get()).thenResolve(userAgent)
    })

    it('should fulfill promise', () => {
      const result = subject.vote(pollUrl, pollId, pollOptionId)

      return result.should.be.fulfilled
    })

    it('should set user agent', () => {
      return subject.vote(pollUrl, pollId, pollOptionId)
        .then(() => {
          const captor = td.matchers.captor()

          td.verify(nightmare.useragent(captor.capture()), { times: 1 })

          const _userAgent = captor.value

          _userAgent.should.be.eql(userAgent)
        })
    })

    it('should open url in tab', () => {
      return subject.vote(pollUrl, pollId, pollOptionId)
        .then(() => {
          const captor = td.matchers.captor()

          td.verify(nightmare.goto(captor.capture()), { times: 1 })

          const _pollUrl = captor.value

          _pollUrl.should.be.eql(pollUrl)
        })
    })

    it('should evaluate javascript', () => {
      return subject.vote(pollUrl, pollId, pollOptionId)
        .then(() => {
          const evaluateCaptor = td.matchers.captor()
          const pollIdCaptor = td.matchers.captor()
          const pollOptionIdCaptor = td.matchers.captor()

          td.verify(nightmare.evaluate(evaluateCaptor.capture(), pollIdCaptor.capture(), pollOptionIdCaptor.capture()), { times: 1 })

          const _evaluate = evaluateCaptor.value
          const _pollId = pollIdCaptor.value
          const _pollOptionId = pollOptionIdCaptor.value

          _evaluate.should.not.be.null
          _pollId.should.be.eql(pollId)
          _pollOptionId.should.be.eql(pollOptionId)
        })
    })
  })
})

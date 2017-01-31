/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('pollmommy', () => {
  let PollMommy
  let subject
  let horseman
  let UserAgent

  before(() => {
    UserAgent = td.replace('../src/user-agent', td.object('getRandom'))

    horseman = td.object([ 'on', 'cookies', 'userAgent', 'openTab', 'evaluate', 'closeTab', 'close' ])
    td.replace('node-horseman', function () { return horseman })

    PollMommy = require('../src/pollmommy')
  })

  beforeEach(() => {
    td.when(horseman.on(td.matchers.anything(), td.matchers.anything())).thenReturn(horseman)
    td.when(horseman.cookies(td.matchers.anything())).thenReturn(horseman)
    td.when(horseman.userAgent(td.matchers.anything())).thenReturn(horseman)
    td.when(horseman.openTab(td.matchers.anything())).thenReturn(horseman)
    td.when(horseman.evaluate(td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(horseman)
    td.when(horseman.closeTab(td.matchers.anything())).thenResolve()
    td.when(horseman.close()).thenResolve()
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
      subject = new PollMommy({ maxRetries })
    })

    beforeEach(() => {
      td.when(UserAgent.getRandom()).thenReturn(userAgent)
    })

    it('should fulfill promise', () => {
      const result = subject.vote(pollUrl, pollId, pollOptionId)

      return result.should.be.fulfilled
    })

    it('should set user agent', () => {
      return subject.vote(pollUrl, pollId, pollOptionId)
        .then(() => {
          const captor = td.matchers.captor()

          td.verify(horseman.userAgent(captor.capture()), { times: 1 })

          const _userAgent = captor.value

          _userAgent.should.be.eql(userAgent)
        })
    })

    it('should reset cookies', () => {
      return subject.vote(pollUrl, pollId, pollOptionId)
        .then(() => {
          const captor = td.matchers.captor()

          td.verify(horseman.cookies(captor.capture()), { times: 1 })

          const cookies = captor.value

          cookies.should.be.instanceof(Array)
          cookies.should.be.empty
        })
    })

    it('should open url in tab', () => {
      return subject.vote(pollUrl, pollId, pollOptionId)
        .then(() => {
          const captor = td.matchers.captor()

          td.verify(horseman.openTab(captor.capture()), { times: 1 })

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

          td.verify(horseman.evaluate(evaluateCaptor.capture(), pollIdCaptor.capture(), pollOptionIdCaptor.capture()), { times: 1 })

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

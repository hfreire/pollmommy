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

    horseman = td.object([ 'on', 'cookies', 'userAgent', 'open', 'click', 'evaluate' ])
    td.replace('node-horseman', function () { return horseman })

    PollMommy = require('../src/pollmommy')
  })

  beforeEach(() => {
    td.when(horseman.on(td.matchers.anything(), td.matchers.anything())).thenReturn(horseman)
    td.when(horseman.cookies(td.matchers.anything())).thenReturn(horseman)
    td.when(horseman.userAgent(td.matchers.anything())).thenReturn(horseman)
    td.when(horseman.open(td.matchers.anything())).thenReturn(horseman)
    td.when(horseman.click(td.matchers.anything())).thenReturn(horseman)
    td.when(horseman.evaluate(td.matchers.anything())).thenReturn(horseman)
  })

  afterEach(() => {
    td.reset()
  })

  describe('when voting successfully', () => {
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
      const result = subject.vote(pollId, pollOptionId)

      return result.should.be.fulfilled
    })

    it('should set user agent', () => {
      return subject.vote(pollId, pollOptionId)
        .then(() => {
          const captor = td.matchers.captor()

          td.verify(horseman.userAgent(captor.capture()), { times: 1 })

          const _userAgent = captor.value

          _userAgent.should.be.eql(userAgent)
        })
    })

    it('should reset cookies', () => {
      return subject.vote(pollId, pollOptionId)
        .then(() => {
          const captor = td.matchers.captor()

          td.verify(horseman.cookies(captor.capture()), { times: 1 })

          const cookies = captor.value

          cookies.should.be.instanceof(Array)
          cookies.should.be.empty
        })
    })

    it('should open poll url', () => {
      return subject.vote(pollId, pollOptionId)
        .then(() => {
          const captor = td.matchers.captor()

          td.verify(horseman.open(captor.capture()), { times: 1 })

          const pollUrl = captor.value

          pollUrl.should.be.eql(`https://polldaddy.com/poll/${pollId}/`)
        })
    })

    it('should click poll option selector', () => {
      return subject.vote(pollId, pollOptionId)
        .then(() => {
          const captor = td.matchers.captor()

          td.verify(horseman.click(captor.capture()), { times: 1 })

          const selector = captor.value

          selector.should.be.eql(`label[for=${pollOptionId}]`)
        })
    })

    it('should evaluate javascript', () => {
      return subject.vote(pollId, pollOptionId)
        .then(() => {
          td.verify(horseman.evaluate(), { times: 1, ignoreExtraArgs: true })
        })
    })
  })
})

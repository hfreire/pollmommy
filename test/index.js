/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Module', () => {
  let subject
  let Pollmommy

  before(() => {
    Pollmommy = td.object([])
  })

  afterEach(() => td.reset())

  describe('when loading', () => {
    beforeEach(() => {
      td.replace('../src/pollmommy', Pollmommy)

      subject = require('../src/index')
    })

    it('should export pollmommy', () => {
      subject.should.be.equal(Pollmommy)
    })
  })
})

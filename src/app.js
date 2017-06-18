#!/usr/bin/env node

/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

process.on('uncaughtException', error => {
  console.error(error)

  process.exit(1)
})

process.on('unhandledRejection', error => {
  console.error(error)

  process.exit(1)
})

const program = require('commander')

let pollUrl
let pollId
let pollOptionId

program
  .version('1.0.0')
  .arguments('<pollUrl> <pollId> <pollOptionId>')
  .action((_pollUrl, _pollId, _pollOptionId) => {
    pollUrl = _pollUrl
    pollId = _pollId
    pollOptionId = _pollOptionId
  })
  .parse(process.argv)

if (!pollUrl || !pollId || !pollOptionId) {
  program.outputHelp()

  process.exit(1)
}

const Pollmommy = require('../lib/pollmommy')
const pollmommy = new Pollmommy()

// noinspection JSUnusedAssignment
pollmommy.vote(pollUrl, pollId, pollOptionId)
  .then(() => console.log('Voted successfully!'))
  .catch((error) => console.error(error))

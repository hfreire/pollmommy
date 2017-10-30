#!/usr/bin/env node

/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

process.on('uncaughtException', (error) => {
  console.error(error)

  process.exit(1)
})

process.on('unhandledRejection', (error) => {
  console.error(error)

  process.exit(1)
})

const program = require('commander')

const { join } = require('path')

const { version } = require(join(__dirname, '../package'))

program
  .version(version)
  .option('-u, --poll-url <pollUrl>', 'The poll\'s website URL, Polldaddy\'s poll website or the embedded poll website.')
  .option('-i, --poll-id <pollId>', 'The Polldaddy\'s poll identifier')
  .option('-o, --poll-option-id <pollOptionId>', 'The Polldaddy\'s poll option identifier')
  .parse(process.argv)

const { pollUrl, pollId, pollOptionId } = program

if (!pollUrl || !pollId || !pollOptionId) {
  program.outputHelp()

  process.exit(1)
}

const Pollmommy = require('../lib/pollmommy')
const pollmommy = new Pollmommy()

pollmommy.vote(pollUrl, pollId, pollOptionId)
  .then(() => console.log('Voted successfully!'))
  .catch((error) => {
    console.error(`Error: ${error.message}`)

    process.exit(1)
  })

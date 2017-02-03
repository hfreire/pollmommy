# :star: Hack your :see_no_evil: vote out of :chart_with_upwards_trend: Polldaddy surveys - used by :moneybag: BBC, Microsoft, Forbes, Pfizer, IBM
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/hfreire/pollmommy.svg?branch=master)](https://travis-ci.org/hfreire/pollmommy)
[![codecov](https://codecov.io/gh/hfreire/pollmommy/branch/master/graph/badge.svg)](https://codecov.io/gh/hfreire/pollmommy)
[![Dependency Status](https://img.shields.io/david/hfreire/pollmommy.svg?style=flat)](https://david-dm.org/hfreire/pollmommy)
[![](https://img.shields.io/github/release/hfreire/pollmommy.svg)](https://github.com/hfreire/pollmommy/releases)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/npm/v/pollmommy.svg)](https://www.npmjs.com/package/pollmommy)
[![Downloads](https://img.shields.io/npm/dt/pollmommy.svg)](https://www.npmjs.com/package/pollmommy) 

### Features
* Support for [Bluebird](https://github.com/petkaantonov/bluebird) :bird: promises
* Uses [Nightmare.js](http://www.nightmarejs.org/) :scream: headless browser generate traffic on the poll website
* Injects :star: JavaScript code inside the poll website to vote

### How to install
```
node install pollmommy
```

### How to use it in the terminal
```bash
pollmommy $url $poll_id $poll_answer_id
```

### How to use it in your app
```javascript
const Pollmommy = require('pollmommy')
const pollmommy = new Pollmommy()

pollmommy.vote('my-url', 'my-poll-id', 'my-poll-answer-id')
```

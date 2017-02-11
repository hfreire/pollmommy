# :star: Hack your :see_no_evil: vote out of :chart_with_upwards_trend: Polldaddy surveys - used by :moneybag: BBC, Microsoft, Forbes, Pfizer, IBM

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/hfreire/pollmommy.svg?branch=master)](https://travis-ci.org/hfreire/pollmommy)
[![Coverage Status](https://coveralls.io/repos/github/hfreire/pollmommy/badge.svg?branch=master)](https://coveralls.io/github/hfreire/pollmommy?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/hfreire/pollmommy.svg)](https://greenkeeper.io/)
[![](https://img.shields.io/github/release/hfreire/pollmommy.svg)](https://github.com/hfreire/pollmommy/releases)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/npm/v/pollmommy.svg)](https://www.npmjs.com/package/pollmommy)
[![Downloads](https://img.shields.io/npm/dt/pollmommy.svg)](https://www.npmjs.com/package/pollmommy) 

Uses a headless browser to visit a poll website and inject JavaScript code to perform the desired poll voting.

<p align="center"><img src="https://raw.githubusercontent.com/hfreire/pollmommy/master/share/github/voting-screencapture.gif" width="540"></p>

### Features
* Uses [Nightmare.js](http://www.nightmarejs.org/) :scream: to generate legit traffic on the poll website :white_check_mark:
* Supports [Bluebird](https://github.com/petkaantonov/bluebird) :bird: promises :white_check_mark:

### How to install
```
npm install pollmommy -g
```

### How to use

#### Fetch the required parameters
* URL - The poll's website URL, Polldaddy's poll website or the embedded poll website.
* Poll id - The Polldaddy's poll identifier, inspect the website HTML code and search for this pattern PDI_containerNUMBER - NUMBER will be the id.
* Poll option id - The Polldaddy's poll option identifier, pick the desired option and inspect the website HTML code and search for this pattern PDI_answerNUMBER - NUMBER will be the id.


#### Use it in your terminal
```
pollmommy http://bbc.co.uk/should-trump-be-fired.html 324345 12939
```

#### Use it in your app
```javascript
const Pollmommy = require('pollmommy')
const pollmommy = new Pollmommy()

pollmommy.vote('http://bbc.co.uk/should-trump-be-fired.html', 324345, 12939)
  .then(() => console.log('Voted successfully!'))
  .catch((error) => console.error(error.message))
```

### Used by
*  [Let's make :city_sunrise: Porto :trophy: win the :euro: European Best Destination :tada: 2017](https://github.com/hfreire/make-porto-win-european-best-destination-2017)

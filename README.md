# :star: Hack your :see_no_evil: vote out of :chart_with_upwards_trend: Polldaddy surveys - used by :moneybag: BBC, Microsoft, Forbes, Pfizer, IBM

[![Build Status](https://travis-ci.org/hfreire/pollmommy.svg?branch=master)](https://travis-ci.org/hfreire/pollmommy)
[![Coverage Status](https://coveralls.io/repos/github/hfreire/pollmommy/badge.svg?branch=master)](https://coveralls.io/github/hfreire/pollmommy?branch=master)
[![](https://img.shields.io/github/release/hfreire/pollmommy.svg)](https://github.com/hfreire/pollmommy/releases)
[![Version](https://img.shields.io/npm/v/pollmommy.svg)](https://www.npmjs.com/package/pollmommy)
[![Downloads](https://img.shields.io/npm/dt/pollmommy.svg)](https://www.npmjs.com/package/pollmommy) 

> Uses a headless browser to visit a poll website and inject JavaScript code to perform the desired poll voting.

<p align="center"><img src="https://raw.githubusercontent.com/hfreire/pollmommy/master/share/github/voting-screencapture.gif" width="640"></p>

### Features
* Uses [Nightmare](http://www.nightmarejs.org/) :scream: to generate legit traffic on the poll website :white_check_mark:
* Supports [Bluebird](https://github.com/petkaantonov/bluebird) :bird: promises :white_check_mark:

### How to install
```
npm install pollmommy -g
```

### How to use

#### Fetch the required parameters
Parameter | Description | How to get it
:---:|:---:|:---:
Poll URL | The poll's website URL. | Polldaddy's poll website or the embedded poll website.
Poll id | The Polldaddy's poll identifier. | Inspect the website HTML code and search for this pattern PDI_container`NUMBER` - `NUMBER` will be the id.
Poll option id | The Polldaddy's poll option identifier. | Pick the desired option and inspect the website HTML code and search for this pattern PDI_answer`NUMBER` - `NUMBER` will be the id.


#### Use it in your terminal
```
pollmommy -u http://bbc.co.uk/should-trump-be-fired.html -i 324345 -o 12939
```

#### Use it in your app
Create a pollmommy instance and vote to get Trump fired
```javascript
const Pollmommy = require('pollmommy')
const pollmommy = new Pollmommy()

pollmommy.vote('http://bbc.co.uk/should-trump-be-fired.html', 324345, 12939)
  .then(() => console.log('Voted successfully!'))
  .catch((error) => console.error(error.message))
```

### How to contribute
You can contribute either with code (e.g., new features, bug fixes and documentation) or by [donating 5 EUR](https://paypal.me/hfreire/5). You can read the [contributing guidelines](./docs/CONTRIBUTING.md) for instructions on how to contribute with code. 

All donation proceedings will go to the [Sverige för UNHCR](https://sverigeforunhcr.se), a swedish partner of the [UNHCR - The UN Refugee Agency](http://www.unhcr.org), a global organisation dedicated to saving lives, protecting rights and building a better future for refugees, forcibly displaced communities and stateless people.

### Used by
* [make-porto-win-european-best-destination-2017](https://github.com/hfreire/make-porto-win-european-best-destination-2017) - Let's make :city_sunrise: Porto :trophy: win the :euro: European Best Destination :tada: 2017

### License
Read the [license](./LICENSE.md) for permissions and limitations.

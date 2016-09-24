# Node.js Project Base
[![Code Climate](https://codeclimate.com/github/muhammaddadu/nodejs-project-base/badges/gpa.svg)](https://codeclimate.com/github/muhammaddadu/nodejs-project-base)
<a href="https://codeclimate.com/github/muhammaddadu/nodejs-project-base/coverage"><img src="https://codeclimate.com/github/muhammaddadu/nodejs-project-base/badges/coverage.svg" /></a>
This base is for creating Node.js projects with es7 and flow code. It includes basic outline for the project in addition to tests.
> Note: This base requires Node.js 4 or newer.

## Usage
```
# install all dependencies
npm install # project dependencies
npm install -g gulp # command line tool

# run tests
npm build
npm watch
npm coverage
npm docs
npm prepublish
npm test [--suite <file-name|glob>] [--grep <name>]
```

when ```npm watch``` is running, other gulp tasks can be run within the console. e.g ```test``` will execute a test in the same session.

## Creating Your Project
1) Clone this repository
2) Remove files from ```/src/**/**``` and ```/test/**/*_test.js``` and create a new entry point file ```/src/index.js```
3) Update ```package.json```, ```README.md``` with your project information

Note: Configure the settings for tools used in this project to your requirements

## Licence
Copyright (c) 2016 Muhammad Dadu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

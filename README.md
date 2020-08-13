# Disguise

Disguise is a project made with [Angular CLI](https://github.com/angular/angular-cli) version 9 that provides a user interface for the [Mountebank](http://www.mbtest.org/) server, facilitating the usage and interactions with the API.

## Install and Setup

### Requirements
- [Node.js and npm](https://nodejs.org/en/) Version 12
- [Angular-CLI](https://github.com/angular/angular-cli) Version 9
- [Mountebank](https://github.com/bbyars/mountebank) Version 2.2

### Installation

After installing the Node.js, install the Angular-CLI using the npm package manager:
```bash
npm install -g @angular/cli
```

Clone the project's repository and in the cloned folder run the command to install the dependencies of the project:
```bash
npm install
```

Then serve the project with the Angular-CLI and it's ready to use:
```bash
ng serve
```

### Setup

The UI will be hosted in *http://localhost:4200* and the default port considered for the Mountebank server is 2525. To change the Mountebank location, modify the *mb* object in the *src/app/shared/constants.ts* file:
```typescript
public static mb = 'http://localhost:2525';
```

## Usage

### Imposters Page

This is the page where you can manage the imposters present in the Mountebank server. You can visualize the informations of all the imposters and their stubs, add new imposters and delete existing ones. You can also add new singular stubs to imposters, edit and delete existing ones.

You can export the actual state of the Mountebank server, saving all the current imposters and stubs, to a json file. It is also possible to import a configuration json file, adding the imposters and stubs defined in it to the running Mountebank server.

If an imposter has the attribute *recordRequests* set to true, you can visualize all their recorded requests. The requests are shown in a list with their respective informations like timestamp, headers and request body.

### Logs Page

This is the page where you can visualize the logs returned by the Mountebank server. The logs are presented in a table where you can filter them by the port number, the type of the log, the imposter related to the log and the log message.

## Copyright

Copyright © 2020 Opus Software

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
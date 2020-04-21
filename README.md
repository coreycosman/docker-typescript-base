# Docker TypeScript Base

## A base for building services using Docker and Typescript:

- scripts for running typescript code inside 5 different containerized environments:

  - `npm run docker:prod`
    - starts the production system in docker container
  - `npm run docker:dev`
    - starts the development system in watch mode in docker container
  - `npm run docker:test`
    - runs the test suite in watch mode in docker container
  - `npm run docker:test-debug`
    - runs the test suite in debug watch mode in docker container
  - `npm run docker:debug`
    - starts the development system in debug watch mode in docker container

- scripts for running typescript code locally in 6 different environments

  - `npm start`
    - starts the production system
  - `npm run start:dev`
    - starts the development system in watch mode
  - `npm run test`
    - runs the test suite in watch mode
  - `npm run test:debug`
    - runs the test suite in debug watch mode
  - `npm run test:debug-scoped <some it block description>`
    - runs command line specified `it` block description in debug watch mode
  - `npm run debug`
    - run the development system in debug watch mode
  - `npm run debug:scoped <some-js/ts-file-path>`
    - run a command line specified file in debug watch mode

- multi environment typescript configuration
  - `tsconfig:dev.json`
  - `tsconfig:prod.json`
- prettier configuration
  - `prettier.config.js`
- eslint configuration
  - `eslint.config.json`

* Whenever introducing a new service, follow these steps (UNIX instructions):

  - 1. in your `$HOME/app` directory (or wherever all of your services are located on your local machine):
    - `git clone https://github.com/coreycosman/docker-typescript-base.git && cd docker-typescript-base`
  - 2. `rm -rf .git`
  - 3. `git init`
  - 4. `npm i`
  - 5. reanme your new service accordingly - `cd && mv ~/<your-local-directory>/docker-typescript-base ~/<your-local-directory>/<new-service-name>`

* The entry point is `src/index.ts`

* debugging in mulitple environments:

  - chrome node devtools

    - scripts attach debugger to port 4242, locally and in docker container
    - ensure your chrome node debugger has a connection to `localhost:4242` established

  - VSCode

    - in the .vscode directory, there is a launch.json included with a configuration for attaching docker to node, on port 4242
    - to hit debugger statements in VSCode with specific debugger scripts, run the npm script and once the console indicates that the debugger is listening, run VSCode `Docker: Attach to Node` debugger configuration
    - currently, VSCode debugger breakpoints work for the following debug scripts:
      - `npm run test:debug`
      - `npm run test:debug-scoped`
    - if you know how to hit VSCode debugger breakpoints inside docker container, it would be greatly appreciated if you opened up a pull request to demonstrate :)

    - currently, debugger statements work for all of the debug scripts:

      - `npm run docker:test-debug`
      - `npm run docker:debug`

      - `npm run test:debug`
      - `npm run test:debug-scoped`
      - `npm run debug`

All feedback and contributions are welcomed and appreciated!
Happy Coding! :)

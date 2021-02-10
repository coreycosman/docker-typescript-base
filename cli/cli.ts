#!/usr/bin/env node --enable-source-maps -r ts-node/register
/* eslint-disable */
const shell = require('shelljs');
const co = require('co');
const cliPrompt = require('co-prompt');
const figlet = require('figlet');
const program = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const ora = require('ora');

// @ts-ignore
import { ColorTextInput, PrintMessageOptions, Tree } from './interface';
import { ColorPalette } from './colors';

const colorCodes = Object.values(ColorPalette);
const welcomeMessage = 'Welcome!, to, the, docker-typescript-base, cli tool';
const conclusionMessage =
  'Your package is now ready to use!, NPM modules are installed, you can now run any of the scripts in package.json to see them in action, your entry point is src/index.ts, you can start building from there, and the file path to your new package is: ';
const instructions = {
  compatability:
    'Please note that this tool is currently only compatible with UNIX machines that are running nvm',
  purpose:
    'This tool will determine which $HOME directory location your new package will be saved to',
  prompt: 'Where would you like to store the contents of this package?',
  option1: '1. in an existing directory in $HOME eg. $HOME/<some-project-directory>',
  option2: '2. as a new directory in $HOME/<a-new-file-path-directory-to-be-named-by-you>',
};
const options = {
  initialFlagPrompt: 'Please ENTER either (1) or (2) from the above options:  ',
  existingDirectoryOption: `Specify path to your existing directory eg. your-directory-name:  `,
  newPathName: 'Name your new package eg. your-new-package-name  ',
  lineBreak: '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++',
};

program
  .action(function () {
    co(printDialog());
  })
  .parse(process.argv);
// program
//   .action(function (file: any) {
//     co(function* () {
//       let selection1 = yield cliPrompt(colorText({ text: options.initialPrompt, style: 'bold' }));
//       if (typeof selection1 !== 'string') return console.log('please enter a string');
//       // @ts-ignore
//       if (selection1 !== '1' && selection1 !== '2') {
//         // return console.log('please enter either 1 or 2');
//         selection1 = yield cliPrompt(colorText({ text: options.initialPrompt, style: 'bold' }));
//       }
//       if (selection1 === '1') {
//         const rootDir = yield cliPrompt(
//           colorText({ text: options.existingDirectoryOption, style: 'bold' }),
//         );
//         const newPackageName = yield cliPrompt(
//           colorText({ text: options.newPathName, style: 'bold' }),
//         );
//         console.log(options.lineBreak);
//         shell.exec(
//           `cd && NODE_VERSION=$(node -v) && cd $HOME/${rootDir} && mkdir ${newPackageName} && cp -r ~/.nvm/versions/node/"$NODE_VERSION"/lib/node_modules/docker-typescript-baseq/ $HOME/${rootDir}/${newPackageName} && cd ${newPackageName} && echo ${printConclusion()} && pwd && echo Happy Coding!`,
//         );
//         shell.exit();
//       }
//       console.log('sup', selection1, file);
//     });
//   })
//   .parse(process.argv);

// printing functions
function* printDialog() {
  printMessage({ message: welcomeMessage, type: 'welcome' });
  printInstructions();

  const tree: Tree = {
    userDir: process.env['HOME'],
    rootDir: '',
    newDir: '',
  };

  let isValid: boolean = false;
  let initialFlag;

  while (!isValid) {
    initialFlag = yield cliPrompt(colorText({ text: options.initialFlagPrompt, style: 'bold' }));
    if (initialFlag === '1' || initialFlag === '2') isValid = true;
  }
  if (initialFlag === '1') {
    // get existing root dir name
    isValid = false;
    while (!isValid) {
      tree.rootDir = yield cliPrompt(
        colorText({ text: options.existingDirectoryOption, style: 'bold' }),
      );

      const rootDirExists: boolean = fs.existsSync(`${tree.userDir}/${tree.rootDir}`);
      if (!rootDirExists) {
        console.log(
          colorText({
            text: `THAT DIRECTORY DOES NOT EXIST IN $HOME (${tree.userDir})!`,
            style: 'error',
          }),
        );
      } else {
        isValid = true;
      }
    }

    // get new package name
    isValid = false;
    while (!isValid) {
      tree.newDir = yield cliPrompt(colorText({ text: options.newPathName, style: 'bold' }));

      const packageNameExists: boolean = fs.existsSync(
        `${tree.userDir}/${tree.rootDir}/${tree.newDir}`,
      );
      if (packageNameExists) {
        console.log(
          colorText({
            text: `THAT DIRECTORY ALREADY EXISTS IN ${tree.userDir}/${tree.rootDir}!`,
            style: 'error',
          }),
        );
        // }
      } else {
        isValid = true;
      }
    }
    console.log('sup');
    console.log(options.lineBreak);

    // TODO: typecheck and try to get working with Promise.resolve()
    (async function createNewDir() {
      return new Promise((resolve) => {
        const childProcess = shell.exec(
          `cd && NODE_VERSION=$(node -v) && cd ${tree.userDir}/${tree.rootDir} && mkdir ${tree.userDir}/${tree.rootDir}/${tree.newDir} && cp -r ~/.nvm/versions/node/"$NODE_VERSION"/lib/node_modules/docker-typescript-base/ ${tree.userDir}/${tree.rootDir}/${tree.newDir} && cd ${tree.userDir}/${tree.rootDir}/${tree.newDir} && cp -r ./cli/new-package.json ./package.json && rm -rf ./cli node_modules package-lock.json && npm i`,
          { async: true },
        );
        const work = ora(console.log('working...')).start();
        childProcess.stdout.on('data', () => {
          work.stopAndPersist({
            symbol: '🍕',
            text: 'done',
          });
          shell.echo(
            `${printMessage({ message: conclusionMessage, type: 'regular', params: tree })}`,
          );
          shell.echo(`${tree.userDir}/${tree.rootDir}/${tree.newDir}`);
          // TODO: fix smile emoji size
          shell.echo('Happy Coding! 😃');
          shell.exit();
          resolve();
        });
      });
    })();
  }
}
function printMessage(options: PrintMessageOptions): Array<void> {
  return options.message.split(',').map((word: string) => {
    if (options.type === 'welcome') {
      console.log(styleText(word));
    }
    if (options.type === 'regular') {
      console.log(colorText({ text: word }));
    }
  });
}

function printInstructions(): Array<string> {
  return Object.values(instructions).map((instruction) => {
    if (instruction === instructions.prompt)
      return shell.echo(colorText({ text: instruction, style: 'bold' })) + lineBreak(2);
    return shell.echo(colorText({ text: instruction }));
  });
}

// style functions
function styleText(word: string): string {
  if (word === 'Welcome!') {
    return chalk.bold.hex(colorCodes[Math.floor(Math.random() * colorCodes.length)])(
      figlet.textSync(word, { horizontalLayout: 'full' }),
    );
  }
  if (word === 'docker-typescript-base') {
    return chalk.bold.hex(colorCodes[Math.floor(Math.random() * colorCodes.length)])(
      figlet.textSync(word),
    );
  }

  return chalk.hex(colorCodes[Math.floor(Math.random() * colorCodes.length)])(
    figlet.textSync(word, { horizontalLayout: 'full' }),
  );
}

function colorText(options: ColorTextInput): string {
  if (options.style === 'bold')
    return chalk.bold.hex(colorCodes[Math.floor(Math.random() * colorCodes.length)])(options.text);
  if (options.style === 'error') {
    lineBreak(10);
    return chalk.bold.hex(colorCodes[Math.floor(Math.random() * colorCodes.length)])(options.text);
  }
  return chalk.hex(colorCodes[Math.floor(Math.random() * colorCodes.length)])(options.text);
}

function lineBreak(amount: number): null {
  while (amount > 0) {
    shell.echo('');
    amount--;
  }
  return null;
}
// ___________________________________________________________________
// const [, , ...args] = process.argv;

// const getNodeVersion = 'nodeVersion(){node -v}';

// shell.exec(
//   `cd && NODE_VERSION=$(node -v) && sudo cp -r ~/.nvm/versions/node/"$NODE_VERSION"/lib/node_modules/docker-typescript-baseq/ ${args[0]}/test`,
// );
// if (args[0] === undefined && args[1] === undefined) {
//   shell.echo('docker-ts requires 1..2 arguments');
//   shell.echo('argument 1:');
//   shell.echo(
//     'option i) can be an existing folder name in the unix $HOME directory (this could be a location where your services for a specific project live',
//   );
//   shell.echo(
//     'option 2) if selected, a 2nd argument should not be used; this option is the name of your new directory containing the docker-typescript-base in $HOME',
//   );
//   shell.echo('argument2:');
//   shell.echo(
//     'to be used only if argument 1 is an existing directory in $HOME; this argument is the name of your new directory containing the docker-typescript-base in $HOME/<argument1>',
//   );
// }

// shell.exec(
//   `cd && NODE_VERSION=$(node -v) && cp -r ~/.nvm/versions/node/"$NODE_VERSION"/lib/node_modules/docker-typescript-baseq/ ${args[0]}/${args[1]} && cd ${args[0]}/${args[1]}`,
// );
// shell.exec(`cd && cd ${args[0]} && mkdir ${args[1]} && cd ${args[1]} && cp -r`)

// shell.exec('echo hello test');

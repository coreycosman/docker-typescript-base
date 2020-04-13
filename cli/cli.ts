#!/usr/bin/env node --enable-source-maps -r ts-node/register
/* eslint-disable */
const shell = require('shelljs');
const co = require('co');
const cliPrompt = require('co-prompt');
const figlet = require('figlet');
const program = require('commander');
const chalk = require('chalk');

import { ColorTextInput } from './interface';
import { ColorPalette } from './colors';

const colorCodes = Object.values(ColorPalette);
const welcomeMessage = ['Welcome!', 'to', 'the', 'docker-typescript-base', 'cli tool'];
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
  initialPrompt: 'Please ENTER either (1) or (2) from the above options:  ',
  existingDirectoryOption:
    'Specify path to your existing directory (in $HOME) eg. your-directory-name:  ',
  newPathName: 'Name your new package eg. your-new-package-name  ',
  lineBreak: '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++',
};

printWelcome();
printInstructions();

program
  .action(function (file: any) {
    co(function* () {
      const selection1 = yield cliPrompt(colorText({ text: options.initialPrompt, style: 'bold' }));
      if (typeof selection1 !== 'string' && selection1 !== '1' && selection1 !== '2')
        return console.log('please enter either 1 or 2');
      if (selection1 === '1') {
        const rootDir = yield cliPrompt(
          colorText({ text: options.existingDirectoryOption, style: 'bold' }),
        );
        const newPackageName = yield cliPrompt(
          colorText({ text: options.newPathName, style: 'bold' }),
        );
        console.log(options.lineBreak);
        shell.exec(
          `cd && NODE_VERSION=$(node -v) && cd $HOME/${rootDir} && mkdir ${newPackageName} && cp -r ~/.nvm/versions/node/"$NODE_VERSION"/lib/node_modules/docker-typescript-baseq/ $HOME/${rootDir}/${newPackageName} && cd ${newPackageName} && echo ${printConclusion()} && pwd && echo Happy Coding!`,
        );
        shell.exit();
      }
      console.log('sup', selection1, file);
    });
  })
  .parse(process.argv);

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
  if (options.style === 'bold') {
    return chalk.bold.hex(colorCodes[Math.floor(Math.random() * colorCodes.length)])(options.text);
  }
  return chalk.hex(colorCodes[Math.floor(Math.random() * colorCodes.length)])(options.text);
}

function printWelcome(): Array<void> {
  return welcomeMessage.map((word) => {
    return console.log(styleText(word));
  });
}

function printConclusion(): Array<void> {
  const conclusion =
    'Your package is now ready to use!, NPM modules are installed, you can now run any of the scripts to see them in action, your entry point is src/index.ts, you can start building from there, and the file path to your new package is: ';

  return conclusion.split(',').map((word) => {
    console.log(colorText({ text: word }));
  });
}

function printInstructions(): Array<string> {
  return Object.values(instructions).map((instruction) => {
    if (instruction === instructions.prompt)
      return shell.echo(colorText({ text: instruction, style: 'bold' })) + lineBreak(2);
    return shell.echo(colorText({ text: instruction }));
  });
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

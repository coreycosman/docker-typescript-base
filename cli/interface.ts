type TestFunction = (word: ColorTextInput | string) => string;
// type StyleFunction = (word: string | ColorTextInput) => string;
export interface PrintMessageOptions {
  message?: string;
  styleFunction?: TestFunction;
}
export interface ColorTextInput {
  text?: string;
  style?: string;
}
export interface Tree {
  userDir: string | undefined;
  rootDir: string;
  newDir: string;
}

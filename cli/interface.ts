export interface PrintMessageOptions {
  message: string;
  type: string;
  params?: Tree;
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

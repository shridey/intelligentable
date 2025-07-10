declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.ttf" {
  const src: string;
  export default src;
}

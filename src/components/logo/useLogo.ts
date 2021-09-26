export enum ILogoState {
  default = 'default',
}

export type ILogo = {
  state?: ILogoState | Array<ILogoState>;
}

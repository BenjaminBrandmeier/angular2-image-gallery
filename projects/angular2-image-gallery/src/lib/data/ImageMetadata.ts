export type ImageMetadata = {
  name: string
  date: string
  dominantColor?: string
  resolutions: {
    [resolution: string]: {
      path: string
      width: number
      height: number
    }
  }
}

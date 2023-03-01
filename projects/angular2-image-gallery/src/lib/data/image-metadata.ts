export type ImageMetadata = {
  name: string
  alt: string
  date: string
  dominantColor?: string
  resolutions: {
    [resolution: string]: {
      path: string
      width: number
      height: number
    }
  },
  viewerImageLoaded?: boolean
  srcAfterFocus?: string
}

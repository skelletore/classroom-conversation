export const API_BASE_PATH: string = '/api'
export const SUBMIT_CONVERSATION_PATH: string = `${API_BASE_PATH}/submit`

export const NODE_SHAPE: { [key: string]: string } = {
  START: 'star',
  END: 'octagon',
  CHOICE: 'roundrectangle',
  RESPONSE: 'diamond',
  ILLUSTRATION_DEFAULT: 'hexagon',
  ILLUSTRATION_CHOICE: 'ellipse',
}

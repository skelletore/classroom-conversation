export type Node = {
  id: string
  shape: string
}

export type Nodes = {
  [id: string]: Node
}

export type Illustration = {
  id: string
  shape: string
  label: string
  links: Node[]
}

export type ChoiceResponse = {
  id: string
  shape: string
  percentage?: number
}

export type Choice = {
  id: string
  shape: string
  label: string
  illustrations: Illustration[]
  responses: ChoiceResponse[]
  selectedResponse: string
}

export type Choices = {
  [id: string]: Choice
}

export type Response = {
  id: string
  shape: string
  label: string
  illustrations: Illustration[]
  links: Node[]
  probability?: number
}

export type Responses = {
  [id: string]: Response
}

export type StartNode = {
  id: string
  shape: string
  firstQuestion: string
  label: string
}

export type Graph = {
  start: StartNode
  end: string
  choices: Choices
  responses: Responses
  nodes: Nodes
  uniform: boolean
}

export type Conversation = {
  name: string
  uuid: string
  description: string
  json: Graph
  document: string
  errors?: string[]
  created: string
  updated: string
}

export type ConversationItem = {
  id: string
  shape: string
  label: string
  illustrations?: Illustration[]
  responses?: Node[]
  selectedResponse?: string
}

export type Question = {
  id: string
  label: string
  shape: string
  answers: Array<{
    id: string
    percentage?: number
    shape: string
  }>
  selectedAnswer: string
}

export type UrlParams = {
  uuid: string
  id: string
}

export type PauseProps = {
  uuid: string
  id: string
  current: ConversationItem
  next: ConversationItem
}

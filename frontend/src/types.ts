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

export type Questions = {
  [id: string]: Question
}

export type Answer = {
  id: string
  label: string
  shape: string
  alternatives: Array<string>
}

export type Answers = {
  [id: string]: Answer
}

export type Illustration = {
  id: string
  label?: string
  img: string
}

export type Illustrations = {
  [id: string]: Array<Illustration>
}

export type StartNode = {
  id: string
  firstQuestion: string
  label: string
  type: string
}

export type Node = {
  id: string
  shape: string
}

export type Nodes = {
  [id: string]: Node
}

export type Graph = {
  answers: Answers
  questions: Questions
  illustrations: Illustrations
  nodes: Nodes
  start: StartNode
  end: string
  uniform: boolean
}

export type Conversation = {
  json: Graph
  errors: Array<string>
  name: string
  uuid: string
  end: string
  description: string
  updated: string
  document: string
}

export type UrlParams = {
  uuid: string
  id: string
}

export type PauseProps = {
  uuid: string
  id: string
  current: Question
  next: Question
}

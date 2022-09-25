import React from 'react'
import { useParams } from 'react-router-dom'

import { useFetchAndStoreConversation } from '../hooks'
import { addChoiceToConversation } from './../helpers'
import {
  UrlParams,
  Conversation,
  Graph,
  StartNode,
  Choice,
  Choices,
  Responses,
} from '../types'
import { NODE_SHAPE } from '../const'

import ConversationItemComponent from './../Question/Question'
import Finish from './../Finish/Finish'
import Pause from './../Pause/Pause'
import Loading from './../Loading/Loading'
import Notfound from '../Notfound/Notfound'

const isConversationFinished = (
  choice: Choice,
  end: string
): boolean => {
  if (!choice) return true
  if (choice.responses.length < 1) return true
  if (choice.id === end) return true
  if (choice.responses.length === 1 && choice.responses[0].id === end) return true
  // TODO: Handle diamond as final node

  return false
}

const isNextChoice = (choice: Choice): boolean =>
  choice.responses.length === 1 &&
  choice.responses[0].shape in [NODE_SHAPE.CHOICE, NODE_SHAPE.RESPONSE]

const ConversationComponent = () => {
  const { uuid, id } = useParams<UrlParams>()
  const [data, loading] = useFetchAndStoreConversation<Conversation>(
    `/api/document/${uuid}`,
    uuid
  )

  if (loading) {
    return <Loading />
  }

  if (!data) {
    return <Notfound />
  }

  addChoiceToConversation(id, uuid)

  const graph: Graph = data.json
  const choices: Choices = graph.choices
  const responses: Responses = graph.responses
  const startNode: StartNode = data.json.start

  if (isConversationFinished(choices[id], graph.end)) {
    return (
      <Finish
        name={data.name}
        intro={startNode.label}
        choices={choices}
        responses={responses}
      />
    )
  }

  const choice: Choice = choices[id]

  if (isNextChoice(choice)) {
    const nextChoice: Choice = choices[choice.responses[0].id]
    return (
      <Pause
        uuid={uuid}
        id={nextChoice.id}
        current={choice}
        next={nextChoice}
      />
    )
  }
  return <ConversationItemComponent graph={graph} uuid={uuid} id={id} />
}

export default ConversationComponent

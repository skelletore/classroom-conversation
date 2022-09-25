import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  Graph,
  Node,
  Choice,
  Choices,
  Response,
  Responses,
  Illustration,
} from '../types'
import { getRandomStudents, getSelectedAvatar } from '../helpers'

import teacherWoman from './../static/teacher_woman.png'
import teacherMan from './../static/teacher_man.png'

import { StyledConversation } from './Question.styled'
import { NODE_SHAPE } from '../const'

type Props = {
  graph: Graph
  uuid: string
  id: string
}

const buildConversation = (id: string, graph: Graph) => {
  const allChoices: Choices = graph.choices
  const allResponses: Responses = graph.responses

  const choice: Choice = allChoices[id]
  const randomResponse: Response = allResponses[choice.selectedResponse]
  
  const linkedResponses: Response[] = []
  randomResponse?.links.filter((link: Node) => link.shape === NODE_SHAPE.RESPONSE).forEach((response: Node) => linkedResponses.push(allResponses[response.id]))

  const illustrations: Illustration[] = getAllIllustrations(choice, randomResponse, linkedResponses)

  return { choice, randomResponse, linkedResponses, illustrations }
}

const getAllChoices = (choice: Choice, randomResponse: Response, linkedResponses: Response[], graph: Graph) => {
  let choices: Choice[] = []
  
  const getLinkedChoices = (links: Node[]) => {
    if (!links) return []
    return links
      .filter((link: Node) => [NODE_SHAPE.CHOICE, NODE_SHAPE.ILLUSTRATION_CHOICE].includes(link.shape))
      .map((link: Node) => graph.choices[link.id])
  }

  const choiceLinks = getLinkedChoices(choice.responses)
  const responseLinks = getLinkedChoices(randomResponse?.links)
  let linkedResponseLinks: Choice[] = []
  linkedResponses.forEach((linkedResponse: Response) => {
    linkedResponseLinks = linkedResponseLinks.concat(getLinkedChoices(linkedResponse.links))
  })

  // TODO: filter duplicates
  choices = choices.concat(choiceLinks, responseLinks, linkedResponseLinks)

  return choices ?? []
}

const getAllIllustrations = (choice: Choice, randomResponse: Response, linkedResponses: Response[]) => {
  let illustrations: Illustration[] = choice.illustrations ?? []

  // Get illustrations linked to the response
  randomResponse?.illustrations?.forEach((illustration: Illustration) => {
    // avoid duplicates
    if (illustrations.filter((_choosableIllustration) => _choosableIllustration.id === illustration.id).length < 1) illustrations.push(illustration)
  })
  // Get choosable illustrations linked to the linked responses
  linkedResponses?.forEach((linkedResponse: Response) => {
    linkedResponse.illustrations?.forEach((illustration: Illustration) => {
      if (illustrations.filter((_illustration) => _illustration.id === illustration.id).length < 1) illustrations.push(illustration)
    })
  })

  return illustrations
}

const QuestionComponent = ({ graph, uuid, id }: Props) => {
  const history = useHistory()
  const { choice, randomResponse, linkedResponses, illustrations } = buildConversation(id, graph)
  
  // Avatars
  const avatar = getSelectedAvatar()
  const [students, setStudents] = useState<string[]>([])

  const [currentChoices, setCurrentChoices] = useState<Choice[]>([])
  const [currentIllustrationChoices, setCurrentIllustrationChoices] = useState<Choice[]>([])
  const [illustration, setIllustration] = useState<Illustration>()

  useEffect(() => {
    // Get choices
    const choices = getAllChoices(choice, randomResponse, linkedResponses, graph)
    setCurrentChoices(choices.filter((choice: Choice) => choice.shape === NODE_SHAPE.CHOICE))
    setCurrentIllustrationChoices(choices.filter((choice: Choice) => choice.shape === NODE_SHAPE.ILLUSTRATION_CHOICE))

    // Get student avatars
    let _students = getRandomStudents(linkedResponses.length + 1)
    setStudents(_students)

    // @ts-ignore
    if (choice.shape === NODE_SHAPE.ILLUSTRATION_CHOICE) setIllustration(choice)
    // Get default illustrations
    else if (illustrations?.length >= 1) setIllustration(illustrations[0])
    else setIllustration(undefined)

  }, [id])

  return (
    <StyledConversation className='container'>
      <div className='conversation'>
        <div className='question'>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={`teacher${id}`}
            className="teacher"
          >
            {choice.shape === NODE_SHAPE.ILLUSTRATION_CHOICE ? 'Illustrasjon på tavla' : choice.label}
          </motion.h2>
        </div>
        <div className='answers'>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1 }}
            key={`student_${id ?? 0}`}
            className="student"
          >
            {randomResponse?.label}
          </motion.h2>
          {linkedResponses.map((linkedResponse, count) =>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: count + 2 }}
              key={`student_${linkedResponse.id}`}
              className="student linkedResponse"
            >
              {linkedResponse.label}
            </motion.h2>
          )}
        </div>
      </div>
      <div className='media'>
        <div className='illustrationContainer'>
          {illustration && (
            <img
              className="illustration"
              src={illustration.label}
              alt={illustration.label || 'Illustration'}
            />
          )}
        </div>
      </div>
      <div className='avatars'>
        <div className='teacher'>
          {avatar === 1 && (
            <img className="teacher" src={teacherWoman} alt="Female avatar" />
          )}
          {avatar === 2 && (
            <img className="teacher" src={teacherMan} alt="Male avatar" />
          )}
        </div>
        <div className='students'>
          {students.map((student) =>
            <img key={student} className="student" alt="student avatar" src={student} />
          )}
        </div>
      </div>
      <div className='choices'>
        <div className='questions'>
          {currentChoices?.length > 0 && (
            <>
              {currentChoices.map((choice: Choice, key: number) => (
                <motion.button
                  className="btn-dark choice"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 2 + 0.5 * key }}
                  key={`choice_${key}`}
                  onClick={() =>
                    history.push(`/conversation/${uuid}/${choice.id}`)
                  }
                >
                  <p>{choice.label || 'Missing node label'}</p>
                </motion.button>
              ))}
            </>
          )}
        </div>
        <div className='illustrations'>
          {currentIllustrationChoices.map((illustrationChoice: Choice, key: number) =>
            <motion.input
              className='illustration'
              type="image"
              key={illustrationChoice.id}
              src={illustrationChoice.label}
              alt={illustrationChoice.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2 + 0.5 * key }}

              onClick={(() => {
                history.push(`/conversation/${uuid}/${illustrationChoice.id}`)
              })}
            ></motion.input>
          )}
        </div>
      </div>
    </StyledConversation>
  )
}

export default QuestionComponent

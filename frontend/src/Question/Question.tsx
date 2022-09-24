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

const getAllChoices = (randomResponse: Response, linkedResponses: Response[], graph: Graph) => {
  const choices: Choice[] = randomResponse.links.filter((link: Node) => link.shape === NODE_SHAPE.CHOICE).map((link: Node) => graph.choices[link.id])
  linkedResponses.forEach((linkedResponse: Response) => {
    linkedResponse.links.filter((link: Node) => link.shape === NODE_SHAPE.CHOICE).forEach((link: Node) => {
      if (choices.filter((_choice) => _choice.id === link.id).length < 1) choices.push(graph.choices[link.id])
    })
  })

  return choices
}

const QuestionComponent = ({ graph, uuid, id }: Props) => {
  const history = useHistory()
  const choices: Choices = graph.choices
  const responses: Responses = graph.responses

  const choice: Choice = choices[id]
  const randomResponse: Response = responses[choice.selectedResponse]
  const defaultIllustrations: Illustration[] = choice.illustrations?.filter((illustration: Illustration) => illustration.shape === NODE_SHAPE.ILLUSTRATION_DEFAULT)
  const choosableIllustrations: Illustration[] = choice.illustrations?.filter((illustration: Illustration) => illustration.shape === NODE_SHAPE.ILLUSTRATION_CHOICE)
  
  // Avatars
  const avatar = getSelectedAvatar()
  const [students, setStudents] = useState<string[]>([])

  const [hasInitialized, setHasInitialized] = useState<string | undefined>(undefined)
  const [currentChoices, setChoices] = useState<Choice[]>([])
  const [illustration, setIllustration] = useState<Illustration>()
  const links: Node[] = randomResponse?.links ?? []
  const linkedResponses: Response[] = links.filter((link: Node) => link.shape === NODE_SHAPE.RESPONSE).map((link: Node) => responses[link.id])

  useEffect(() => {
    if (hasInitialized === id) return
    // Get choices
    setChoices(getAllChoices(randomResponse, linkedResponses, graph))
    // Get student avatars
    let _students = getRandomStudents(linkedResponses.length + 1)
    setStudents(_students)
    // Get default illustrations
    if (defaultIllustrations.length >= 1) setIllustration(defaultIllustrations[0])
    else if (randomResponse.illustrations.length > 0) {
      setIllustration(randomResponse.illustrations[0])
    }
    // TODO: Get illustration from linkedResponses?
    else setIllustration(undefined)

    setHasInitialized(id)
  }, [id])

  return (
    <StyledConversation className='container'>
      <div className='conversation'>
        <div className='question'>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={'teacher' + id}
            className="teacher"
          >
            {choice.label}
          </motion.h2>
        </div>
        <div className='answers'>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1 }}
            key={'student_' + id}
            className="student"
          >
            {randomResponse.label}
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
              src={illustration.img}
              alt={illustration.img || 'Illustration'}
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
          {currentChoices.length > 0 && (
            <>
              {currentChoices.map((item: Choice, key: number) => (
                <motion.button
                  className="btn-dark choice"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 2 + 0.5 * key }}
                  key={`choice_${key}`}
                  onClick={() =>
                    history.push(`/conversation/${uuid}/${item.id}`)
                  }
                >
                  <p>{item.label || 'Missing node label'}</p>
                </motion.button>
              ))}
            </>
          )}
        </div>
        <div className='illustrations'>
          {choosableIllustrations.map((choosableIllustration: Illustration, key: number) =>
            <motion.input
              className='illustration'
              type="image"
              key={choosableIllustration.id}
              src={choosableIllustration.img}
              alt={choosableIllustration.img}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2 + 0.5 * key }}

              onClick={(() => {
                setIllustration(choosableIllustration)
              })}
            ></motion.input>
          )}
        </div>
      </div>
    </StyledConversation>
  )
}

export default QuestionComponent

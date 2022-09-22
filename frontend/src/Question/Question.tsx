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
import { getRandomStudent, getSelectedAvatar } from '../helpers'

import teacherWoman from './../static/teacher_woman.png'
import teacherMan from './../static/teacher_man.png'

import { StyledConversation } from './Question.styled'
import { NODE_SHAPE } from '../const'

type Props = {
  graph: Graph
  uuid: string
  id: string
}

const QuestionComponent = ({ graph, uuid, id }: Props) => {
  const history = useHistory()
  const choices: Choices = graph.choices
  const responses: Responses = graph.responses
  const choice: Choice = choices[id]
  const defaultIllustrations: Illustration[] = choice.illustrations?.filter((illustration: Illustration) => illustration.shape === NODE_SHAPE.ILLUSTRATION_DEFAULT)
  const choosableIllustrations: Illustration[] = choice.illustrations?.filter((illustration: Illustration) => illustration.shape === NODE_SHAPE.ILLUSTRATION_CHOICE)
  const avatar = getSelectedAvatar()

  const [hasInitialized, setHasInitialized] = useState<string | undefined>(undefined)
  const [students, setStudents] = useState<string[]>([])
  const [illustration, setIllustration] = useState<Illustration>()
  const randomResponse: Response = responses[choice.selectedResponse]
  const linkedResponses: Node[] = randomResponse?.links

  console.log(graph)

  useEffect(() => {
    if (hasInitialized === id) return
    // Get student avatars
    let _students = [getRandomStudent()]
    linkedResponses.forEach(() => _students.push(getRandomStudent(_students)))
    setStudents(_students)
    // Get default illustrations
    if (defaultIllustrations.length >= 1) setIllustration(defaultIllustrations[0])
    else if (randomResponse.illustrations.length > 0) {
      setIllustration(randomResponse.illustrations[0])
    }
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
            {responses[randomResponse.id].label}
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
              {responses[linkedResponse.id].label}
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
          {Object.keys(choices).length > 0 && (
            <>
              {Object.values(choices).map((item: Choice, key: number) => (
                <motion.button
                  className="dark choice"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 2 + 0.5 * key }}
                  key={`choice_${key}`}
                  onClick={() =>
                    history.push(`/conversation/${uuid}/${item.id}`)
                  }
                >
                  <p>{choices[item.id]?.label || 'Missing node label'}</p>
                </motion.button>
              ))}
            </>
          )}
        </div>
        <div className='illustrations'>
          {choosableIllustrations.map((choosableIllustration: Illustration) =>
            <input
              className='illustration'
              type="image"
              key={choosableIllustration.id}
              src={choosableIllustration.img}
              alt={choosableIllustration.img}

              onClick={(() => {
                setIllustration(choosableIllustration)
              })}
            ></input>
          )}
        </div>
      </div>
    </StyledConversation>
  )
}

export default QuestionComponent

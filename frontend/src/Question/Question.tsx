import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  Graph,
  Answer,
  Answers,
  Questions,
  Illustrations,
  Illustration,
} from '../types'
import { getRandomStudent, getSelectedAvatar } from '../helpers'

import teacherWoman from './../static/teacher_woman.png'
import teacherMan from './../static/teacher_man.png'

import {
  StyledQuestion,
  StyledAlternatives,
  StyledAnswer,
  StyledIcons,
  StyledIllustration,
} from './Question.styled'

type Props = {
  graph: Graph
  uuid: string
  id: string
}

const QuestionComponent = ({ graph, uuid, id }: Props) => {
  const history = useHistory()
  const questions: Questions = graph.questions
  const answers: Answers = graph.answers
  const question = questions[id]
  const [illustration, setIllustration] = useState<Illustration>()
  const randomAnswer: Answer = answers[question.selectedAnswer]
  const alternatives: Array<string> = randomAnswer.alternatives

  const avatar = getSelectedAvatar()

  useEffect(() => {
    const illustrations: Illustrations = graph.illustrations || {}
    let illustrationId
    if (Object.keys(illustrations).includes(id)) {
      illustrationId = id
    } else if (Object.keys(illustrations).includes(randomAnswer.id)) {
      illustrationId = randomAnswer.id
    } else {
      setIllustration(undefined)
    }
    if (illustrationId) {
      let _illustrations: Array<Illustration> = illustrations[illustrationId]
      if (_illustrations.length === 1) {
        setIllustration(_illustrations[0])
      } else {
        console.warn(
          'Found multiple illustrations, but support has not yet been implemented. Using first item.'
        )
        setIllustration(_illustrations[0])
      }
    }
  }, [questions, answers, question, randomAnswer, id, graph.illustrations])

  return (
    <StyledQuestion>
      <StyledAnswer>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={'teacher' + id}
          className="teacher"
        >
          {question.label}
        </motion.h2>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1 }}
          key={'student_' + id}
          className="student"
        >
          {answers[randomAnswer.id].label || ''}
        </motion.h2>
      </StyledAnswer>

      {illustration && (
        <StyledIllustration
          className="styledIllustration"
          src={illustration.img}
          alt={illustration.label || 'Illustration'}
        />
      )}

      <StyledAlternatives>
        <StyledIcons>
          {avatar === 1 && (
            <img className="teacher" src={teacherWoman} alt="Female avatar" />
          )}
          {avatar === 2 && (
            <img className="teacher" src={teacherMan} alt="Male avatar" />
          )}
          <div className="students">
            <img className="student" alt="student avatar" src={getRandomStudent()} />
            <img className="student" alt="student avatar" src={getRandomStudent()} />
          </div>
        </StyledIcons>

        <div className="alternatives">
          {alternatives.length > 0 && (
            <>
              {alternatives.map((id: string, key: number) => (
                <motion.button
                  className="dark"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 2 + 0.5 * key }}
                  key={'alternative_' + key}
                  onClick={() =>
                    history.push('/conversation/' + uuid + '/question/' + id)
                  }
                >
                  <p>{questions[id]?.label || 'Missing node label'}</p>
                </motion.button>
              ))}
            </>
          )}
        </div>
      </StyledAlternatives>
    </StyledQuestion>
  )
}

export default QuestionComponent

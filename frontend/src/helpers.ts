import { Answer, Answers, Question, Questions } from './types'

import { SUBMIT_CONVERSATION_PATH } from './const'
import axios, { AxiosError, AxiosResponse } from 'axios'

import studentGirl1 from './static/student_1.png'
import studentGirl2 from './static/student_girl_2.png'
import studentGirl3 from './static/student_girl_3.png'
import studentGirl4 from './static/student_girl_4.png'
import studentBoy1 from './static/student_boy_1.png'
import studentBoy2 from './static/student_boy_2.png'
import studentBoy3 from './static/student_boy_3.png'
import student1 from './static/student_1.png'

export const next = () => {}

export const isFinishNode = (id: string, endNode: string) => id === endNode

export const calculateResponsiveSize = (min: number, max: number) =>
  `calc(${min}px + (${max} - ${min}) * ((100vw - 300px) / (1600 - 300)))`

const nonUniformRandomAnswer = (
  answers: Array<{
    id: string
    probability?: number
  }>
): string => {
  const random = Math.random()
  let aggregated_probability = 0

  const aggrgatedProb = answers.map((answer) => {
    aggregated_probability += answer.probability || 0
    return { id: answer.id, propability: aggregated_probability }
  })

  return (
    aggrgatedProb.find((answer) => answer.propability >= random)?.id ||
    answers[0].id
  )
}

export const uniformRandomAnswer = (
  answers: Array<{
    id: string
  }>
) => {
  return answers[Math.floor(Math.random() * answers.length)].id
}

export const selectRandomAnswers = (questions: Questions, uniform: boolean) => {
  for (let id in questions) {
    if (uniform) {
      questions[id].selectedAnswer = uniformRandomAnswer(questions[id].answers)
    } else {
      questions[id].selectedAnswer = nonUniformRandomAnswer(
        questions[id].answers
      )
    }
  }
  return questions
}

export const addQuestionToConversation = (id: string, uuid: string): void => {
  const conversation: string[] = getRecordedConversation(uuid)

  if (conversation.indexOf(id) >= 0) {
    window.localStorage.setItem(
      `conversation_${uuid}`,
      JSON.stringify(conversation.slice(0, conversation.indexOf(id) + 1))
    )
  } else {
    conversation.push(id)
    window.localStorage.setItem(
      `conversation_${uuid}`,
      JSON.stringify(conversation)
    )
  }
}

export const getRecordedConversation = (uuid: string): string[] => {
  const localValue = window.localStorage.getItem(`conversation_${uuid}`)
  return localValue ? JSON.parse(localValue) : []
}

export const removeRecordedConversation = () => {
  window.localStorage.removeItem('conversation')
}

export const removeConversation = (uuid: string) => {
  window.localStorage.removeItem(uuid)
  window.localStorage.removeItem('conversation_' + uuid)
  window.localStorage.removeItem('student_' + uuid)
}

export const hasDialogRecorded = (uuid: string) => {
  const dialog: string[] = getRecordedConversation(uuid)
  return dialog.length >= 2
}

export const getLastQuestion = (uuid: string) => {
  const dialog: string[] = getRecordedConversation(uuid)
  return dialog[dialog.length - 1]
}

export const getSelectedAvatar = (): number => {
  const avatar = window.localStorage.getItem('avatar')
  return avatar != null ? parseInt(avatar) : 1
}

export const setSelectedStudent = (uuid: string, id: number): void => {
  window.localStorage.setItem(`student_${uuid}`, '' + id)
}

export const getSelectedStudent = (uuid: string): number => {
  const student = window.localStorage.getItem(`student_${uuid}`)
  return student != null ? parseInt(student) : 1
}

export const getRandomStudent = (): string => {
  const students = [
    student1,
    studentBoy1,
    studentBoy2,
    studentBoy3,
    studentGirl1,
    studentGirl2,
    studentGirl3,
    studentGirl4
  ]
  return students[Math.floor(Math.random() * students.length)] 
}

export const poorMansUUID = (length = 10): string => {
  const randomNumbers = new Uint8Array(length)
  window.crypto.getRandomValues(randomNumbers)
  // @ts-ignore
  return randomNumbers.reduce((a, b) => a.toString() + b.toString()).toString()
}

export const getCsrfToken = (): string | undefined => {
  let csrfToken
  if (document.cookie && document.cookie !== '') {
    document.cookie.split(';').forEach((cookie) => {
      cookie = cookie.trim()
      if (cookie.startsWith('csrftoken', 0)) {
        csrfToken = cookie.split('=')[1]
      }
    })
  }
  return csrfToken
}

export const prepareConversationForSubmission = (
  dialogue: string[],
  questions: Questions,
  answers: Answers
): Record<string, Record<string, string>> => {
  const choices: Record<string, Record<string, string>> = {}

  dialogue.forEach((q, i) => {
    const question: Question = questions[q]
    const answer: Answer = answers[question.selectedAnswer]
    if (question && answer && i < dialogue.length - 1) {
      choices[q] = {
        question: question.label,
        answer_id: question.selectedAnswer,
        answer: answer.label,
      }
    }
  })

  return choices
}

export const submitConversation = (
  conversationUuid: string,
  choices: Record<string, Record<string, string>>
): boolean => {
  const completedConversation = {
    uuid: poorMansUUID(),
    conversation: conversationUuid,
    choices: choices,
  }
  // @ts-ignore
  const csrftoken = getCsrfToken()
  if (csrftoken) {
    axios
      .post(SUBMIT_CONVERSATION_PATH, completedConversation, {
        headers: { 'X-CSRFToken': csrftoken, mode: 'same-origin' },
      })
      .then((response: AxiosResponse) => {
        console.log(response)
        return true
      })
      .catch((err: AxiosError) => {
        console.error(err)
        if (err.response?.data) {
          // @ts-ignore
          const errorMessage = err.response?.data?.message || err.response?.data.detail || undefined
          if (errorMessage) {
            console.error(errorMessage)
          }
        }
      })
      .catch((err: any) => {
        console.error(err)
      })
      .finally(() => {
        return false
      })
  } else {
    console.error('Failed to fetch CSRF token.')
  }
  return false
}

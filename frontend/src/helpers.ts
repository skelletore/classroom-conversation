import { Choice, Choices, Response, Responses } from './types'

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

const nonUniformRandomResponse = (
  responses: Array<{
    id: string
    probability?: number
  }>
): string => {
  const random = Math.random()
  let aggregated_probability = 0

  const aggregatedProb = Object.values(responses).map((response) => {
    aggregated_probability += response.probability || 0
    return { id: response.id, probability: aggregated_probability }
  })

  return (
    aggregatedProb.find((response) => response.probability >= random)?.id ||
    responses[0].id
  )
}

export const uniformRandomResponse = (
  responses: Array<{
    id: string
  }>
) => {
  return responses[Math.floor(Math.random() * responses.length)].id
}

export const selectRandomResponses = (choices: Choices, uniform: boolean) => {
  for (let id in choices) {
    if (choices[id].responses.length < 1) continue
    if (uniform) {
      choices[id].selectedResponse = uniformRandomResponse(choices[id].responses)
    } else {
      choices[id].selectedResponse = nonUniformRandomResponse(
        choices[id].responses
      )
    }
  }
  return choices
}

export const addChoiceToConversation = (id: string, uuid: string): void => {
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

export const getRandomStudents = (count: number = 1): string[] => {
  const avatars: string[] = []
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
  if (count > students.length) count = students.length

  for (let i=0; i < count; i++) {
    let filtered = students.filter((student) => !avatars.includes(student))
    avatars.push(filtered[Math.floor(Math.random() * filtered.length)])
  }

  return avatars
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
  choices: Choices,
  responses: Responses
): Record<string, Record<string, string>> => {
  const history: Record<string, Record<string, string>> = {}

  dialogue.forEach((q, i) => {
    const choice: Choice = choices[q]
    const response: Response = responses[choice.selectedResponse]
    if (choice && response && i < dialogue.length - 1) {
      history[q] = {
        choice: choice.label,
        response_id: choice.selectedResponse,
        response: response.label,
      }
    }
  })

  return history
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

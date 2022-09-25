import React from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { StyledFinish } from './Finish.styled'

import {
  removeConversation,
  getRecordedConversation,
  getSelectedAvatar,
  prepareConversationForSubmission,
  submitConversation,
  getRandomStudents,
} from './../helpers'
import { UrlParams, Choice, Choices, Response, Responses } from './../types'

import clock from './../static/clock.png'

import teacherFemale from './../static/teacher_woman.png'
import teacherMale from './../static/teacher_man.png'

import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer'
import { useLocalStorage } from '../hooks'

Font.register({
  family: 'opensans',
  src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0ef8pkAg.ttf',
})

Font.register({
  family: 'gloriahallelujah',
  src: 'https://fonts.gstatic.com/s/gloriahallelujah/v11/LYjYdHv3kUk9BMV96EIswT9DIbW-MIS11zamvVCE.ttf',
})

const styles = StyleSheet.create({
  page: {
    padding: 20,
    border: '2 dotted black',
    fontFamily: 'opensans',
  },
  section: {
    textAlign: 'left',
    margin: 15,
  },
  choice: { fontSize: 14, marginBottom: 3 },
  response: { fontSize: 12 },
  notes: {
    height: '91%',
    margin: '5%',
    border: '2 dotted black',
    fontFamily: 'opensans',
  },
  header: {
    margin: 20,
    fontFamily: 'opensans',
    fontSize: 20,
    textAlign: 'center',
  },
  introPage: {
    height: '100%',
  },
  conversatioName: {
    fontFamily: 'gloriahallelujah',
    textAlign: 'center',
    fontSize: 35,
    margin: '5%',
    marginTop: '20%',
  },
  conversationDescription: {
    fontFamily: 'opensans',
    textAlign: 'center',
    fontSize: 17,
    margin: '10%',
  },
  conversationDate: {
    fontFamily: 'opensans',
    fontSize: 12,
    textAlign: 'center',
    bottom: 20,
    position: 'absolute',
    color: 'darkgrey',
  },
  teacher: {
    width: 200,
    position: 'absolute',
    bottom: 0,
    left: 10,
  },
  student: {
    width: 150,
    position: 'absolute',
    bottom: 0,
    right: 10,
  },
})

type PDFProps = {
  name: string
  intro: string
  choices: Choices
  dialog: string[]
  responses: Responses
  student: string
  teacher: string
}

type FinishProps = {
  name: string
  intro: string
  choices: Choices
  responses: Responses
}

const getDate = () => {
  const now = new Date()
  return now.getDate() + '-' + (now.getMonth() + 1) + '-' + now.getFullYear()
}

const PDFDocument = ({
  name,
  intro,
  choices,
  dialog,
  responses,
  student,
  teacher,
}: PDFProps) => (
  <Document>
    <Page size="A4" style={styles.introPage}>
      <Text style={styles.conversatioName}>{name}</Text>
      <Text style={styles.conversationDescription}>{intro}</Text>

      <Image style={styles.teacher} src={teacher} />
      <Image style={styles.student} src={student} />
      <Text style={styles.conversationDate}>Dato: {getDate()}</Text>
    </Page>

    <Page size="A4" style={styles.page}>
      {dialog.map((q, i) => {
        const choice: Choice = choices[q]
        const response: Response = responses[choices[q].selectedResponse]

        return (
          <View key={i} style={styles.section}>
            <Text style={styles.choice}>
              {i < dialog.length - 1 ? `Lærer ${i + 1}: ` : `Avslutning: `}
              {choice.label}
            </Text>
            {choice && response && i < dialog.length - 1 && (
              <Text style={styles.response}>
                Elev: {response ? response.label : ''}
              </Text>
            )}
          </View>
        )
      })}
    </Page>
    <Page size="A4">
      <View style={styles.notes}>
        <Text style={styles.header}>Notater:</Text>
      </View>
    </Page>
  </Document>
)

const Finish = ({ name, intro, choices, responses }: FinishProps) => {
  const history = useHistory()
  const { uuid } = useParams<UrlParams>()
  const [hasSubmitted, setHasSubmitted] =
    useLocalStorage<boolean>('hasSubmitted')

  const teacherAvatar: string =
    getSelectedAvatar() === 1 ? teacherFemale : teacherMale
  const studentAvatar: string = getRandomStudents(1)[0]
  const finishedAt = new Date().toISOString()
  const pdfFileName = `conversation-${finishedAt}.pdf`

  const dialogue = getRecordedConversation(uuid)
  const choiceHistory = prepareConversationForSubmission(dialogue, choices, responses)
  if (!hasSubmitted) {
    submitConversation(uuid, choiceHistory)
    setHasSubmitted(true)
  }

  return (
    <StyledFinish>
      <h1>Samtalen er nå ferdig!</h1>
      <div>
        <button
          className='btn-dark'
          onClick={() => {
            removeConversation(uuid)
            history.push('/conversation/' + uuid + '/start')
          }}
        >
          Start samtalen på ny
        </button>

        <PDFDownloadLink
          className='btn-dark'
          document={
            <PDFDocument
              name={name}
              intro={intro}
              choices={choices}
              dialog={dialogue}
              responses={responses}
              student={studentAvatar}
              teacher={teacherAvatar}
            />
          }
          fileName={pdfFileName}
        >
          {({ loading }: { loading: boolean }) =>
            loading ? 'Loading document...' : 'Last ned samtale'
          }
        </PDFDownloadLink>

        <button className='btn-dark' onClick={() => history.push('/browse/')}>
          Velg ny samtale
        </button>
      </div>

      <img src={clock} alt="Clock icon"></img>
    </StyledFinish>
  )
}

export default Finish

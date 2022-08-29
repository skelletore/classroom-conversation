import React from 'react'

import { StyledCreditPage, StyledCredits, StyledCredit } from './Credits.styled'

import studentGirl1 from './../static/student_girl_1.png'
import studentGirl2 from './../static/student_girl_2.png'
import studentGirl3 from './../static/student_girl_3.png'
import studentGirl4 from './../static/student_girl_4.png'
import studentBoy1 from './../static/student_boy_1.png'
import studentBoy2 from './../static/student_boy_2.png'
import studentBoy3 from './../static/student_boy_3.png'
import student1 from './../static/student_1.png'
import teacherMan from './../static/teacher_man.png'
import teacherWoman from './../static/teacher_woman.png'
import clock from './../static/clock.png'

const Credits = () => (
  <StyledCreditPage>
    <h1>Krediteringer</h1>
    <StyledCredits>
      <StyledCredit>
        <h3>Elev jente 1</h3>
        <img src={studentGirl1} alt="Elev (jente 1) avatar" />
        <p>
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>
          {' fra '}
          <a href="https://www.flaticon.com/free-icon/student_2784410" title="Flaticon">
            Flaticon
          </a>
        </p>
      </StyledCredit>
      <StyledCredit>
        <h3>Elev jente 2</h3>
        <img src={studentGirl2} alt="Elev (jente 2) avatar" />
        <p>
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>
          {' fra '}
          <a href="https://www.flaticon.com/free-icon/student_257651" title="Flaticon">
            Flaticon
          </a>
        </p>
      </StyledCredit>
      <StyledCredit>
        <h3>Elev jente 3</h3>
        <img src={studentGirl3} alt="Elev (jente 3) avatar" />
        <p>
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>
          {' fra '}
          <a href="https://www.flaticon.com/free-icon/student_4297861" title="Flaticon">
            Flaticon
          </a>
        </p>
      </StyledCredit>
      <StyledCredit>
        <h3>Elev jente 4</h3>
        <img src={studentGirl4} alt="Elev (jente 4) avatar" />
        <p>
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>
          {' fra '}
          <a href="https://www.flaticon.com/free-icon/student_7658160" title="Flaticon">
            Flaticon
          </a>
        </p>
      </StyledCredit>
      <StyledCredit>
        <h3>Elev gutt 1</h3>
        <img src={studentBoy1} alt="Elev (gutt 1) avatar" />
        <p>
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>
          {' fra '}
          <a href="https://www.flaticon.com/free-icon/student_2784403" title="Flaticon">
            Flaticon
          </a>
        </p>
      </StyledCredit>
      <StyledCredit>
        <h3>Elev gutt 2</h3>
        <img src={studentBoy2} alt="Elev (gutt 2) avatar" />
        <p>
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>
          {' fra '}
          <a href="https://www.flaticon.com/free-icon/student_257634" title="Flaticon">
            Flaticon
          </a>
        </p>
      </StyledCredit>
      <StyledCredit>
        <h3>Elev gutt 3</h3>
        <img src={studentBoy3} alt="Elev (gutt 3) avatar" />
        <p>
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>
          {' fra '}
          <a href="https://www.flaticon.com/premium-icon/student_2436683" title="Flaticon">
            Flaticon
          </a>
        </p>
      </StyledCredit>
      <StyledCredit>
        <h3>Elev 1</h3>
        <img src={student1} alt="Elev (1) avatar" />
        <p>
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>
          {' fra '}
          <a href="https://www.flaticon.com/premium-icon/student_2995657" title="Flaticon">
            Flaticon
          </a>
        </p>
      </StyledCredit>
      <StyledCredit>
        <h3>Lærer mann</h3>
        <img src={teacherMan} alt="Lærer mann avatar" />
        <p>
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>
          {' fra '}
          <a href="https://www.flaticon.com/free-icon/teacher_2784445" title="Flaticon">
            Flaticon
          </a>
        </p>
      </StyledCredit>
      <StyledCredit>
        <h3>Lærer dame</h3>
        <img src={teacherWoman} alt="Lærer dame avatar" />
        <p>
          <a href="https://www.flaticon.com/authors/monkik" title="monkik">
            monkik
          </a>
          {' fra '}
          <a href="https://www.flaticon.com/free-icon/teacher_1995574" title="Flaticon">
            Flaticon
          </a>
        </p>
      </StyledCredit>
      <StyledCredit>
        <h3>Klokke</h3>
        <img src={clock} alt="Klokke" />
        <p>
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>
          {' fra '}
          <a href="https://www.flaticon.com/" title="Flaticon">
            Flaticon
          </a>
        </p>
      </StyledCredit>
    </StyledCredits>
  </StyledCreditPage>
)

export default Credits

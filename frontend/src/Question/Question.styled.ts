import styled from 'styled-components'

import { calculateResponsiveSize } from './../helpers'
import blackboard from '../static/background-small.png'

export const StyledConversation = styled.div`
  height: -webkit-fill-available;
  

  .container {
    height: -webkit-fill-available;
    display: grid;
    grid-template-rows: 20% 40% 20% 20%;
    grid-auto-columns: 1fr;
    grid-auto-rows: 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
  }

  .conversation {
    margin-top: 5%;
    margin-left: 5%;
    margin-right: 5%;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 100%;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-template-areas:
      "question answers";
    grid-area: 1 / 1 / 2 / 2;
    min-height: 300px;
    max-height: 300px;

    h2 {
      font-family: 'Gloria Hallelujah', cursive;
    }
  }

  .question {
    grid-area: question;
  }

  .answers {
    text-align: right;
    grid-area: answers;

    .linkedResponse {
      margin-top: 50px;
    }
  }

  .media {
    display: grid;
    grid-template-columns: 20% 60% 20%;
    grid-template-rows: 100%;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-template-areas:
      ". illustrationContainer .";
    grid-area: 2 / 1 / 3 / 2;

    .illustrationContainer {
      height: ${calculateResponsiveSize(200, 350)};
      border: 3px solid rgba(0, 0, 0, .75);
      box-shadow: 2px 2px rgba(0, 0, 0, .5);
      background-image: url(${blackboard});
      background-size: cover;
      background-repeat: no-repeat;
      background-attachment: fixed;
      color: #FFFFFF;
      font-size: 1rem;
      grid-area: illustrationContainer;

      .illustration {
        position: relative;
        align-items: center;
        text-align: center;
        display: block;
        margin-left: auto;
        margin-right: auto;
        max-width: 75%;
      }
    }
  }

  .avatars {
    position: fixed;
    bottom: 175px;
    width: 100%;
    max-height: 300px;
    display: grid;
    grid-template-columns: 40% 20% 40%;
    grid-template-rows: 100%;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-template-areas:
      "teacher . students";
    grid-area: 2 / 1 / 3 / 2;

    .teacher {
      width: ${calculateResponsiveSize(75, 200)};
      grid-area: teacher;
      margin-left: 5%;
    }

    .students {
      position: absolute;
      right: 0px;
      bottom: 0px;
      display: flex;
      flex-direction: row;
      grid-area: students;

      .student {
        width: ${calculateResponsiveSize(50, 165)};
      }
    }
  }

  .choices {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 100%;
    gap: 0px 0px;
    grid-template-areas: 
      "questions illustrations"; 
    grid-area: 3 / 1 / 4 / 2; 
    align-items: center;
    justify-content: center;
    width: 100%;
    background-color: rgba(160, 160, 160, 0.5);
    border-radius: 0;
    padding: 10px;
    min-height: 150px;
    position: fixed;
    bottom: 0;

    flex-direction: row;
    justify-content: space-around;

    .questions {
      margin-left: 5%;
      position: absolute;
      left: 0px;
      grid-area: questions;
      
      button {
        margin: 0px 10px 10px 0px;
      }
    }
    .illustrations {
      margin-right: 5%;
      position: absolute;
      right: 0px;
      grid-area: illustrations;

      .illustration {
        margin: 0 10px;
        width: ${calculateResponsiveSize(100, 220)};;
      }
    }
  }
`

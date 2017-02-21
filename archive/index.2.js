/** ANSWERS ONLY */

import React, { createElement as h } from 'react'
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux'
import { createSelector } from 'reselect'

const ANSWER_QUESTION = 'ANSWER_QUESTION';

const Answer = function() {
  function Component({ text = "This is an Answer", selected = false, onClick }) {
    console.log('ANSWER PROPS', arguments[0])
    return h('div', { className: "answer", onClick }, 
      h('div', { className: "text" }, text),
      h('div', { className: 'selected' }, `This answer ${selected ? 'HAS' : 'HAS NOT'} been chosen.`)
    )
  }
  return connect()(Component);
}();

const Question = function() {
  function Component({ answers = [], dispatch }) {
    return h('div', null, 
      answers.map(({ text, selected }, key) => {
        return h(Answer, { text, selected, key, onClick: () => dispatch({ type: 'ANSWER_QUESTION', key }) }) 
      })
    )
  }
  function mapStateToProps(state = { answers: [] }) {
    console.log('QUESTION STATE TO PROPS', state);
    return state;
  }
  return connect(mapStateToProps)(Component);
}();

function answerReducer(state = { selected: false }, action) {
  console.log('%cANSWER REDUCER ACTION', 'color: red', action);
  switch (action.type) {
    case ANSWER_QUESTION:
      return Object.assign({}, state, { selected: true });
    default:
      return Object.assign({}, state, { selected: false });
  }
}

function questionReducer(state = { answers: [ { text: "Beer" }, { text: "Wine" } ] }, action) {
  console.log('%cQUESTION REDUCER ACTION', 'color: blue', action);
  switch (action.type) {
    case 'ANSWER_QUESTION':
      return { answers: state.answers.map((a, key) => key === action.key ? answerReducer(a, action) : a ) }
  }
  return state;
}

const store = createStore(questionReducer);

const quiz = (
  h(Provider, { store },
    h(Question)
  )
)

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(quiz, root)

// const ANSWER_QUESTION = 'ANSWER_QUESTION';

// const Quiz = function() {
//   function Component({ questions, dispatch }) {
//     console.log('%cRENDER', 'color: orange')
//     return h('div', null, [
//       'quiz',
//       questions.map(({ text, answers }, questionKey) => {
//         return h('div', { key: questionKey, className: "question" },
//           h('div', { className: "text" }, text),
//           answers.map(({ text, selected = false }, key) => {
//             return h('div', { key, className: "answer", onClick: () => { dispatch({ type: ANSWER_QUESTION, key, questionKey }) } }, 
//               h('div', { className: "text" }, text),
//               h('div', { className: 'selected' }, `This answer ${selected ? 'HAS' : 'HAS NOT'} been chosen.`)
//             )
//           })
//         )
//       })
//     ])
//   }
//   function mapStateToProps({ questions }) {
//     return {
//       questions
//     }
//   }
//   return connect(mapStateToProps)(Component);
// }();

// // const Answer = function() {
// //   function AnswerComponent({ text }) {
// //     return h('div', null, 
// //       h('div', null, text),
// //       h('button', null, 'answer')
// //     );
// //   }
// //   // const getQuestions = state => state.questions;
// //   function mapStateToProps(state, ownProps) {
// //     console.log(state);
// //     return { text: "wow" }
// //   }
// //   return connect(mapStateToProps)(AnswerComponent);
// // }();

// const initialState = {
//   questions: [
//     { 
//       text: "What's the best beverage?", 
//       answers: [
//         { text: "Wine" },
//         { text: "Coffee" },
//         { text: "Beer", correct: true },
//         { text: "Liquor" },
//         { text: "Tea" }
//       ] 
//     },
//     { 
//       text: "What time of day is it?", 
//       answers: [
//         { text: "Eight twenty post meridiem" },
//         { text: "Oh nine hundred hours" },
//         { text: "123124124124 milliseconds past Linux epoch", correct: true },
//         { text: "Beer time" }
//       ] 
//     }
//   ]
// }

// function questionReducer(state, action) {
//   switch (action.type) {
//     case ANSWER_QUESTION:

//   }
// }

// function reducer(state = initialState, action) {
//   console.log('%c ACTION', 'color: green', action);
//   switch (action.type) {
//     case ANSWER_QUESTION:
//       state.questions[action.questionKey].answers[action.key].selected = true
//       console.log('%c STATE', 'color: blue', state);
//       return state;
//     default:
//       return state;
//   }
// }

// const store = createStore(reducer)

// const quiz = (
//   h(Provider, { store },
//     h(Quiz)
//   )
// )

// const root = document.createElement('div');
// document.body.appendChild(root);
// ReactDOM.render(quiz, root)
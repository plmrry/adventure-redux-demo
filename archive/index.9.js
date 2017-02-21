import React, { createElement as h } from 'react'
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux'
import { createSelector } from 'reselect'
import { normalize, schema } from 'normalizr';

function makeIds(obj) {
  const id = function() {
    let id = 0;
    return function() {
      return id++
    }
  }();
  function traverse(obj) {
    if (Array.isArray(obj)) {
      return obj.map(traverse)
    }
    if (typeof obj === "object") {
      const out = { id: id() }
      Object.keys(obj).forEach(key => {
        out[key] = traverse(obj[key])
      })
      return out;
    }
    return obj;
  }
  return traverse(obj);
}

const initial = function() {
  const _quiz = {
    questions: [
      { 
        text: "What's the best beverage?", 
        answers: [
          { text: "Wine" },
          { text: "Coffee" },
          { text: "Beer", correct: true },
          { text: "Liquor" },
          { text: "Tea" }
        ] 
      },
      { 
        text: "What time of day is it?", 
        answers: [
          { text: "Eight twenty post meridiem" },
          { text: "Oh nine hundred hours" },
          { text: "123124124124 milliseconds past Linux epoch", correct: true },
          { text: "Beer time" }
        ] 
      }
    ]
  }
  const quiz = makeIds(_quiz);
  const answer = new schema.Entity('answers')
  const question = new schema.Entity('questions', { answers: [ answer ] })
  const data = normalize(quiz, { questions: [ question ] });
  return Object.assign({}, data.entities, { quiz: data.result })
}();

console.log(initial);

const Answer = function() {
  function component({ text = "I am an Answer", selected = false, onClick }) {
    return h('div', { className: 'answer', onClick }, 
      h('h1', null, text),
      h('pre', null, `I HAVE ${selected ? '' : 'NOT' } been selected.`)
    )
  }
  function mapStateToProps(state, { id }) {
    return state.answers[id];
  }
  function mapDispatchToProps(dispatch, { id }) {
    return {
      onClick: () => dispatch({ type: 'SELECT_ANSWER', id })
    }
  }
  return connect(mapStateToProps, mapDispatchToProps)(component)
}();

function answerReducer(state = { selected: false }, action) {
  switch (action.type) {
    case 'SELECT_ANSWER':
      return Object.assign({}, state, { selected: true })
    default:
      return Object.assign({}, state, { selected: false })
  }
}

function answersReducer(state = initial.answers, action) {
  return Object.assign({}, state, { [action.id]: answerReducer(state[action.id], action) });
}

const Question = function() {
  function Question({ answers, isAnswered, text, dispatch }) {
    return h('div', { className: 'question' },
      h('h1', null, text),
      h('pre', null, `I am a Question and I ${isAnswered ? 'HAVE' : 'HAVE NOT' } been answered`),
      answers.map(id => h(Answer, { key: id, id }))
    )
  }
  function mapStateToProps(state, { id }) {
    return state.questions[id];
  }
  return connect(mapStateToProps)(Question)
}();

function questionReducer(state = initial.questions, action) {
  return state;
}

const Quiz = function() {
  function component({ questions = [], complete = false, onReset }) {
    return h('div', null,
      h('pre', null, `I am a Quiz and I HAVE ${complete ? '' : 'NOT'} been completed`),
      h('pre', { onClick: onReset }, 'Reset quiz'),
      questions.map(id => h(Question, { key: id, id }, `question ${id}`))
    )
  }
  function mapStateToProps(state) {
    return { questions: Object.keys(state.questions) }
  }
  function mapDispatchToProps(dispatch) {
    return {
      onReset: () => dispatch({ type: 'RESET_QUIZ' })
    }
  }
  return connect(mapStateToProps, mapDispatchToProps)(component)
}();

function quizReducer(state = {}, action) {
  return state;
}

const store = createStore(combineReducers({
  answers: answersReducer,
  questions: questionReducer,
  quiz: quizReducer
}));

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render((
  h(Provider, { store },
    h(Quiz)
  )
), root)

// const Answer = function() {
//   function Component({ text = "This is an Answer", selected = false, onClick }) {
//     console.log('ANSWER PROPS', arguments[0])
//     return h('div', { className: "answer", onClick }, 
//       h('div', { className: "text" }, text),
//       h('div', { className: 'selected' }, `This answer ${selected ? 'HAS' : 'HAS NOT'} been chosen.`)
//     )
//   }
//   return connect()(Component);
// }();

// const Question = function() {
//   function Component({ answers = [], dispatch }) {
//     return h('div', null, 
//       h('div', { className: 'text' }, 'Question'),
//       answers.map(({ text, selected }, key) => {
//         return h(Answer, { text, selected, key, onClick: () => dispatch({ type: 'ANSWER_QUESTION', key, foo: () => 123 }) }) 
//       }),
//       h('div', { onClick: () => dispatch({ type: 'RESET' }) }, 'Reset')
//     )
//   }
//   function mapStateToProps(state = { answers: [] }) {
//     console.log('QUESTION STATE TO PROPS', state);
//     return state;
//   }
//   return connect(mapStateToProps)(Component);
// }();

// function answerReducer(state = { selected: false }, action) {
//   console.log('%cANSWER REDUCER ACTION', 'color: red', action);
//   switch (action.type) {
//     case 'ANSWER_QUESTION':
//       return Object.assign({}, state, { selected: true });
//     case 'RESET':
//       return Object.assign({}, state, { selected: false })
//     default:
//       return Object.assign({}, state, { selected: false });
//   }
// }

// function questionReducer(state = { answers: [ { text: "Beer" }, { text: "Wine" } ] }, action) {
//   console.log('%cQUESTION REDUCER ACTION', 'color: blue', action);
//   switch (action.type) {
//     case 'ANSWER_QUESTION':
//       return { answers: state.answers.map((a, key) => key === action.key ? answerReducer(a, action) : a ) }
//     case 'RESET':
//       return { answers: state.answers.map((a) => answerReducer(a, action)) }
//     default:
//       return state;
//   }
// }

// // const quiz_raw = {
// //   questions: [
// //     { 
// //       text: "What's the best beverage?", 
// //       answers: [
// //         { text: "Wine" },
// //         { text: "Coffee" },
// //         { text: "Beer", correct: true },
// //         { text: "Liquor" },
// //         { text: "Tea" }
// //       ] 
// //     },
// //     { 
// //       text: "What time of day is it?", 
// //       answers: [
// //         { text: "Eight twenty post meridiem" },
// //         { text: "Oh nine hundred hours" },
// //         { text: "123124124124 milliseconds past Linux epoch", correct: true },
// //         { text: "Beer time" }
// //       ] 
// //     }
// //   ]
// // }

// // const question = new schema.Entity('questions')

// // const quiz = new schema.Entity('quizzes', {
// //   questions: [ question ]
// // });

// // console.log(normalize(quiz_raw, quiz))

// const questions = [
//   { 
//     text: "What's the best beverage?", 
//     answers: [
//       { text: "Wine" },
//       { text: "Coffee" },
//       { text: "Beer", correct: true },
//       { text: "Liquor" },
//       { text: "Tea" }
//     ] 
//   },
//   { 
//     text: "What time of day is it?", 
//     answers: [
//       { text: "Eight twenty post meridiem" },
//       { text: "Oh nine hundred hours" },
//       { text: "123124124124 milliseconds past Linux epoch", correct: true },
//       { text: "Beer time" }
//     ] 
//   }
// ]

// // console.log(normalize(questions))

// function quizReducer(state = { questions }, action) {
//   console.log('%cQUIZ REDUCER', 'color: blue', action, state);
//   return state;
// }

// const Quiz = function() {
//   function component({ questions = [], dispatch }) {
//     console.log(arguments[0])
//     return h('div', null, 
//       h('div', { className: 'text' }, 'Quiz'),
//       questions.map((question, key) => {
//         return h(Question, { key })
//       })
//     )
//   }
//   function mapStateToProps(state) {
//     console.log('%cQUIZ MAP STATE', 'color: purple', state);
//     return state;
//   }
//   return connect(mapStateToProps)(component);
// }();

// const store = createStore(quizReducer);

// const _quiz = (
//   h(Provider, { store },
//     h(Quiz)
//   )
// )

// const root = document.createElement('div');
// document.body.appendChild(root);
// ReactDOM.render(_quiz, root)

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
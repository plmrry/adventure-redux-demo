import React, { createElement as h } from 'react'
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux'
import { createSelector } from 'reselect'
import { normalize, schema } from 'normalizr';

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

//  FROM HERE ON IT'S "JUST" REDUX

// ANSWER =======================================================

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

// QUESTION =======================================================


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

// QUIZ =======================================================

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

// LETS DO IT =======================================================

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
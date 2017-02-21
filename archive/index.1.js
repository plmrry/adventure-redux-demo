import React, { createElement as h } from 'react'
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux'
import { createSelector } from 'reselect'

const Quiz = function() {
  function Component({ questions }) {
    return h('div', null, [
      'quiz',
      questions.map(({ text, answers }, key) => {
        return h('div', { key, className: "question" },
          h('div', { className: "text" }, text),
          answers.map(({ text, selected = false }, key) => {
            return h('div', { key, className: "answer" }, 
              h('div', { className: "text" }, text),
              h('button', null, 'choose')
            )
          })
        )
      })
    ])
  }
  function mapStateToProps({ questions }) {
    return {
      questions
    }
  }
  return connect(mapStateToProps)(Component);
}();

const Answer = function() {
  function AnswerComponent({ text }) {
    return h('div', null, 
      h('div', null, text),
      h('button', null, 'answer')
    );
  }
  // const getQuestions = state => state.questions;
  function mapStateToProps(state, ownProps) {
    console.log(state);
    return { text: "wow" }
  }
  return connect(mapStateToProps)(AnswerComponent);
}();

const initialState = {
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

function reducer(state = initialState, action) {
  return state;
}

const store = createStore(reducer)

const quiz = (
  h(Provider, { store },
    h(Quiz)
  )
)

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(quiz, root)
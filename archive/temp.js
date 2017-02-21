const { normalize, schema } = require('normalizr');

const quiz = {
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

function idFactory() {
  let id = 0;
  return function() {
    return id++
  }
}

const idFunc = idFactory();

function makeIds(obj) {
  if (Array.isArray(obj)) {
    console.log('array')
    return obj.map(makeIds)
  }
  if (typeof obj === "object") {
    console.log('object')
    const out = {}
    out._id = idFunc()
    Object.keys(obj).forEach(key => {
      out[key] = makeIds(obj[key])
    })
    return out;
  }
  console.log('thing', obj);
  return obj;
}

const out = makeIds(quiz)

// const answer = new schema.Entity('answers', {}, { idAttribute: 'text' })
// const question = new schema.Entity('questions', { answers: [ answer ] }, { idAttribute: 'text' })

// const out = normalize(quiz, { questions: [ question ] })

console.dir(out, { depth: null });
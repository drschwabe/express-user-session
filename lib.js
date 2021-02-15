const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const _ = require('underscore')

const memorySession = {}

let startupTimestamp

memorySession.start = (req) => {
  if(!startupTimestamp) return console.warn('startupTimestamp undefined , did you run memorySession.init() ? ')
  req.session.user = {
    _id: startupTimestamp + '_' + _.uniqueId()
  }
}

memorySession.destroy = (req, callback) => {
  req.session.destroy(callback)
}

memorySession.init = (state, app) => {
  if(state.memorySession && state.memorySession.initialized) return
  //Default options :
  var sess = {
    name : 'session-memory',
    secret: 'apple pie',
    resave: false, //< refreshes the cookie each time req obj modified
    saveUninitialized : false, //< do not save sessions that do not login
    storeCheckPeriod : 120000, // In 2 minutes expired sessions will be purged from memory.
    cookie: {
      maxAge : 60000 //< 1 minute cookie!
    }
  }

  //if some options were pre-supplied we accommodate merging them here:
  if(state.memorySession) {
    sess = _.extend( sess, state.memorySession )
  } else {
    state.memorySession = { initialized : true }
  }
  if(!sess.store) {
    store : new MemoryStore({
      checkPeriod: sess.storeCheckPeriod  // In 2 minutes expired sessions will be purged from memory.
    })
  }

  app.use(session(sess))

  //get a timestamp from when this module was required (presumably when the server starts)
  startupTimestamp = Date.now()

  state.memorySession.initialized = true
}

memorySession.serve = app => {
  app.post('/memory-user-session/start', (req, res) => {
    console.log('start a session!')
    memorySession.start(req)
    res.send({ok:true})
  })

  app.post('/memory-user-session/destroy', (req, res) => {
    console.log('destroy this session!')
    memorySession.destroy(req, () => {
      res.send({ok: true})
    })
  })
}

module.exports = memorySession
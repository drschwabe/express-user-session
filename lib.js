const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const _ = require('underscore')

const memorySession = {}

memorySession.start = (req) => {
  req.session.user = {
    _id: Date.now() + '_' + _.uniqueId()
  }
}

memorySession.destroy = (req, callback) => {
  req.session.destroy(callback)
}

memorySession.init = (app, options) => {
  //Default options :
  var sess = {
    name : 'priority-session',
    secret: 'apple pie',
    resave: false, //< refreshes the cookie each time req obj modified
    saveUninitialized : false, //< do not save sessions that do not login
    storeCheckPeriod : 120000, // In 2 minutes expired sessions will be purged from memory.
    cookie: {
      maxAge : 60000 //< 1 minute cookie!
    }
  }

  //if some options were pre-supplied we accommodate merging them here:
  if(options) {
    sess = _.extend( sess, options )
  }
  if(!sess.store) {
    sess.store = new MemoryStore({
      checkPeriod: sess.storeCheckPeriod  // In 2 minutes expired sessions will be purged from memory.
    })
  }

  app.use(session(sess))
}

memorySession.serve = app => {
  app.post('/priority-express-session/start', (req, res) => {
    console.log('start a session!')
    memorySession.start(req)
    res.send({ok:true})
  })

  app.post('/priority-express-session/destroy', (req, res) => {
    console.log('destroy this session!')
    memorySession.destroy(req, () => {
      res.send({ok: true})
    })
  })
}

module.exports = memorySession
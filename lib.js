const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const _ = require('underscore')
const cryptoRandomString = require('crypto-random-string')

const userSession = {}

userSession.start = (req) => {
  req.session.user = {
    _id: Date.now() + '_' + _.uniqueId()
  }
}

userSession.destroy = (req, callback) => {
  req.session.destroy(callback)
}

userSession.init = (app, options) => {
  //Default options :
  var sess = {
    name : 'priority-session',
    secret: cryptoRandomString({length: 32 }),
    resave: false, //< refreshes the cookie each time req obj modified
    saveUninitialized : false, //< do not save sessions that do not login
    storeCheckPeriod : 120000, // In 2 minutes expired sessions will be purged from memory.
    cookie: {
      maxAge : 60000 * 2880 //48 hours
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

userSession.serve = app => {
  app.post('/user-session/start', (req, res) => {
    console.log('start a session!')
    userSession.start(req)
    res.send({ok:true})
  })

  app.post('/user-session/destroy', (req, res) => {
    console.log('destroy this session!')
    userSession.destroy(req, () => {
      res.send({ok: true})
    })
  })
}

module.exports = userSession
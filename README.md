# Priority Express Session

Simple memory session tek; wrapper/convenience library around [express-session] and defaulting to [memorystore]


### install/usage: 

```bash
npm install priority-express-session
```

```js
const express = require('express')
const app = express() 
const prioritySession = require('priority-express-session') 
prioritySession.init(app, options) 
prioritySession.serve(app) 
```
.serve() extends Express app object with 2 POST routes:

```
/priority-session/start 
/priority-session/destroy 
```

The `/priority-session/start` establishes an object on req.session called `user` with a unique id as follows: 

```js
req.session.user = {
  _id : startupTimestamp + '_' + _.uniqueId()
}
```
The session will expire in 48 hours unless deleted explicitly

#### options

You may supply any or all of the following options to overwrite these corresponding defaults:  
```
prioritySession.init(app, {
  name : 'session-memory',
  secret: 'apple pie',
  resave: false, //< refreshes the cookie each time req obj modified
  saveUninitialized : false, //< do not save sessions that do not login
  storeCheckPeriod : 120000, // In 2 minutes expired sessions will be purged from memory.
  cookie: {
    maxAge : 172800 //< 48 hours 
  }
}) 
```

[express-session]:https://github.com/expressjs/session
[memorystore]: https://github.com/roccomuso/memorystore
## Priority Express Session

Simple memory session tek; wrapper/convenience library around [express-session] and defaulting to [memorystore]


### install/usage/API

```bash
npm install priority-express-session
```

```js
const express = require('express')
const app = express() 
const prioritySession = require('priority-express-session') 
prioritySession.init(app, options) 

// Quick way: 
prioritySession.serve(app)

// Or do the manual way; within an Express route call: 
prioritySession.start(req) 
prioritySession.destroy(req) 
```
`.serve()` is a convenience function that extends your Express app object with 2 POST routes:

```
/priority-session/start 
/priority-session/destroy 
```

So for example when your user hits the `/priority-session/start` it will call `prioritySession.start()` and establish an object on req.session called `user` with a unique id as follows: 

```js
req.session.user = {
  _id : Date.now() + _.uniqueId()
}
```
The session will expire in 48 hours unless deleted explicitly.  You can delete it by having your user call `/priority-session/destroy`

Alternatively you can handle your routing manually and just call just call `.start(req)` and `.destroy(req)` programmatically where `req` is the req parameter of a typical Express route.  

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

#### protecting routes

If you want to use Priority Express Session to protect routes; you can use this canonical example from Express convention to check for presence of a `req.session.user` redirecting to login page if not already created. 

```js
const ensureLoggedIn = (req, res, next) => {
  if(req.session && req.session.user) return next() //< logged in
  //otherwise they need to login first:
  res.redirect('/')
}
let protectedRoutes = [
  '/dashboard',
  '/my-profile'
]
app.get(protectedRoutes, ensureLoggedIn)

```
The above example assumes the aforementioned `prioritySession.start()` is only called upon successful login.  You can call `prioritySession.destroy()` when the user logs out ie- after clicking "Logout" button trigger a POST request to your server code which in turn runs said `.destroy()` on that request.


MIT

[express-session]:https://github.com/expressjs/session
[memorystore]: https://github.com/roccomuso/memorystore
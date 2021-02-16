## Express User Session

Simple session technique; wrapper/convenience library around [express-session] and defaulting to [memorystore] for the purpose of quickly getting a `.user` object on `req.session`


### install/usage/API

```bash
npm install express-user-session
```

```js
const express = require('express')
const app = express() 
const userSession = require('express-user-session') 
userSession.init(app, options) 

// Quick way: 
userSession.serve(app)

// Or do the manual way; ie- within your existing Express routes: 
userSession.start(req)
// ex: app.post('/logout', (req, res) => ... 
userSession.destroy(req) 
```
`.serve()` is a convenience function that extends your Express app object with 2 POST routes:

```
/user-session/start 
/user-session/destroy 
```

So for example when your user hits the `/user-session/start` it will call `userSession.start()` and establish an object on `req.session` called `user` with a unique id as follows: 

```js
req.session.user = {
  _id : Date.now() + _.uniqueId()
}
```
Now you can set/change values on `req.session.user` (following the same behavior as in [express-session#reqsession] ) and they will persist throughout your application until said session expires... 

the session by default will expire in 48 hours unless deleted manually.  You can delete it by having your user request the route `/user-session/destroy` or by calling `.destroy(req)` manually. 

#### options

You may supply any or all of the following options to overwrite these corresponding defaults:  
```js
userSession.init(app, {
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

If you want to use Express User Session to protect routes you can use this canonical example to check for presence of a `req.session.user` redirecting to your login page if not already created. 

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
The above example assumes the aforementioned `start()` is only called upon successful login.  You can call `destroy()` when the user logs out ie- after clicking "Logout" button trigger a POST request to your server code which in turn runs said `.destroy()` on that request; subsequent attempts to visit `/dashboard` or `/my-profile` will then redirect to the `/` root page where your theoretical login form is served. 


MIT

[express-session]:https://github.com/expressjs/session
[memorystore]: https://github.com/roccomuso/memorystore
[express-session#reqsession]:https://github.com/expressjs/session#reqsession
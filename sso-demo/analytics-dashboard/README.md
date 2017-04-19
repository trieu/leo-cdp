# REACT WEBAPP WITH EXPRESS.JS

## Setup
1. `npm install`

## Usage

1. `npm start` //for build code dev

2. `npm start:windows`  //for windows os

3. `npm run start:prod`  //for build code productment

## Action

## Passport
Login success (call session request in router express js)
1. req.user => json object {id: , username: , roles:}
2. req.isAuthenticated() => true

## File Structure

```
mean-stack/
 │
 ├── src/
 │   ├──components/                 *
 │   │   ├──folder
 │   │
 │   └──layouts/                *
 │   │   └──file
 │   │
 │   └──pages
 │   │   └──file
 │   │	 
 │   │──index.js                    * main js of react
 │   ├──routes.js					* config route
 │   └──........				    
 │
 ├── public/
 │   ├──css
 │   ├──js
 │   └──template    
 │
 └── server/
     ├──configs/					*
     │   ├──routes.js 
     │   ├──passport-config.js
     │   └──........
     │
     ├──controllers/				* all file api
     ├──helpers/
     └──..../
```
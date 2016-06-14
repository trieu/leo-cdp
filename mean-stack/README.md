# Super MEAN Stack
> An Angular + Node/Express + MongoDB + gulp

## Setup
1. `npm install`

## Usage

1. `npm test`

2. `npm start` 

## Action
1. `npm test` (gulp) compress file and watch file changed + nodemon auto restart

2. `npm start` (gulp) compress minimize file <not watch file> + nodemon auto restart 

## File Structure

```
mean-stack/
 │
 ├── app/
 │   ├──components/                 *
 │   │   ├──folder
 │   │
 │   └──controllers/                *
 │   │   └──file
 │   │
 │   └──views
 │   │   ├──partial folder
 │   │	 └──pages file
 │   │
 │   ├──index.js					* config route angular & add module angular & run app
 │   └──layout.html					* root layout
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
     │   └──.......
     │
     ├──controllers/				* all file api
     ├──helpers/
     └──..../
```
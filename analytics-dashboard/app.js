/************
enviroment common
************/
global.NODE_ENV = process.env.NODE_ENV || 'prod';
console.log('******** Enviroment '+ NODE_ENV +' ********');
/************
enviroment common
************/
console.log("test");
require('./server/index.js');

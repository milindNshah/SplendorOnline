const context = require.context('./src/client/app/tests', true, /-test\.js$/); //make sure you have your directory and regex test set correctly!
context.keys().forEach(context);

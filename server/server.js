const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path')

app.use(express.static(path.resolve('./dist')))
app.set('views', path.join(__dirname, 'dist'))
// app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.use(express.static(path.join(__dirname, 'public/views')));

app.get('/', (req, res) => {
    //res.sendFile( __dirname + '/dist' + '/index.html');
    res.sendFile( __dirname + '/dist/index.html');
    console.log(__dirname, '/index.html')
})
  
const messages = []

/*
io.on('connection', (socket) => {

    console.log(`New user: ${socket.id}`)
    

    //Ação para quando RECEBER A MENSAGEM com o titulo 'chat message'
    socket.on('chat message', (msg)=>{
        console.log(`New msg: ${msg}`)

        io.emit('chat message', msg) //ENVIA para o CLIENT a mesma mensagem
        messages.push(msg)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
*/
app.listen(3000, () => console.log('Server on:3000'))
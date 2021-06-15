var express = require('express')
var app = express()
const PORT = process.env.PORT || 3000;
const server = require("http").createServer(app);
var cors = require('cors')

app.use(cors())


const io = require('socket.io')(server,{
    cors: {
        origin:'*',
        methods: ["GET", "POST"]
    }
});

app.use(cors());

app.get('/',(req,res)=>{
    res.send('Server is running');
});

io.on('connection',(socket)=>{
    socket.emit('me',socket.id);

    socket.on('disconnect',()=>{
        socket.broadcast.emit("callEnded");
    });

    socket.on('calluser',({ userToCall,signalData,from,name })=>{
        io.to(userToCall).emit('calluser',{signal:signalData , from,name});

    });

    socket.on('answercall',(data)=>{
        io.to(data.to).emit('callaccepted',data.signal)
    });

});
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))











server.listen(PORT,()=>console.log(`Server listening on port ${PORT}`));
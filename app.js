const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const cors= require('cors');

const data = require('./data');
const uploads = require('./middleware/fileUpload');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const postRoutes = require('./routes/postRoutes');
const aboutusRoutes = require('./routes/aboutUsRoutes');
const commentRoutes = require('./routes/commentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

app.use(express.json()); //3l4an extract data in json not form
app.use(express.urlencoded({ extended: true }))
app.use(cors());
//to serve static folder in images folder to images
app.use(express.static(path.join( __dirname, './uploads')));

/* start middleware for handle different server on client and server*/
app.use((req, res, nxt) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','OPTIONS, GET, POST, PUT, PUTCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    nxt();
});
/***** end middlewares ********/
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
/* start routes */
app.use('/auth', authRoutes);
app.use('/profile', userRoutes);
app.use('/category', categoryRoutes);
app.use('/post/:postId/comment', commentRoutes);
app.use('/post', postRoutes);
app.use('/aboutus', aboutusRoutes);
app.use('/message', messageRoutes);
app.use('/job', jobRoutes);
/* end routes */

/* start database & server & socket.io*/

mongoose.connect(data.DB, 
{ useUnifiedTopology: true , useNewUrlParser: true, useFindAndModify: false})
.then(() => {
    const server = app.listen(data.PORT, () => {
        console.log(`Server is listening to port ${data.PORT}`);
    }) ;
    //NEW! 
    const io = require('socket.io')(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT'],
            credentials: true
        }
    });
    io.on('connection', socket => {
        // connection between server and client
        const { id } = socket.client;
        console.log(`Client connected: ${id}`);

        //chat_message is an  will use in the front
        socket.on('chat_message', msg => {
            socket.emit('chat_message', msg)
            console.log(`user "${id}" sent: ${msg}`);
        });
    });
})
.catch(err => {
    console.log(err)
});
/* end database & server */
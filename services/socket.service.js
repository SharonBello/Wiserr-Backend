const logger = require('./logger.service')

var gIo = null

function setupSocketAPI(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        socket.on('disconnect', socket => {})

        socket.on("join order", (userId) => {
            console.log('LINE 15 USER ID:', userId)
            socket.join(userId);
            socket.orderChannel = userId;
          });
          socket.on("user-connected", (userId) => {
            gIo.to(userId).emit("user-online", userId);
          });
          socket.on("new order", (savedOrder) => {
            if(savedOrder.seller) {
              console.log('LINE 23 SAVED ORDER', savedOrder)
              socket.to(savedOrder.seller._id).emit("added order", savedOrder);}
            // socket.to(savedOrder).emit("order received");
          });
          socket.on("new status", ({ order, notification }) => {
            socket.to(order.buyer._id).emit("changed status", order);
            socket.to(order.buyer._id).emit("order status", notification);
          });
          socket.on("set-user-socket", (userId) => {
            socket.userId = userId;
            gIo.to(userId).emit("user-online", userId);
          })
          socket.on("user-online", (userId) => {
            socket.userId = userId;
            gIo.to(userId).emit("user-online", userId);
          });
          socket.on("unset-user-socket", (userId) => {
         
            delete socket.userId;
            gIo.emit("user-offline", userId);
          });
          socket.on("isUserConnected", async (userId) => {
            const userSocket = await _getUserSocket(userId);
            if (userSocket) gIo.emit("user-connection", userId);
            else {
              gIo.emit("find-user", userId);
            }
          });
    })
}

async function broadcast({ type, data, room = null, userId }) {
    logger.info(`Broadcasting event: ${type}`)
    const excludedSocket = await _getUserSocket(userId)
    if (room && excludedSocket) {
        logger.info(`Broadcast to room ${room} excluding user: ${userId}`)
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        logger.info(`Broadcast to all excluding user: ${userId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        logger.info(`Emit to room: ${room}`)
        gIo.to(room).emit(type, data)
    } else {
        logger.info(`Emit to all`)
        gIo.emit(type, data)
    }
}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.userId === userId)
    return socket
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets()
    return sockets
}

async function _printSockets() {
    const sockets = await _getAllSockets()
    
    sockets.forEach(_printSocket)
}
function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

module.exports = {
    // set up the sockets service and define the API
    setupSocketAPI,
    
}

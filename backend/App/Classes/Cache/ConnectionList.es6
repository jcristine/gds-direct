"use strict";

class ConnectionList {
    constructor() {

        this.roomsByUserId = {};
        this.roomsByRoomId = {};
    }

    removeByUserSocket(userId, socket) {
        if (!this.getSocketsCountByUserId(userId)) {
            this.removeByUserId(userId);
        }
    }

    // kick out user
    removeByUserId(userId) {
        this.getSocketsByUserId(userId).forEach(socketId => {
            const xSocket = this.getSocketById(socketId);
            if (xSocket !== null) {
                xSocket.disconnect();
            }
            this._removeSocketFromUser(userId, socketId);
            this._removeSocketById(socketId);
        });
        this._removeSessionFromUser(userId);
        this._removeFromRoomByUserId(userId);
        this._removeUserById(userId);
    }

    getTotalSocketCount() {
        return Object.keys(this._sockets).length;
    }

    getSocketsCountByUserId(userId) {
        return this._socketsByUsers[userId] ? this._socketsByUsers[userId].length : 0;
    }

    getSocketsByUserId(userId) {
        return (this._socketsByUsers[userId] && this._socketsByUsers[userId].length) ? this._socketsByUsers[userId] : [];
    }

    getSocketsIds() {
        return Object.keys(this._sockets);
    }

    /**
     *
     * @param socketId
     * @returns {null}
     */
    getSocketById(socketId) {
        return this._sockets[socketId] ? this._sockets[socketId] : null;
    }

    /**
     *
     * @returns {string[]}
     */
    getUsetList() {
        return Object.keys(this._socketsByUsers);
    }

    addUserToRoom(userId, room) {
        if (!this.roomsByUserId[userId]) {
            this.roomsByUserId[userId] = [];
        }
        if (this.roomsByUserId[userId].includes(room)) {
            this.roomsByUserId[userId].push(room);
        }
        if (!this.roomsByRoomId[room]) {
            this.roomsByRoomId[room] = [];
        }
        if (this.roomsByRoomId[room].includes(userId)) {
            this.roomsByRoomId[room].push(userId);
        }
        return this;
    }

    removeUserFromRoom(userId, room) {
        if (this.roomsByUserId[userId] && this.roomsByUserId[userId].includes(room)) {
            this.roomsByUserId[userId].splice(this.roomsByUserId[userId].indexOf(room), 1);
        }
        if (this.roomsByRoomId[room] && this.roomsByRoomId[room].includes(userId)) {
            this.roomsByRoomId[room].splice(this.roomsByRoomId[room].indexOf(userId), 1);
        }
        return this;
    }

    _removeFromRoomByUserId(userId) {
        if (this.roomsByUserId[userId] && this.roomsByUserId[userId].length > 0) {
            this.roomsByUserId[userId].forEach(room => {
                if (this.roomsByRoomId[room] && this.roomsByRoomId[room].includes(userId)) {
                    this.roomsByRoomId[room].splice(this.roomsByRoomId[room].indexOf(userId), 1);
                }
            });
            delete this.roomsByUserId[userId];
        }
    }

    _removeUserById(userId) {
        if (this._activeUsers.length > 0 && this._activeUsers.includes(userId)) {
            this._activeUsers.splice(this._activeUsers.indexOf(userId), 1);
        }
    }

    _removeSessionFromUser(userId) {
        if (this._sessionsByUsers[userId] && (!this._socketsByUsers[userId] || (this._socketsByUsers[userId] && this._socketsByUsers[userId].length === 0))) {
            delete this._sessionsByUsers[userId];
        }
    }

    _removeSocketById(socketId) {
        if (this._sockets[socketId]) {
            this._sockets[socketId].disconnect();
            delete this._sockets[socketId];
        }
    }

    _removeSocketFromUser(userId, socketId) {
        if (this._socketsByUsers[userId] && this._socketsByUsers[userId].length > 0 && this._socketsByUsers[userId].includes(socketId)) {
            this._socketsByUsers[userId].splice(this._socketsByUsers[userId].indexOf(socketId), 1);
            if (this._socketsByUsers[userId].length === 0) {
                delete this._socketsByUsers[userId];
            }
        }
    }
}

module.exports = ConnectionList;
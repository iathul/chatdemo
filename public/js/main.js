const chat        = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const { username, room } = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});

const socket = io();

//Join chatroom
socket.emit('joinRoom',{username,room})

socket.on('roomUsers',({room,users})=>{
    outPutRoomName(room);
    outPutUsers(users);
})

socket.on('message', message=>{
    console.log(message)
    outPutMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chat.addEventListener('submit',data=>{
    data.preventDefault();
    const msg = data.target.elements.msg.value;
    socket.emit('chatMsg',msg);

    data.target.elements.msg.value = '';
    data.target.elements.msg.focus();
})

function outPutMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

function outPutRoomName(room){
    roomName.innerHTML = room;
}

function outPutUsers(users){
    userList.innerHTML= `
        ${users.map(user=>`<li>${user.username}</li>`).join('')}`
}

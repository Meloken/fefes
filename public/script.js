const channelTypeSelect = document.createElement('select');
channelTypeSelect.className = 'input-text';
channelTypeSelect.innerHTML = `
  <option value="">Kanal türü seçin</option>
  <option value="voice">🔊 Sesli Kanal</option>
  <option value="text"># Metin Kanalı</option>
`;

/* Kanal oluşturma modalı */
function showCreateChannelModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  const title = document.createElement('h2');
  title.textContent = 'Yeni Kanal Oluştur';
  
  const form = document.createElement('form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const type = typeSelect.value;
    
    if (name && type && currentGroup) {
      socket.emit('createRoom', {
        groupId: currentGroup,
        roomName: name,
        roomType: type
      });
      document.body.removeChild(modal);
    } else if (!type) {
      typeSelect.style.borderColor = '#ff4444';
      typeSelect.focus();
    }
  };
  
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Kanal adını girin...';
  nameInput.className = 'input-text';
  nameInput.required = true;
  nameInput.maxLength = 32;
  
  const typeSelect = channelTypeSelect.cloneNode(true);
  typeSelect.required = true;
  
  // Reset error state on change
  typeSelect.addEventListener('change', () => {
    typeSelect.style.borderColor = '';
  });
  
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'modal-buttons';
  
  const createButton = document.createElement('button');
  createButton.type = 'submit';
  createButton.className = 'button primary';
  createButton.textContent = 'Oluştur';
  
  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'button';
  cancelButton.textContent = 'İptal';
  cancelButton.onclick = () => document.body.removeChild(modal);
  
  buttonContainer.appendChild(createButton);
  buttonContainer.appendChild(cancelButton);
  
  form.appendChild(nameInput);
  form.appendChild(typeSelect);
  form.appendChild(buttonContainer);
  
  modalContent.appendChild(title);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  
  document.body.appendChild(modal);
  nameInput.focus();
}

createChannelBtn.addEventListener('click', showCreateChannelModal);

let currentTextChannel = null;

/* createTextIcon => hash (#) */
function createTextIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("class", "channel-icon");
  svg.setAttribute("viewBox", "0 0 16 16");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z");

  svg.appendChild(path);
  return svg;
}

/* createVoiceIcon => speaker */
function createVoiceIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("class", "channel-icon");
  svg.setAttribute("viewBox", "0 0 16 16");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z");

  svg.appendChild(path);
  return svg;
}

/* joinTextChannel => metin kanalına giriş */
function joinTextChannel(groupId, channelId, channelName) {
  if (currentTextChannel === channelId) {
    return; // Zaten bu kanaldayız
  }

  // Önceki kanaldan ayrıl
  if (currentTextChannel) {
    socket.emit('leaveTextChannel', { 
      groupId: currentGroup,
      channelId: currentTextChannel 
    });
  }

  // Şimdilik sadece seçili olduğunu göster
  document.querySelectorAll('.channel-item').forEach(el => {
    el.classList.remove('selected');
    if (el.querySelector('span').textContent === channelName) {
      el.classList.add('selected');
    }
  });
  
  currentTextChannel = channelId;
  currentGroup = groupId;

  // UI'ı güncelle
  welcomeMessage.style.display = 'none';
  messageArea.style.display = 'flex';
  messagesContainer.innerHTML = '';

  // Kanala katıl ve mesajları al
  socket.emit('joinTextChannel', { groupId, channelId });
}

/* Mesaj Gönderme */
function sendMessage() {
  const content = messageInput.value.trim();
  if (!content || !currentTextChannel || !currentGroup) return;

  socket.emit('sendMessage', {
    groupId: currentGroup,
    channelId: currentTextChannel,
    content
  });

  messageInput.value = '';
}

sendMessageBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

/* Mesaj Alma */
socket.on('message', (message) => {
  if (message.channelId !== currentTextChannel) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';

  const content = document.createElement('div');
  content.className = 'message-content';

  const header = document.createElement('div');
  header.className = 'message-header';

  const username = document.createElement('span');
  username.className = 'message-username';
  username.textContent = message.username;

  const time = document.createElement('span');
  time.className = 'message-time';
  time.textContent = new Date(message.timestamp).toLocaleTimeString();

  const text = document.createElement('div');
  text.className = 'message-text';
  text.textContent = message.content;

  header.appendChild(username);
  header.appendChild(time);
  content.appendChild(header);
  content.appendChild(text);

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);

  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

/* Kanal Mesaj Geçmişi */
socket.on('messageHistory', (messages) => {
  messagesContainer.innerHTML = '';
  messages.forEach(msg => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';

    const content = document.createElement('div');
    content.className = 'message-content';

    const header = document.createElement('div');
    header.className = 'message-header';

    const username = document.createElement('span');
    username.className = 'message-username';
    username.textContent = msg.username;

    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = new Date(msg.timestamp).toLocaleTimeString();

    const text = document.createElement('div');
    text.className = 'message-text';
    text.textContent = msg.content;

    header.appendChild(username);
    header.appendChild(time);
    content.appendChild(header);
    content.appendChild(text);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    messagesContainer.appendChild(messageDiv);
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

/* roomsList => kanallar */
socket.on('roomsList', (roomsArray) => {
  roomListDiv.innerHTML = '';
  roomsArray.forEach(roomObj => {
    const roomItem = document.createElement('div');
    roomItem.className = 'channel-item';

    // Add type-specific class for styling
    roomItem.classList.add(`channel-${roomObj.type}`);
    
    const channelHeader = document.createElement('div');
    channelHeader.className = 'channel-header';

    const icon = roomObj.type === 'voice' ? createVoiceIcon() : createTextIcon();
    const textSpan = document.createElement('span');
    textSpan.textContent = roomObj.name;
    textSpan.className = 'channel-name';

    channelHeader.appendChild(icon);
    channelHeader.appendChild(textSpan);

    const channelUsers = document.createElement('div');
    channelUsers.className = 'channel-users';
    channelUsers.textContent = `${roomObj.userCount} kullanıcı`;

    roomItem.appendChild(channelHeader);
    roomItem.appendChild(channelUsers);

    // Sol tık => kanala gir
    roomItem.addEventListener('click', () => {
      if (roomObj.type === 'text') {
        // Metin kanalı için farklı işlem
        joinTextChannel(currentGroup, roomObj.id, roomObj.name);
        return;
      }
      
      if (currentRoom === roomObj.id && currentGroup === selectedGroup) {
        console.log("Zaten bu kanaldasınız, işlem yapılmadı.");
        return;
      }
      
      // Sesli kanal için mevcut işlem devam eder
      joinVoiceChannel(currentGroup, roomObj.id);
    });

    roomListDiv.appendChild(roomItem);
  });
});
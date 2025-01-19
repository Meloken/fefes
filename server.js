socket.on('createRoom', async ({ groupId, roomName }) => {
  try {
    if (!groups[groupId]) return;
    if (!roomName || !roomType) return;
    const trimmed = roomName.trim();
    if (!trimmed) return;

    const groupDoc = await Group.findOne({ groupId });
    if (!groupDoc) return;

    const roomId = uuidv4();
    const newChannel = new Channel({
      channelId: roomId,
      name: trimmed,
      type: roomType,
      type: roomType,
      type: roomType,
      group: groupDoc._id,
      users: []
    });
    await newChannel.save();

    groups[groupId].rooms[roomId] = {
      name: trimmed,
      type: roomType,
      type: roomType,
      type: roomType,
      users: []
    };
    console.log(`Yeni ${roomType} kanalı: group=${groupId}, room=${roomId}, name=${trimmed}`);

    broadcastRoomsListToGroup(groupId);
    broadcastAllChannelsData(groupId);
  } catch (err) {
    console.error("createRoom hata:", err);
  }
});
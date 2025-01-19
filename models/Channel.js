@@ .. @@
 const ChannelSchema = new mongoose.Schema({
   channelId: { type: String, required: true, unique: true },
   name: { type: String, required: true },
+  type: { type: String, enum: ['text', 'voice'], required: true },
   group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
   // Kanaldaki kullanıcılar (isteğe bağlı)
   users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
 });
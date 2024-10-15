import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomId: String,
  currentTrack: {
    id: String,
    title: String,
    subtitle: String,
    image: String,
    streamUrl: String,
  },
  isPlaying: Boolean,
  currentTime: Number,
});

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);

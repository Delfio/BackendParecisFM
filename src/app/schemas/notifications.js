import mongoose from'mongoose';

const NotificationsSchema = new mongoose.Schema({
  content:{
    type: String,
    required: true,
  },
  hora: {
    type: Date,
    required: true,
  },
  radio: {
    type: Number,
    required: true,
  },
},
  {
    timestamps: true
  }
)

export default mongoose.model('Notifications', NotificationsSchema)
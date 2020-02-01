import mongoose from'mongoose';

const NotificationsSchema = new mongoose.Schema({
  content:{
    type: String,
    required: true,
  },
  hora: {
    type: String,
    required: true,
  },
  programa: {
    type: Number,
    required: true
  },
  dia: {
    type: String,
    required: true
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
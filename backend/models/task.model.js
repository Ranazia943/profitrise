import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    type: { 
      type: String, 
      enum: ['website visit', 'youtube video'], 
      required: true 
    },
    url: { type: String, required: true },
    price: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'completed'], 
      default: 'pending' 
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;

import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true }, // Plan reference
    type: { type: String, required: true },  // 'website visit' or 'youtube video'
    url: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;

import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: [
        'Start',
        'Basic',
        'Gold',
        'Platinum',
        'Diamond',
      ], // Only these predefined names are allowed
    },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    dailyProfit: { type: Number, required: true },
    totalProfit: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const Plan = mongoose.model('Plan', planSchema);

export default Plan;

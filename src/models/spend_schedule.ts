import mongoose from 'mongoose';

const SpendScheduleSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

export default mongoose.model('SpendSchedules', SpendScheduleSchema);

import mongoose from 'mongoose';

const SpendSchema = new mongoose.Schema(
  {
    // airtime, data, cable-tv
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['failed', 'pending', 'success'],
    },
    metadata: {
      customer_number: {
        type: String,
      },
      service_provider: {
        type: String,
      },
      token: {
        type: String,
      },
      units: {
        type: String,
      },
    },
    third_party_response: {
      type: mongoose.Schema.Types.Mixed,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Spends', SpendSchema);

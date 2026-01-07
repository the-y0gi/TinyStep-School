import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['general', 'fee', 'attendance', 'event'],
      required: true
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipients: {
      allParents: {
        type: Boolean,
        default: false
      },
      specificParents: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      allTeachers: {
        type: Boolean,
        default: false
      },
      classIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Class'
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Notification', notificationSchema);

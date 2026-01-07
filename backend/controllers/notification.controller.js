import Notification from "../models/notification.model.js";
import { sendNotificationEmail } from "../utils/mailer.js";
import User from "../models/user.model.js";
import Class from "../models/class.model.js";

// controllers/notificationController.js
export const createNotification = async (req, res) => {
  try {
    const { title, message, target } = req.body;

    // Validate target type
    if (!["all", "class", "individual"].includes(target.type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid target type",
      });
    }

    const notification = new Notification({
      title,
      message,
      target,
      sentBy: req.admin._id,
    });

    await notification.save();

    // Add logic to actually send notifications (SMS/Email) here
    // ...

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create notification",
      error: err.message,
    });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { title, message, type, recipients } = req.body;

    // 1. Save the notification entry first
    const notification = new Notification({
      title,
      message,
      type,
      recipients,
      sentBy: req.admin._id,
    });

    // 2. Prepare recipient emails
    let targetEmails = [];

    if (recipients.allParents) {
      const parents = await User.find({ role: "parent" });
      targetEmails.push(...parents.map((p) => p.email));
    }

    if (recipients.specificParents?.length > 0) {
      const specific = await User.find({
        _id: { $in: recipients.specificParents },
      });
      targetEmails.push(...specific.map((p) => p.email));
    }

    if (recipients.classIds?.length > 0) {
      const classes = await Class.find({
        _id: { $in: recipients.classIds },
      }).populate({
        path: "students",
        populate: { path: "parent", model: "User" },
      });

      for (const cls of classes) {
        for (const student of cls.students) {
          if (student?.parent?.email) {
            targetEmails.push(student.parent.email);
          }
        }
      }
    }

    if (recipients.allTeachers) {
      const teachers = await User.find({ role: "teacher" });
      targetEmails.push(...teachers.map((t) => t.email));
    }

    // 3. Deduplicate
    targetEmails = [...new Set(targetEmails)];

    // 4. Send emails (clean UI version)
    for (const email of targetEmails) {
      try {
        await sendNotificationEmail({
          to: email,
          title,
          message,
          type,
        });
      } catch (err) {
        console.error(`❌ Email failed to: ${email}`, err.message);
      }
    }

    // 5. Save in DB
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "✅ Notification sent and saved successfully!",
    });
  } catch (error) {
    console.error("Notification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending notifications.",
    });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notificationsRaw = await Notification.find({ sentBy: req.admin._id })
      .sort({ createdAt: -1 })
      .populate("sentBy", "role personalInfo.name")
      .limit(50);

    const notifications = notificationsRaw.map((n) => ({
      _id: n._id,
      title: n.title,
      message: n.message,
      type: n.type,
      recipients: n.recipients,
      createdAt: n.createdAt,
      sentBy: n.sentBy
        ? {
            _id: n.sentBy._id,
            role: n.sentBy.role,
            name: n.sentBy.personalInfo?.name || "Unknown",
          }
        : {
            _id: null,
            role: "deleted",
            name: "Deleted Admin",
          },
    }));

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

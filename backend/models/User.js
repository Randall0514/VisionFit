const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  faceShape: { type: String, enum: ['round', 'heart', 'diamond', 'oval', 'square', ''], default: '' },
  prescription: {
    sphere: { type: String, default: '' },
    cylinder: { type: String, default: '' },
    axis: { type: String, default: '' },
    add: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
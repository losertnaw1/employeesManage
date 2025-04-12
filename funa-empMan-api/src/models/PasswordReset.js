const mongoose = require('mongoose');
const crypto = require('crypto');

const passwordResetSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  token_hash: {
    type: String,
    required: true
  },
  expires_at: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  used: {
    type: Boolean,
    default: false
  }
});

// Index to automatically remove expired tokens
passwordResetSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

// Static method to generate a reset token
passwordResetSchema.statics.generateToken = async function(adminId) {
  // Generate a random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Hash the token for storage
  const token_hash = crypto.createHash('sha256').update(token).digest('hex');
  
  // Calculate expiry (15 minutes from now)
  const expires_at = new Date();
  expires_at.setMinutes(expires_at.getMinutes() + 15);
  
  // Create and save the reset token
  const resetToken = new this({
    admin_id: adminId,
    token: token,
    token_hash: token_hash,
    expires_at: expires_at
  });
  
  await resetToken.save();
  
  // Return the unhashed token to be sent to the user
  return token;
};

// Static method to verify a token
passwordResetSchema.statics.verifyToken = async function(token, adminId) {
  // Hash the token for comparison
  const token_hash = crypto.createHash('sha256').update(token).digest('hex');
  
  // Find the token
  const resetToken = await this.findOne({
    token_hash: token_hash,
    admin_id: adminId,
    expires_at: { $gt: new Date() },
    used: false
  });
  
  return resetToken;
};

// Mark token as used
passwordResetSchema.methods.markAsUsed = async function() {
  this.used = true;
  return this.save();
};

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

module.exports = PasswordReset;

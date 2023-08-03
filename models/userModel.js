const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
  {
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Region',
      default: null
    },
    username: {
      type: String,
      default: 'anonymous',
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [
        function () {
          // Only require passwordConfirm when creating a new user or changing the password
          return this.isNew || this.isModified('password')
        },
        'Please confirm your password'
      ],
      validate: {
        //   This only works on CREATE and SAVE!!!
        validator: function (pwdConfirm) {
          return pwdConfirm === this.password
        },
        message: 'Passwords are not the same'
      }
    },
    electricityUsage: {
      type: Number,
      default: 0
    },
    role: {
      type: String,
      enum: ['consumer', 'admin'],
      default: 'consumer'
    },
    isConnected: {
      type: Boolean,
      default: false
    },
    userStatus: {
      type: String,
      default: 'disabled',
      enum: ['disabled', 'active']
    },
    apiKey: String
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.isNew) return next()

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // Don't set passwordConfirm to undefined, just mark it as confirmed
  this.passwordConfirm = undefined

  // This is to indicate that password has been intially confirmed
  this.passwordConfirmed = true
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User

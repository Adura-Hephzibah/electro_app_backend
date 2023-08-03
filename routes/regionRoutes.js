const express = require('express')
const router = express.Router()
const {
  getRegion,
  getUserRegion,
  setRegion,
  updateRegion,
  deleteRegion,
  allocateElectricity,
  allocateUserToRegion
} = require('../controllers/adminController')
const { protect, restrictTo } = require('../middlewares/authMiddleware')

router.get('/region', protect, getUserRegion) //
router.get('/regions/:id', protect, getRegion) //
router.post('/regions', protect, restrictTo('admin'), setRegion)
router.put('/regions/:id', protect, restrictTo('admin'), updateRegion)
router.delete('/regions/:id', protect, restrictTo('admin'), deleteRegion)

router.post('/regions/allocate-user', protect, allocateUserToRegion) //
router.post('/electricity', protect, restrictTo('admin'), allocateElectricity)

module.exports = router

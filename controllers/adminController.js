const { asyncHandler } = require('../utils/asyncHandler')
const AppError = require('../utils/appError')
const User = require('../models/userModel')
const Region = require('../models/regionModel')
const Request = require('../models/requestModel')

// REGION OPERATIONS
// @desc   Get user region
// @route  GET /api/v1/auth/region
// @access Private
const getUserRegion = asyncHandler(async (req, res) => {
  // const regions = await Region.find({ users: req.user.id });
  const userId = req.body.userId
  const user = await User.findById(userId).populate('region')
  const { region } = user
  res.status(200).json({
    status: 'success',
    data: {
      regions: region
    }
  })
})

// @desc   update user
// @route  PUT /api/v1/auth/users/:id
// @access Private
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  const updatedStatus = req.body?.status

  console.log('reqBody', req.body)

  if (!user) {
    return next(new AppError('User not found', 400))
  }

  // Update the user details
  user.userStatus = updatedStatus

  // Save the updated user
  await user.save()

  res.status(200).json({
    status: 'Success',
    message:
      updatedStatus == 'active'
        ? "User's account is now enabled."
        : `User's account successfuly disabled.`,
    data: { ...user }
  })
})

// @desc   Get a region details
// @route  GET /api/v1/auth/regions/:id
// @access Private
const getRegion = asyncHandler(async (req, res) => {
  const region = await Region.findById(req.params.id)

  res.status(200).json({
    status: 'success',
    data: {
      region
    }
  })
})

// @desc   Get all region details
// @route  GET /api/v1/auth/regions/
// @access Private
const getAllRegions = asyncHandler(async (req, res) => {
  const regions = await Region.find().populate("users");
  res.status(200).json({
    status: 'success',
    regions
  })
})

// @desc   Create Region
// @route  POST /api/v1/auth/regions
// @access Private
const setRegion = asyncHandler(async (req, res, next) => {
  const { name, population, electricityUsage } = req.body

  // validation
  if (!name) {
    throw new AppError('Please add all fields!', 400)
  }

  // Check if region exists
  const regionExists = await Region.findOne({ name })

  if (regionExists) {
    throw new AppError('Region already exits!', 400)
  }

  // Create region
  const newRegion = await Region.create({
    name,
    population,
    electricityUsage
  })

  if (newRegion) {
    res.status(201).json({
      status: 'Success',
      message: 'Region Created successfully',
      data: {
        region: newRegion
      }
    })
  } else {
    return next(new AppError('Invalid region data', 400))
  }
})

//

//

// @desc   update regions
// @route  PUT /api/v1/auth/regions/:id
// @access Private
const updateRegion = asyncHandler(async (req, res, next) => {
  const region = await Region.findById(req.params.id)

  if (!region) {
    return next(new AppError('Region not found', 400))
  }

  const updatedRegion = await Region.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )
  const { name, population, electricityUsage, totalPower } = updatedRegion

  res.status(200).json({
    status: 'Success',
    message: 'Region edited edited',
    data: {
      region: { name, population, electricityUsage, totalPower }
    }
  })
})

// @desc   Delete region
// @route  DELETE /api/v1/auth/regions/:id
// @access Private
const deleteRegion = asyncHandler(async (req, res, next) => {
  const region = await Region.findById(req.params.id)

  if (!region) {
    return next(new AppError('Region not found', 400))
  }

  await region.deleteOne()

  res.status(200).json({
    status: 'Success',
    message: 'Region deleted',
    data: null
  })
})

// REQUEST OPERATIONS
//
// @desc   Get a request details
// @route  GET /api/v1/auth/requests/:id
// @access Private
const getRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id)

  res.status(200).json({
    status: 'success',
    data: {
      request
    }
  })
})

// @desc   Get all requests details
// @route  GET /api/v1/auth/request/
// @access Private
const getAllRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find().populate('userId')

  res.status(200).json({
    status: 'success',
    requests
  })
})

// @desc   Create Request
// @route  POST /api/v1/auth/requests
// @access Private
const setRequest = asyncHandler(async (req, res, next) => {
  const { dateOfRequest, requestStatus, message, userId } = req.body

  console.log('reqBody', req.body)

  // validation
  if (!dateOfRequest || !message) {
    throw new AppError('Please add all fields!', 400)
  }

  // Create region
  const newRequest = await Request.create({
    dateOfRequest,
    requestStatus,
    message,
    userId
  })

  if (newRequest) {
    res.status(201).json({
      status: 'Success',
      message: 'Request placed successfully',
      data: {
        request: newRequest
      }
    })
  } else {
    return next(new AppError('Invalid request data', 400))
  }
})

// @desc   update request
// @route  PUT /api/v1/auth/requests/:id
// @access Private
const updateRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findById(req.params.id)
  const updatedStatus = req.body?.status

  if (!request) {
    return next(new AppError('Request not found', 400))
  }

  // Update the request details
  request.requestStatus = updatedStatus

  // Save the updated request
  await request.save()

  res.status(200).json({
    status: 'Success',
    message: 'Request successfully updated...!!!',
    data: { ...request }
  })
})

// @desc   Delete request
// @route  DELETE /api/v1/auth/requests/:id
// @access Private
const deleteRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findById(req.params.id)

  if (!request) {
    return next(new AppError('Request not found', 400))
  }

  await request.deleteOne()

  res.status(200).json({
    status: 'Success',
    message: 'Region deleted',
    data: null
  })
})

// @desc   Allocate electricity
// @route  POST /api/v1/auth/electricity
// @access Private
const allocateElectricity = asyncHandler(async (req, res) => {
  const { electricAmount, regionId } = req.body

  try {
    // Find the region by ID
    const region = await Region.findById(regionId)

    // Allocate electricity and increase electricityUsage
    region.totalPower += Number(electricAmount)

    // Save the updated user document
    await region.save()

    res.status(200).json({
      status: 'Success',
      message: 'Electricity allocated successfully.',
      data: null
    })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
})

const allocateUserToRegion = asyncHandler(async (req, res) => {
  const { userId, regionId } = req.body

  try {
    // Check if the user and region exist
    const user = await User.findById(userId)
    const region = await Region.findById(regionId)

    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    if (!region) {
      return res.status(404).json({ error: 'Region not found.' })
    }

    // Check if the user is already assigned to the region
    if (user.region && user.region.toString() === regionId) {
      return res
        .status(400)
        .json({ error: 'User is already assigned to the region.' })
    }

    // If the user is not assigned to the region, update the user and region details
    const prevRegionId = user.region // Keep track of the previous region ID for decrementing its population
    user.region = regionId
    await user.save()

    // Increment the new region's population
    region.population += 1
    await region.save()

    // If the user was previously assigned to a region, decrement the old region's population
    if (prevRegionId) {
      const prevRegion = await Region.findById(prevRegionId)
      if (prevRegion) {
        prevRegion.population -= 1
        await prevRegion.save()
      }
    }

    res
      .status(200)
      .json({ message: 'User assigned to the region successfully.' })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' })
  }
})

module.exports = {
  getRegion,
  getUserRegion,
  updateUser,
  getAllRegions,
  setRegion,
  updateRegion,
  deleteRegion,
  getRequest,
  getAllRequests,
  setRequest,
  updateRequest,
  deleteRequest,
  allocateElectricity,
  allocateUserToRegion
}

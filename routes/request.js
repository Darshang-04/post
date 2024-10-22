const express = require('express')
const route = express.Router()
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const POST = mongoose.model("POST")
const USER = mongoose.model("USER")
const Connectionrequest = mongoose.model("Connectionrequest")

async function sendConnectionRequest(senderId, receiverId) {
  const sender = await USER.findById(senderId)
  const receiver = await USER.findById(receiverId)
  if (!sender || !receiver) {
    throw new Error('USER not found')
  }
  const request = new Connectionrequest({
    sender: senderId,
    receiver: receiverId
  })
  
  // await request.save()

}

async function acceptConnectionRequest(requestId) {
  const request = await Connectionrequest.findById(requestId)
  if (!request) {
    throw new Error('Request not found')
  }
  if (request.status !== 'pending') {
    throw new Error('Request is not pending')
  }
  request.status = 'accepted'
  await request.save()
  const sender = await USER.findById(request.sender)
  const receiver = await USER.findById(request.receiver)
  sender.sentRequest.push(request._id)
  receiver.receivedRequest.push(request._id)
  await sender.save()
  await receiver.save()
}

async function rejectConnectionRequest(requestId) {
  const request = await Connectionrequest.findById(requestId)
  if (!request) {
    throw new Error('Request not found')
  }
  if (request.status !== 'pending') {
    throw new Error('Request is not pending')
  }
  request.status = 'rejected'
  await request.save()
}

module.exports = { sendConnectionRequest, acceptConnectionRequest, rejectConnectionRequest }
//importing the required files
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//user registration
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "sample public id",
      url: "profilePictureUrl",
    },
  });

  const token = user.getJWTToken();

  res.status(201).json({
    success: true,
    token,
  });
});

//login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  //checking if the use has entered both id and password
  if (!email || !password) {
    return next(new ErrorHandler("please enter email and password", 400));
  }

  //searching for the user
  const user = await User.findOne({ email }).select("+password");

  //if the user is not found
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = user.comparePassword(password);
  //if password is not matched
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

//   const token = user.getJWTToken();

//   res.status(200).json({
//     success: true,
//     token,
//   });

  sendToken(user, 200, res);
});

//logout user
exports.logoutUser = catchAsyncErrors(async(req, res, next)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out",
    });
});

//generating resetPassword token
exports.forgotPassword = catchAsyncErrors(async(req, res, next)=>{
  const user = await User.findOneAndUpdate({ email: req.body.email });
  if(!user){
    return next(new ErrorHandler("User not found", 404));
  }

  //get reset password token
  const resetToken = user.getResetPasswordToke();
  await user.save({ validateBeforeSave:false });

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is:- \n\n ${resetPasswordUrl}
  \n\n If not requested, please ignore.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce password recovery`,
      message,
    });

    res.status(200).json({
      success:true,
      message: `Email sent to ${user.email} sucessfully`,
    });
  } 
  catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save({ validateBeforeSave: false });
    return nect(new Errorhandler(error.message, 500));
  }
});


// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//get user details
exports.getUserDetails = catchAsyncErrors(async(req, res, next)=>{
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    success: true,
    user,
  });
});

//update user password
exports.updatePassword = catchAsyncErrors(async(req, res, next)=>{
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if(!isPasswordMatched){
    return next(new ErrorHandler("old password is incorrect, 400"));
  }
  if(req.body.newPassword != req.body.confirmPassword){
    return next(new ErrorHandler("password does not match, 400"));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//update user profile --admin
exports.updateUserProfile = catchAsyncErrors( async(req, res, next)=>{
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  //add cloudinary later

  const user = await User.findByIdandUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});


//update user role --admin
exports.updateUserRole = catchAsyncErrors( async(req, res, next)=>{
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  } 

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//get all users --admin
exports.getAllUsers = catchAsyncErrors( async(req, res, next)=>{
  const users = await Users.find();

  res.status(200).json({
    success:true,
    users,
  });
});

//get user by id --admin
exports.getUsers = catchAsyncErrors(async (req, res, next) => {
  const user = await Users.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`user does not exist with user id: ${req.params.id}`));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//delete user --admin
exports.deleteUse = catchAsyncErrors( async(req, res, next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`user does not exist with id:${req.params.id}`));
  }

  await user.remove();

  res.status(200).json({
    success: true,
  })
});

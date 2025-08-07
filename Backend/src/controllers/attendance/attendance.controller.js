import asyncHandler from "../../helpers/asyncHandler.js";
import ErrorConfig from "../../helpers/errorConfig.js";
import ResponseConfig from "../../helpers/responseConfig.js";
import prisma from "../../lib/dbConnection.js";

const createAttendance = asyncHandler(async (req, res) => {
  const { studentId, classId, status } = req.body;
  if (!studentId || !classId || !status) {
    throw new ErrorConfig(
      400,
      "Missing required fields: studentId, classId, status"
    );
  }
  const attendance = await prisma.attendance.create({
    data: {
      studentId,
      classId,
      status,
    },
  });
  if (!attendance)
    return next(new ErrorConfig(500, "Failed to create attendance record"));

  res
    .status(201)
    .json(
      new ResponseConfig(201, "Attendance created successfully", attendance)
    );
});

// get all attendace records
const getAllAttendance = asyncHandler(async (req, res) => {
  const attendanceRecords = await prisma.attendance.findMany({
    include: {
      student: true,
      class: true,
    },
  });
  if (!attendanceRecords || attendanceRecords.length === 0)
    return res
      .status(404)
      .json(new ResponseConfig(404, "No attendance records found"));

  res
    .status(200)
    .json(
      new ResponseConfig(
        200,
        "Attendance records retrieved successfully",
        attendanceRecords
      )
    );
});

// delete attendance record
const deleteAttendance = asyncHandler(async (req, res) => {
  const { attendanceId } = req.params;
  const findAttendance = await prisma.attendance.findUnique({
    where: { id: attendanceId },
  });
  if (!findAttendance)
    return next(new ErrorConfig(404, "Attendance record not found"));
  const deletedAttendance = await prisma.attendance.delete({
    where: { id: attendanceId },
  });
  if (!deletedAttendance)
    return next(new ErrorConfig(500, "Failed to delete attendance record"));
  res.json(
    new ResponseConfig(
      200,
      "Attendance record deleted successfully",
      deletedAttendance
    )
  );
});

// update attendance record

const updateAttendance = asyncHandler(async (req, res) => {
  const { attendanceId } = req.params;
  const findAttendance = await prisma.attendance.findUnique({
    where: { id: attendanceId },
  });
  if (!findAttendance)
    return next(new ErrorConfig(404, "Attendance record not found"));
  const data = req.body;
  const updatedAttendance = await prisma.attendance.update({
    where: { id: attendanceId },
    data,
  });
  if (!updatedAttendance)
    return next(new ErrorConfig(500, "Failed to update attendance record"));
  res.json(
    new ResponseConfig(
      200,
      "Attendance record updated successfully",
      updatedAttendance
    )
  );
});

const getAttendanceById = asyncHandler(async (req, res) => {
  const { attendanceId } = req.params;
  const attendance = await prisma.attendance.findUnique({
    where: { id: attendanceId },
    include: {
      student: true,
      class: true,
    },
  });
  if (!attendance)
    return next(new ErrorConfig(404, "Attendance record not found"));
  res.json(
    new ResponseConfig(
      200,
      "Attendance record retrieved successfully",
      attendance
    )
  );
});
export {
  createAttendance,
  getAllAttendance,
  deleteAttendance,
  updateAttendance,
  getAttendanceById,
};

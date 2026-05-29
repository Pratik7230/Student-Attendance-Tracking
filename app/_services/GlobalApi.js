const { default: axios } = require('axios');

// 🎓 Grade Management
const GetAllGrades = () => axios.get('/api/grade');
const GetAllGradesForSubject = (selectedSubjectId) =>
  axios.get(`/api/grade?selectedSubjectId=${selectedSubjectId}`);

// 🧑‍🎓 Student Management
const CreateNewStudent = (data) => axios.post('/api/student', data);
const GetAllStudents = () => axios.get('/api/student');
const DeleteStudentRecord = (id) => axios.delete(`/api/student?id=${id}`);

const CreateNewTeacher = (data) => axios.post('/api/teacher', data);
const GetAllTeachers = () => axios.get('/api/teacher');
const DeleteTeacherRecord = (id) => axios.delete(`/api/teacher?id=${id}`);

// 📅 Attendance Management
const GetAttendanceList = (gradeId, month, selectedSubjectId) =>
  axios.get(
    `/api/attendance?gradeId=${gradeId}&month=${month}&selectedSubjectId=${selectedSubjectId}`
  );

const GetStudentAttendanceList = (studentUserId, month, selectedSubjectId) =>
  axios.get(
    `/api/attendance?studentUserId=${studentUserId}&month=${month}&selectedSubjectId=${selectedSubjectId}`
  );

const GenerateReport = (gradeId, from, to, selectedSubjectId) =>
  axios.get(
    `/api/generate-report?gradeId=${gradeId}&from=${from}&to=${to}&selectedSubjectId=${selectedSubjectId}`,
    { responseType: 'blob' }
  );

const MarkAttendance = (data) => axios.post('/api/attendance', data);
const MarkAbsent = (studentId, day, date, subjectId, gradeId) =>
  axios.delete(
    `/api/attendance?studentId=${studentId}&day=${day}&date=${date}&subjectId=${subjectId}&gradeId=${gradeId}`
  );

const TotalPresentCountByDay = (date, gradeId, selectedSubjectId) =>
  axios.get(
    `/api/dashboard?date=${date}&gradeId=${gradeId}&selectedSubjectId=${selectedSubjectId}`
  );

// 🔐 Authentication & Password Reset
const Login = (user) => axios.post('/api/login', user);
const GenerateOTP = ({ email }) =>
  axios.post('/api/reset-password-generate-otp', { email });
const ValidateOTP = ({ email, otp }) =>
  axios.post('/api/reset-password-validate-otp', { email, otp });
const ResetPasswordWithOTP = ({ email, otp, password }) =>
  axios.post('/api/reset-password', { email, otp, password });
const ChangePassword = ({ currentPassword, newPassword }) =>
  axios.post('/api/change-password', { currentPassword, newPassword });

const UpdateUserRole = (id, role) => axios.put(`/api/user?id=${id}`, { role });
const GetAllSubjects = () => axios.get('/api/subjects');
const GetTeacherSubjects = (userId, teacher_email) =>
  axios.get(
    `/api/teacher_subjects?userId=${userId}&teacher_email=${teacher_email}`
  );
const UpdateTeacherSubjects = (teacherUserId, selectedSubjects) =>
  axios.put(
    `/api/teacher_subjects?teacherUserId=${teacherUserId}`,
    selectedSubjects
  );
const GetStudentSubjects = (userId) =>
  axios.get(`/api/student_subjects?studentUserId=${userId}`);

const GetUsers = () => axios.get('/api/user');
const AddUser = (data) => axios.post('/api/user', data);
const DeleteUser = (id) => axios.delete(`/api/user?id=${id}`);

export default {
  GetAllGrades,
  CreateNewStudent,
  GetAllStudents,
  DeleteStudentRecord,
  GetAttendanceList,
  GetStudentAttendanceList,
  MarkAttendance,
  MarkAbsent,
  TotalPresentCountByDay,
  Login,
  GenerateOTP,
  ValidateOTP,
  ResetPasswordWithOTP,
  ChangePassword,
  GetUsers,
  AddUser,
  DeleteUser,
  UpdateUserRole,
  GetAllSubjects,
  GenerateReport,
  CreateNewTeacher,
  GetAllTeachers,
  DeleteTeacherRecord,
  GetTeacherSubjects,
  GetAllGradesForSubject,
  GetStudentSubjects,
  UpdateTeacherSubjects,
};

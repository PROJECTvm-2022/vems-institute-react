import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import { CookieStorage } from 'cookie-storage';
import rest from '@feathersjs/rest-client';
import Axios from 'axios';
import services from './services.json';

export const authCookieName = 'ticket';

/**
 * CookieStorage
 * @type {CookieStorage}
 */
export const cookieStorage = new CookieStorage();

const restClient = rest(process.env.baseUrl);
// const restClient = rest('http://localhost:3030');

/**
 * Feathers application
 * @type {createApplication.Application<any>}
 */
const restApp = feathers();

restApp.configure(restClient.axios(Axios));

restApp.configure(
    auth({
        path: services.authentication,
        // cookie: process.env.NEXT_COOKIE_NAME,
        cookie: authCookieName,
        // storageKey: process.env.NEXT_COOKIE_NAME,
        storageKey: authCookieName,
        storage: cookieStorage,
    }),
);

export default restApp;

export const UILanguagesService = restApp.service(services['ui-languages']);
export const UIIconsService = restApp.service(services['ui-icons']);
export const UIMenuService = restApp.service(services['ui-menu']);

export const logoUploadService = restApp.service(services['upload']);

export const uploadService = restApp.service(services.upload);

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('uri[]', file);
    return uploadService.create(formData);
};

export const CreateUser = restApp.service(services['users']);
export const SignUpUser = restApp.service(services['signUp']);
export const CourseService = restApp.service(services['courses']);
export const CoursesService = restApp.service(services['courses']);
export const StudentSeatService = restApp.service(services['student-seat']);
export const InstituteCoursesService = restApp.service(services['institute_courses']);
export const SpecializationService = restApp.service(services['specialization']);
export const SemestersService = restApp.service(services.semesters);
export const InstituteService = restApp.service(services['institutes']);
export const UserInstituteAccessService = restApp.service(services['userInstituteAccess']);
export const ForgetPasswordService = restApp.service(services['forgetPassword']);
export const VerifyEmailService = restApp.service(services['verifyEmail']);
export const GoogleLoginService = restApp.service(services['googleLogin']);
export const SubjectTeacherService = restApp.service(services['teacher-subject']);
export const TeacherStudentService = restApp.service(services['user-institute-access']);
export const StudentSubjectService = restApp.service(services['student-subject-assign']);
export const UnitService = restApp.service(services['units']);
export const QuestionService = restApp.service(services['questions']);
export const AnswerService = restApp.service(services['answers']);
export const ChapterService = restApp.service(services['chapters']);
export const VideoLectureService = restApp.service(services['video-lecture']);
export const BatchVideoService = restApp.service(services['institute-batch-video']);
export const NextVideosService = restApp.service(services['next-videos']);
export const CommentsService = restApp.service(services.comments);
export const TimetableService = restApp.service(services.timetable);
export const teacherSlotService = restApp.service(services.teacherSlot);
export const SyllabusService = restApp.service(services.syllabus);
export const TimetableClassService = restApp.service(services['timetable-class']);
export const UserInstituteSubjectService = restApp.service(services['user-institute-subject']);
export const BatchService = restApp.service(services['batch']);
export const StatesService = restApp.service(services['states']);
export const CitiesService = restApp.service(services['cities']);
export const SemesterService = restApp.service(services['semesters']);
export const VerifyOtpServiceForForgotPassword = restApp.service(services['verifyOtp']);
export const ResetPasswordService = restApp.service(services['resetPassword']);
export const allAttendanceService = restApp.service(services['allAttendance']);
export const startEndClassService = restApp.service(services['startAndEndClass']);
export const allStudentFromAClassService = restApp.service(services['student-of-batch']);
export const takeAttendanceService = restApp.service(services['attendance']);
export const StudentOfBatchService = restApp.service(services['student-of-batch']);
export const SubjectsService = restApp.service(services['subjects']);
export const InstituteCourse = restApp.service(services['institute-course']);
export const UserService = restApp.service(services['users']);
export const TeacherSubjectService = restApp.service(services['teacher-subject']);
export const TeacherSlotService = restApp.service(services['teacher-slot']);
export const SyllabusesService = restApp.service(services['syllabuses']);
export const MessageService = restApp.service(services['message']);
export const ScheduledLiveClassService = restApp.service(services['scheduled-live-class']);
export const LiveClassService = restApp.service(services['live-class']);
export const GenerateSignatureService = restApp.service(services['generate-signature']);
export const ExamService = restApp.service(services['exam']);
export const AssignmentService = restApp.service(services['assignment']);
export const StudentAssignmentService = restApp.service(services['student-assignment']);
export const StudentExamService = restApp.service(services['studentExam']);
export const StudentExamResultService = restApp.service(services['studentExamResult']);
export const ExamReportService = restApp.service(services['exam-report']);
export const InstitutionDashBoardService = restApp.service(services['institute-dashboard']);
export const StudentProfileService = restApp.service(services['studentProfile']);
export const QuestionsService = restApp.service(services.questions);
export const ChaptersService = restApp.service(services['chapters']);
export const UnitsService = restApp.service(services['units']);
export const TopicsService = restApp.service(services['topics']);
export const TransactionService = restApp.service(services['transaction']);
export const StudentDashBoardService = restApp.service(services['student-profile']);
export const TeacherDashBoardService = restApp.service(services['teacherDashboard']);
export const StudentInLiveClassService = restApp.service(services['studentInLiveClass']);
export const PendingOrEndedClassService = restApp.service(services['pendingData']);
export const TeacherVideoService = restApp.service(services['teacherVideo']);
export const MaterialsService = restApp.service(services['allMaterials']);
export const UploadPhotoService = restApp.service(services['uploadPhoto']);
export const ModuleService = restApp.service(services['module']);

export const InstituteDashboardService = restApp.service(services['institute-dashboard']);
export const InstituteDashboardExamService = restApp.service(services['institute-dashboard-exam']);
export const AdminDashboardService = restApp.service(services['admin-dashboard']);

export const UploadPhotoFiles = (file, purpose) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);
    return UploadPhotoService.create(formData);
};

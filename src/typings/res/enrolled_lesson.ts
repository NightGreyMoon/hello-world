type EnrolledLesson = {
  id: number;
  studentId: number;
  lessonId: number;
  lessonName: string;
  lessonCourse: string;
  signInCount: number;
  notSignInCount: number;
  enrollmentTimeStamp: number;
  paymentTimeStamp: number;
  amount: number;
};

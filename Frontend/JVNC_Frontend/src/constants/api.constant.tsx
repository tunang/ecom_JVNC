export const ApiConstant = {
    auth: {
      login: '/auth/users/login',
      logout: '/auth/users/logout',
      signup: '/auth/users/register',
    },

  };
  
  export const ApiConstantUser = {
    classrooms: {
      getAll: '/api/v1/classrooms/byStudentCode/:studentCode',
    },
  
    subjects: {
      getAll: '/subject',
    },
  
    enrollment: {
      reject: 'reject/:classroomId',
    },
  };
  
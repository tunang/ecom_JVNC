export const ApiConstant = {
    auth: {
      login: '/users/login',
      logout: '/users/logout',
      signup: '/users/register',
      sendOTP: '/users/send-otp',
    },

    product: {
      getAll: '/products',
    },

    user: {
      getAll: '/users',
      deleteUserByID: '/users/:id',
    },

    genre:{
      getAll: '/genres',
    },

    book:{
      getAll: '/books',
      getByGenre: '/books/genre/:genreId',
      getByID: '/books/:id',
      search: '/books/search',
    },

    order:{
      create: '/orders',
      getAll: '/orders',
      getById: '/orders/:id',
    }

  };
  

  
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes';
import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { initializeAuth } from './store/slices/authSlice';

function AuthWrapper() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize authentication on app startup
    dispatch(initializeAuth());
  }, [dispatch]);

  return <AppRoutes />;
}

function App() {
  return (
    <Provider store={store}>
      <AuthWrapper />
    </Provider>
  );
}

export default App;

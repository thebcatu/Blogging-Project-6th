import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeAuth } from './redux/slices/authSlice';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import routes from './routes';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {routes.map((route) => {
              if (!route.protected) {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<route.component />}
                    exact={route.exact}
                  />
                );
              }

              return (
                <Route key={route.path} element={<ProtectedRoute roles={route.roles} />}>
                  <Route
                    path={route.path}
                    element={<route.component />}
                    exact={route.exact}
                  />
                </Route>
              );
            })}
          </Routes>
        </Suspense>
      </Layout>
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  );
}

export default App;

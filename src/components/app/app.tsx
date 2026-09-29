import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute,
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import {
  checkUserAuth,
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIsIngredientsLoading,
} from '@slices';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import type { AppDispatch } from '@services/store';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIsIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  const backgroundLocation = (location.state as { background?: Location })?.background;

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  const handleCloseModal = (): void => {
    void navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      {isLoading ? (
        <Preloader />
      ) : error ? (
        <p className={`${styles.message} text text_type_main-medium`}>
          Не удалось загрузить ингредиенты: {error}
        </p>
      ) : !ingredients.length ? (
        <p className={`${styles.message} text text_type_main-medium`}>
          Нет ингредиентов
        </p>
      ) : (
        <>
          <Routes location={backgroundLocation ?? location}>
            <Route path="/" element={<ConstructorPage />} />
            <Route path="/feed" element={<Feed />} />
            <Route
              path="/login"
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/orders"
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ingredients/:id"
              element={
                <div className={styles.detailPageWrap}>
                  <p className={`text text_type_main-large ${styles.detailHeader}`}>
                    Детали ингредиента
                  </p>
                  <IngredientDetails />
                </div>
              }
            />
            <Route
              path="/feed/:number"
              element={
                <div className={styles.detailPageWrap}>
                  <OrderDetailsPage />
                </div>
              }
            />
            <Route
              path="/profile/orders/:number"
              element={
                <ProtectedRoute>
                  <div className={styles.detailPageWrap}>
                    <OrderDetailsPage />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound404 />} />
          </Routes>

          {backgroundLocation && (
            <Routes>
              <Route
                path="/ingredients/:id"
                element={
                  <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path="/feed/:number"
                element={<OrderModal onClose={handleCloseModal} />}
              />
              <Route
                path="/profile/orders/:number"
                element={
                  <ProtectedRoute>
                    <OrderModal onClose={handleCloseModal} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

const OrderModal = ({ onClose }: { onClose: () => void }): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  return (
    <Modal title={`#${String(number ?? '').padStart(6, '0')}`} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};

const OrderDetailsPage = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  return (
    <>
      <p className={`text text_type_digits-default ${styles.detailHeader}`}>
        #{String(number ?? '').padStart(6, '0')}
      </p>
      <OrderInfo />
    </>
  );
};

export default App;

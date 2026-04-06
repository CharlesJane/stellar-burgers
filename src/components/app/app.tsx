import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { FC, useEffect, useMemo, useState } from 'react';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import {
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { LayoutUi } from '@ui-pages';
import { Preloader } from '@ui';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/store/slices/ingredients-slice';
import {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from '../../services/store/selectors/ingredients-selectors';
import { getCookie } from '../../utils/cookie';
import { fetchUser } from '../../services/store/slices/user-slice';
import { ProtectedRoute } from '../protected-route';

const App: FC = () => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredients = useSelector(selectIngredients);
  const error = useSelector(selectIngredientsError);

  const [currentOrderNumber, setCurrentOrderNumber] = useState<number | null>(
    null
  );

  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation ?? null;
  const navigate = useNavigate();

  useEffect(() => {
    if (ingredients.length === 0 && !isIngredientsLoading) {
      dispatch(fetchIngredients());
    }

    const token = getCookie('accessToken');
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, ingredients.length, isIngredientsLoading]);

  const handleModalClose = useMemo(
    () => () => {
      navigate(backgroundLocation?.pathname || '/');
      setCurrentOrderNumber(null);
    },
    [navigate, backgroundLocation]
  );

  const hasIngredients = ingredients.length > 0;

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : hasIngredients ? (
        <>
          <Routes location={backgroundLocation || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />

            <Route
              path='/login'
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute requireAuth={false}>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute requireAuth={false}>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute requireAuth>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute requireAuth>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            {!backgroundLocation && (
              <>
                <Route
                  path='/feed/:number'
                  element={
                    <LayoutUi>
                      <OrderInfo
                        setCurrentOrderNumber={setCurrentOrderNumber}
                      />
                    </LayoutUi>
                  }
                />
                <Route
                  path='/ingredients/:id'
                  element={
                    <LayoutUi>
                      <IngredientDetails />
                    </LayoutUi>
                  }
                />
                <Route
                  path='/profile/orders/:number'
                  element={
                    <ProtectedRoute requireAuth>
                      <LayoutUi>
                        <OrderInfo
                          setCurrentOrderNumber={setCurrentOrderNumber}
                        />
                      </LayoutUi>
                    </ProtectedRoute>
                  }
                />
              </>
            )}

            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {backgroundLocation && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal
                    title={`${currentOrderNumber}`}
                    onClose={handleModalClose}
                  >
                    <OrderInfo setCurrentOrderNumber={setCurrentOrderNumber} />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal
                    title='Описание ингредиента'
                    onClose={handleModalClose}
                  >
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute requireAuth>
                    <Modal
                      title={`${currentOrderNumber}`}
                      onClose={handleModalClose}
                    >
                      <OrderInfo
                        setCurrentOrderNumber={setCurrentOrderNumber}
                      />
                    </Modal>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет ингредиентов
        </div>
      )}
    </div>
  );
};

export default App;

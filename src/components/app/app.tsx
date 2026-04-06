import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { useEffect, useMemo, useState } from 'react';

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

const App = () => {
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
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/orders' element={<ProfileOrders />} />
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
                    <LayoutUi>
                      <OrderInfo
                        setCurrentOrderNumber={setCurrentOrderNumber}
                      />
                    </LayoutUi>
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
                  <Modal
                    title={`${currentOrderNumber}`}
                    onClose={handleModalClose}
                  >
                    <OrderInfo setCurrentOrderNumber={setCurrentOrderNumber} />
                  </Modal>
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

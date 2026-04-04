import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { useEffect } from 'react';

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
import { Preloader } from '@ui';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/store/slices/ingredients-slice';
import {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from '../../services/store/selectors/ingredients-selectors';

const App = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменные из стора */
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredients = useSelector(selectIngredients);
  const error = useSelector(selectIngredientsError);

  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  useEffect(() => {
    if (ingredients.length === 0 && !isIngredientsLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, isIngredientsLoading]);

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
            <Route path='/profile'>
              <Route index element={<Profile />} />
              <Route path='orders' element={<ProfileOrders />} />
            </Route>

            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {backgroundLocation && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal title='Описание заказа' onClose={() => {}}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Описание ингредиента' onClose={() => {}}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <Modal
                    title='Описание размещенного пользователем заказа'
                    onClose={() => {}}
                  >
                    <OrderInfo />
                  </Modal>
                }
              />
            </Routes>
          )}
        </>
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет игредиентов
        </div>
      )}
    </div>
  );
};

export default App;

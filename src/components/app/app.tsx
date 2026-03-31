import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Preloader } from '@ui';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  /** TODO: взять переменные из стора */
  const isIngredientsLoading = false;
  const ingredients = [];
  const error = null;

  return (
    <Router>
      <div className={styles.app}>
        <AppHeader />
        {isIngredientsLoading ? (
          <Preloader />
        ) : error ? (
          <div className={`${styles.error} text text_type_main-medium pt-4`}>
            {error}
          </div>
        ) : ingredients.length > 0 ? (
          <Routes>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            {/* Защищенные пути */}
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/orders' element={<ProfileOrders />} />
            {/* Резервный путь */}
            <Route path='*' element={<NotFound404 />} />
          </Routes>
        ) : (
          <div className={`${styles.title} text text_type_main-medium pt-4`}>
            Нет игредиентов
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;

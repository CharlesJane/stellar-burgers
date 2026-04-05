// import { BurgerConstructorUI } from '@ui';
// import type { Meta, StoryObj } from '@storybook/react';

// const meta = {
//   title: 'Example/BurgerConstructor',
//   component: BurgerConstructorUI,
//   // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
//   tags: ['autodocs'],
//   parameters: {
//     // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
//     layout: 'fullscreen'
//   }
// } satisfies Meta<typeof BurgerConstructorUI>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// export const DefaultConstructor: Story = {
//   args: {
//     constructorItems: { bun: null, ingredients: [] },
//     orderRequest: false,
//     price: 0,
//     orderModalData: null,
//     onOrderClick: () => {},
//     closeOrderModal: () => {}
//   }
// };


import {
	Routes,
	Route,
	useLocation,
} from 'react-router-dom';
import {Home} from '../pages/Home';
import {HotelList} from '../pages/HotelList';
import {Hotel} from '../pages/Hotel';
import {Layout} from '../components/Layout';
import {Modal} from '../components/Modal';
export const App = () => {
	const location = useLocation();
	const background = location.state && location.state.background;
	return (
		<>
			<Routes location={background || location}>
				<Route path='/' element={<Home />} />
				<Route path='/hotel-list' element={<HotelList />} />
				{!background && 
          <Route 
            path='/hotel/:hotelIndex' 
            element={<Layout><Hotel /></Layout>} 
          />}
			</Routes>

			{background &&
         <Routes>
         <Route 
          path='/hotel/:hotelIndex' 
          element={<Modal><Hotel /></Modal>} />
        </Routes>}
		</>
	)
};

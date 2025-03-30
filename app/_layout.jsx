import { Provider } from 'react-redux';
import { store } from '../store/store'; 
import ReduxLayout from './_reduxLayout';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ReduxLayout />
    </Provider>
  );
}

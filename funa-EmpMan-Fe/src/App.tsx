import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import ToastContainer from './components/ToastContainer';

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <AppRouter />
    </Router>
  );
};

export default App;

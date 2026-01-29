import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './components/contexts/authContext'
import { Provider } from 'react-redux'  
import store from './store'
import Routes from './routes'

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;

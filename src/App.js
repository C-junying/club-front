import './App.css'
import 'antd/dist/reset.css'
import { BrowserRouter} from 'react-router-dom'
import IndexRouter from './router/IndexRouter'
function App() {
  return (
    <BrowserRouter>
      <IndexRouter />
    </BrowserRouter>
  )
}

export default App

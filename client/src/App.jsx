import './App.css'
import Form from './pages/Form'
import bgVid from './assets/bgVid.mp4'
import { Routes, Route } from 'react-router-dom'

function App() {


  return (
    <div className='App'>
        <Routes>
          <Route path='/' element={<Form />} />
        </Routes>
      </div>
  )
}

export default App

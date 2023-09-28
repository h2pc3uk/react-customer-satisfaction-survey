import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SurveyForms from './components/SurveyForms'

function App() {

  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route path='/survey/:surveyId' Component={SurveyForms} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App

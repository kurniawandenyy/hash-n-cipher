import './App.css'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import BcryptTools from './components/bcrypt'

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content" style={{ padding: '2rem' }}>
        <BcryptTools />
      </main>
      <Footer />
    </div>
  )
}

export default App

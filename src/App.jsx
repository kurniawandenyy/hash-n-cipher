import './App.css'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import BcryptTools from './components/bcrypt'
import CaesarTools from './components/caesar'
import RsaTools from './components/rsa'
import AesTools from './components/aes'

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content" style={{ padding: '2rem' }}>
        <BcryptTools />
        <div style={{ marginTop: '4rem' }}>
          <CaesarTools />
        </div>
        <div style={{ marginTop: '4rem' }}>
          <RsaTools />
        </div>
        <div style={{ marginTop: '4rem' }}>
          <AesTools />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App

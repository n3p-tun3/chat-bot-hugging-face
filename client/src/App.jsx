import './App.css'
import ChatWidget from './ChatWidget'

function App() {
  return (
    <div className="coffee-shop">
      <header className="hero">
        <div className="hero-content">
          <h1>Cozy Beans Café</h1>
          <p>Where every cup tells a story</p>
          <button className="cta-button">Order Now</button>
        </div>
      </header>

      <section className="about">
        <div className="container">
          <h2>Welcome to Our Coffee Haven</h2>
          <p>
            At Cozy Beans Café, we're passionate about serving the perfect cup of coffee.
            From our carefully sourced beans to our expertly crafted beverages,
            every sip is a journey of flavor and warmth.
          </p>
        </div>
      </section>

      <section className="hours">
        <div className="container">
          <h2>Visit Us</h2>
          <div className="hours-grid">
            <div className="hours-item">
              <h3>Hours</h3>
              <p>Monday - Friday: 7 AM - 8 PM</p>
              <p>Saturday - Sunday: 8 AM - 6 PM</p>
            </div>
            <div className="hours-item">
              <h3>Location</h3>
              <p>123 Coffee Street</p>
              <p>Downtown, City 12345</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>☕ Premium Coffee</h3>
              <p>Freshly roasted beans from around the world</p>
            </div>
            <div className="feature">
              <h3>🥐 Fresh Pastries</h3>
              <p>Baked daily with love and quality ingredients</p>
            </div>
            <div className="feature">
              <h3>📶 Free Wi-Fi</h3>
              <p>Perfect space for work, study, or relaxation</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Cozy Beans Café. All rights reserved.</p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  )
}

export default App

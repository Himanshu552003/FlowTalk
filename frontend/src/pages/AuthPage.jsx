import "../styles/auth.css"
import {SignInButton} from "@clerk/clerk-react";

const AuthPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-hero">
            <div className="brand-container">
                <img src="/logo.png" alt="Talk" className='brand-logo' />
                <span className='brand-name'>Talk</span>
            </div>

            <h1 className='hero-title'>Where Work Happen ✨</h1>

            <p className='hero-subtitle'>Connect with your team instantly through secure, real-time messaging. Exprerience
              seamless collaboration with powerful features designed for modern teams.
            </p>

            <div className='features-list'>
              <div className="feature-item">
                <span className="feature-icon">Ⓜ️</span>
                <span>Real-Time messaging</span>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🎥</span>
                <span>Video call & meetings</span>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Secure & Private</span>
              </div>


            </div>

            <SignInButton mode="modal">
              <button className="cta-button">
                Get Started with Talk
                <span className="button-arrow">➡️</span>
              </button>
            </SignInButton>

           
        </div>

      </div>

      <div className="auth-right">
        <div className="auth-image-container">
          <img src="/auth-i.png" alt="Team collaboration" className="auth-image" />
          <div className="image-overlay"></div>
        </div>
      </div>


      
    </div>
  )
}

export default AuthPage

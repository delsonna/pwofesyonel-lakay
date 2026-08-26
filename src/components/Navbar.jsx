import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const Navbar = ({ onRegisterClick }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // USER CONNECTE
  const [user, setUser] = useState(null);

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
    setMenuOpen(false);
    setUserMenuOpen(false);

    if (onRegisterClick) {
      onRegisterClick();
    }
  };

  const closeRegister = () => {
    setShowRegister(false);

    if (onRegisterClick) {
      onRegisterClick(false);
    }
  };

  // Lè LoginModal voye enfòmasyon itilizatè a
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setUserMenuOpen(false);
  };

  // DEKONEKTE
  const handleLogout = () => {
    setUser(null);
    setUserMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // 2 premye lèt non + prenon
  const getInitials = () => {
    if (!user) return "";

    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";

    return `${first}${last}`.toUpperCase();
  };

  return (
    <>
      <header className="navbar">

        <div className="navbar-container">

          {/* LOGO */}
          <Link
            to="/"
            className="logo"
            onClick={closeMenu}
          >
            <span className="logo-icon">
              PL
            </span>

            <span className="logo-text">
              Pwofesyonèl <strong>Lakay</strong>
            </span>
          </Link>


          {/* DESKTOP MENU */}
          <nav className="nav-links">

            <Link to="/">
              Akèy
            </Link>

            <Link to="/professionals">
              Pwofesyonèl
            </Link>

            <Link to="/categories">
              Kategori
            </Link>

            <Link to="/about">
              Sou nou
            </Link>

            <Link to="/contact">
              Kontak
            </Link>

          </nav>


          {/* DESKTOP BUTTONS */}
          <div className="nav-actions">

            {!user ? (
              <>
                <button
                  className="login-btn"
                  onClick={openLogin}
                >
                  Konekte
                </button>

                <button
                  className="register-btn"
                  onClick={openRegister}
                >
                  Enskri
                </button>
              </>
            ) : (
              <div className="user-menu-container">

                <button
                  className="user-avatar-btn"
                  onClick={() =>
                    setUserMenuOpen(!userMenuOpen)
                  }
                  aria-label="Meni itilizatè"
                >
                  <span className="user-avatar">
                    {getInitials()}
                  </span>

                  <span className="user-arrow">
                    {userMenuOpen ? "▲" : "▼"}
                  </span>
                </button>


                {userMenuOpen && (
                  <div className="user-dropdown">

                    <div className="user-dropdown-header">

                      <div className="user-dropdown-avatar">
                        {getInitials()}
                      </div>

                      <div>
                        <strong>
                          {user.firstName} {user.lastName}
                        </strong>

                        <span>
                          Konekte
                        </span>
                      </div>

                    </div>


                    <div className="user-dropdown-divider" />


                    <button className="user-dropdown-item">
                      Mon profil
                    </button>

                    <button className="user-dropdown-item">
                      Paramèt
                    </button>
                   
                   <Link
  to="/professional-setup"
  className="user-dropdown-professional"
  onClick={() => setUserMenuOpen(false)}
>
  ★ Enskri kòm pwofesyonèl
</Link>

                    <div className="user-dropdown-divider" />


                    <button
                      className="user-dropdown-logout"
                      onClick={handleLogout}
                    >
                      Dekonekte
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>


          {/* MOBILE MENU BUTTON */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Ouvri meni"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>


        {/* MOBILE MENU */}
        <div
          className={`mobile-menu ${
            menuOpen ? "active" : ""
          }`}
        >

          <Link
            to="/"
            onClick={closeMenu}
          >
            Akèy
          </Link>

          <Link
            to="/professionals"
            onClick={closeMenu}
          >
            Pwofesyonèl
          </Link>

          <Link
            to="/categories"
            onClick={closeMenu}
          >
            Kategori
          </Link>

          <Link
            to="/about"
            onClick={closeMenu}
          >
            Sou nou
          </Link>

          <Link
            to="/contact"
            onClick={closeMenu}
          >
            Kontak
          </Link>


          {/* MOBILE BUTTONS */}
          <div className="mobile-menu-actions">

            {!user ? (
              <>
                <button
                  className="login-btn"
                  onClick={openLogin}
                >
                  Konekte
                </button>

                <button
                  className="register-btn"
                  onClick={openRegister}
                >
                  Enskri
                </button>
              </>
            ) : (
              <button
                className="login-btn"
                onClick={handleLogout}
              >
                Dekonekte
              </button>
            )}

          </div>

        </div>

      </header>


      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={openRegister}
        onLoginSuccess={handleLoginSuccess}
      />


      {/* REGISTER MODAL */}
      <RegisterModal
        isOpen={showRegister}
        onClose={closeRegister}
        onSwitchToLogin={openLogin}
      />

    </>
  );
};

export default Navbar;
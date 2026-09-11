
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { supabase } from "../lib/supabase";

const Navbar = ({ onRegisterClick }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  /*
  ==========================================================
  RESTORE SUPABASE SESSION
  ==========================================================
  */

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Get session error:", error);
          return;
        }

        if (!mounted) return;

        if (session?.user) {
          const supabaseUser = session.user;

          const firstName =
            supabaseUser.user_metadata?.first_name || "";

          const lastName =
            supabaseUser.user_metadata?.last_name || "";

          setUser({
            id: supabaseUser.id,
            firstName,
            lastName,
            email: supabaseUser.email || "",
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Session restore error:", error);
      }
    };

    loadSession();

    /*
    ==========================================================
    LISTEN FOR AUTH CHANGES
    ==========================================================
    */

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          const supabaseUser = session.user;

          const firstName =
            supabaseUser.user_metadata?.first_name || "";

          const lastName =
            supabaseUser.user_metadata?.last_name || "";

          setUser({
            id: supabaseUser.id,
            firstName,
            lastName,
            email: supabaseUser.email || "",
          });
        } else {
          setUser(null);
          setUserMenuOpen(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /*
  ==========================================================
  OPEN LOGIN
  ==========================================================
  */

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  /*
  ==========================================================
  OPEN REGISTER
  ==========================================================
  */

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
    setMenuOpen(false);
    setUserMenuOpen(false);

    if (onRegisterClick) {
      onRegisterClick();
    }
  };

  /*
  ==========================================================
  CLOSE REGISTER
  ==========================================================
  */

  const closeRegister = () => {
    setShowRegister(false);

    if (onRegisterClick) {
      onRegisterClick(false);
    }
  };

  /*
  ==========================================================
  LOGIN SUCCESS
  ==========================================================
  */

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setUserMenuOpen(false);
    setMenuOpen(false);
  };

  /*
  ==========================================================
  LOGOUT
  ==========================================================
  */

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      setUserMenuOpen(false);
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /*
  ==========================================================
  CLOSE MENUS
  ==========================================================
  */

  const closeMenu = () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  /*
  ==========================================================
  USER INITIALS
  ==========================================================
  */

  const getInitials = () => {
    if (!user) return "";

    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";

    const initials = `${first}${last}`.toUpperCase();

    if (initials) {
      return initials;
    }

    return user.email?.charAt(0)?.toUpperCase() || "U";
  };

  /*
  ==========================================================
  RENDER
  ==========================================================
  */

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


                    <Link
                      to="/profile"
                      className="user-dropdown-item"
                      onClick={() =>
                        setUserMenuOpen(false)
                      }
                    >
                      Mon profil
                    </Link>


                    <button
                      type="button"
                      className="user-dropdown-item"
                    >
                      Paramèt
                    </button>


                    <Link
                      to="/professional-setup"
                      className="user-dropdown-professional"
                      onClick={() =>
                        setUserMenuOpen(false)
                      }
                    >
                      ★ Enskri kòm pwofesyonèl
                    </Link>


                    <div className="user-dropdown-divider" />


                    <button
                      type="button"
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
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
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


          {/* MOBILE USER MENU */}
          {user ? (
            <div className="mobile-user-section">

              <div className="mobile-user-header">

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


              <Link
                to="/profile"
                className="user-dropdown-item"
                onClick={closeMenu}
              >
                Mon profil
              </Link>


              <button
                type="button"
                className="user-dropdown-item"
                onClick={closeMenu}
              >
                Paramèt
              </button>


              <Link
                to="/professional-setup"
                className="user-dropdown-professional"
                onClick={closeMenu}
              >
                ★ Enskri kòm pwofesyonèl
              </Link>


              <div className="user-dropdown-divider" />


              <button
                type="button"
                className="user-dropdown-logout"
                onClick={handleLogout}
              >
                Dekonekte
              </button>

            </div>
          ) : (

            /* MOBILE BUTTONS */
            <div className="mobile-menu-actions">

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

            </div>

          )}

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


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

  // FOTO PWOFÈSYONÈL
  const [profileImage, setProfileImage] = useState(null);

  // ==========================================================
  // LOAD PROFESSIONAL PHOTO
  // ==========================================================

  const loadProfessionalPhoto = async (email) => {
    if (!email) {
      setProfileImage(null);
      return;
    }

    try {
      const authEmail = email.trim();

      const {
        data,
        error,
      } = await supabase
        .from("professionals")
        .select("image")
        .ilike("email", authEmail)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "Navbar professional photo error:",
          error
        );

        setProfileImage(null);
        return;
      }

      if (data?.image) {
        setProfileImage(data.image);

        console.log(
          "NAVBAR PROFILE PHOTO:",
          data.image
        );
      } else {
        setProfileImage(null);
      }

    } catch (error) {
      console.error(
        "Load navbar profile photo error:",
        error
      );

      setProfileImage(null);
    }
  };

  // ==========================================================
  // RESTORE SUPABASE SESSION
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(
            "Get session error:",
            error
          );

          return;
        }

        if (!mounted) return;

        if (session?.user) {
          const supabaseUser = session.user;

          const firstName =
            supabaseUser.user_metadata?.first_name || "";

          const lastName =
            supabaseUser.user_metadata?.last_name || "";

          const currentUser = {
            id: supabaseUser.id,
            firstName,
            lastName,
            email: supabaseUser.email || "",
          };

          setUser(currentUser);

          // CHACHE FOTO PWOFÈSYONÈL LA
          await loadProfessionalPhoto(
            supabaseUser.email
          );

        } else {
          setUser(null);
          setProfileImage(null);
        }

      } catch (error) {
        console.error(
          "Session restore error:",
          error
        );
      }
    };

    loadSession();

    // ========================================================
    // LISTEN FOR AUTH CHANGES
    // ========================================================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {

        if (!mounted) return;

        if (session?.user) {
          const supabaseUser = session.user;

          const firstName =
            supabaseUser.user_metadata?.first_name || "";

          const lastName =
            supabaseUser.user_metadata?.last_name || "";

          const currentUser = {
            id: supabaseUser.id,
            firstName,
            lastName,
            email: supabaseUser.email || "",
          };

          setUser(currentUser);

          await loadProfessionalPhoto(
            supabaseUser.email
          );

        } else {
          setUser(null);
          setProfileImage(null);
          setUserMenuOpen(false);
        }
      }
    );

    // ========================================================
    // LISTEN WHEN PROFILE PHOTO CHANGES
    // ========================================================

    const handleProfilePhotoUpdated = (
      event
    ) => {
      const newPhoto =
        event?.detail?.image || null;

      if (newPhoto) {
        setProfileImage(newPhoto);
      }
    };

    window.addEventListener(
      "professionalPhotoUpdated",
      handleProfilePhotoUpdated
    );

    // ========================================================
    // CLEANUP
    // ========================================================

    return () => {
      mounted = false;

      subscription.unsubscribe();

      window.removeEventListener(
        "professionalPhotoUpdated",
        handleProfilePhotoUpdated
      );
    };

  }, []);

  // ==========================================================
  // OPEN LOGIN
  // ==========================================================

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  // ==========================================================
  // OPEN REGISTER
  // ==========================================================

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
    setMenuOpen(false);
    setUserMenuOpen(false);

    if (onRegisterClick) {
      onRegisterClick();
    }
  };

  // ==========================================================
  // CLOSE REGISTER
  // ==========================================================

  const closeRegister = () => {
    setShowRegister(false);

    if (onRegisterClick) {
      onRegisterClick(false);
    }
  };

  // ==========================================================
  // LOGIN SUCCESS
  // ==========================================================

  const handleLoginSuccess = async (
    loggedInUser
  ) => {
    setUser(loggedInUser);
    setUserMenuOpen(false);
    setMenuOpen(false);

    // CHÈCHE FOTO APRÈ LOGIN
    await loadProfessionalPhoto(
      loggedInUser?.email
    );
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    try {
      const {
        error,
      } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      setProfileImage(null);
      setUserMenuOpen(false);
      setMenuOpen(false);

    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  // ==========================================================
  // CLOSE MENUS
  // ==========================================================

  const closeMenu = () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  // ==========================================================
  // USER INITIALS
  // ==========================================================

  const getInitials = () => {
    if (!user) return "";

    const first =
      user.firstName?.charAt(0) || "";

    const last =
      user.lastName?.charAt(0) || "";

    const initials =
      `${first}${last}`.toUpperCase();

    if (initials) {
      return initials;
    }

    return (
      user.email
        ?.charAt(0)
        ?.toUpperCase() || "U"
    );
  };

  // ==========================================================
  // PROFILE AVATAR
  // ==========================================================

  const renderAvatar = (
    className = "user-avatar"
  ) => {
    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt={`${user?.firstName || ""} ${
            user?.lastName || ""
          }`}
          className={`${className} user-avatar-photo`}
          onError={() => {
            console.error(
              "Navbar image failed to load."
            );

            setProfileImage(null);
          }}
        />
      );
    }

    return (
      <span className={className}>
        {getInitials()}
      </span>
    );
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <header className="navbar">

        <div className="navbar-container">

          {/* ==================================================
              LOGO
          ================================================== */}

          <Link
            to="/"
            className="logo"
            onClick={closeMenu}
            aria-label="Pwofesyonèl Lakay - Akèy"
          >
            <img
              src="/logo.png.png"
              alt="Pwofesyonèl Lakay"
              className="site-logo"
            />
          </Link>

          {/* ==================================================
              DESKTOP MENU
          ================================================== */}

          <nav className="nav-links">

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

          </nav>

          {/* ==================================================
              DESKTOP ACTIONS
          ================================================== */}

          <div className="nav-actions">

            {!user ? (
              <>
                <button
                  type="button"
                  className="login-btn"
                  onClick={openLogin}
                >
                  Konekte
                </button>

                <button
                  type="button"
                  className="register-btn"
                  onClick={openRegister}
                >
                  Enskri
                </button>
              </>
            ) : (

              <div className="user-menu-container">

                <button
                  type="button"
                  className="user-avatar-btn"
                  onClick={() =>
                    setUserMenuOpen(
                      (prev) => !prev
                    )
                  }
                  aria-label="Meni itilizatè"
                  aria-expanded={
                    userMenuOpen
                  }
                >

                  {renderAvatar("user-avatar")}

                  <span className="user-arrow">
                    {userMenuOpen
                      ? "▲"
                      : "▼"}
                  </span>

                </button>

                {userMenuOpen && (

                  <div className="user-dropdown">

                    {/* USER HEADER */}

                    <div className="user-dropdown-header">

                      {renderAvatar(
                        "user-dropdown-avatar"
                      )}

                      <div>

                        <strong>
                          {user.firstName}{" "}
                          {user.lastName}
                        </strong>

                        <span>
                          Konekte
                        </span>

                      </div>

                    </div>

                    <div className="user-dropdown-divider" />

                    {/* MON PROFIL */}

                    <Link
                      to="/profile"
                      className="user-dropdown-item"
                      onClick={() =>
                        setUserMenuOpen(false)
                      }
                    >
                      Mon profil
                    </Link>

                    {/* PROFESSIONAL */}

                    <Link
                      to="/professional-setup"
                      className="user-dropdown-professional"
                      onClick={() =>
                        setUserMenuOpen(false)
                      }
                    >
                      ★ Enskri kòm pwofesyonèl
                    </Link>

                    {/* SETTINGS */}

                    <Link
                      to="/settings"
                      className="user-dropdown-item"
                      onClick={() =>
                        setUserMenuOpen(false)
                      }
                    >
                      Paramèt
                    </Link>

                    <div className="user-dropdown-divider" />

                    {/* LOGOUT */}

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

          {/* ==================================================
              MOBILE BUTTON
          ================================================== */}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() =>
              setMenuOpen(
                (prev) => !prev
              )
            }
            aria-label="Ouvri meni"
            aria-expanded={menuOpen}
          >
            {menuOpen
              ? "✕"
              : "☰"}
          </button>

        </div>

        {/* ==================================================
            MOBILE MENU
        ================================================== */}

        <div
          className={`mobile-menu ${
            menuOpen
              ? "active"
              : ""
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

          {/* ==================================================
              MOBILE USER
          ================================================== */}

          {user ? (

            <div className="mobile-user-section">

              <div className="mobile-user-header">

                {renderAvatar(
                  "user-dropdown-avatar"
                )}

                <div>

                  <strong>
                    {user.firstName}{" "}
                    {user.lastName}
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

              <Link
                to="/settings"
                className="user-dropdown-item"
                onClick={closeMenu}
              >
                Paramèt
              </Link>

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

            <div className="mobile-menu-actions">

              <button
                type="button"
                className="login-btn"
                onClick={openLogin}
              >
                Konekte
              </button>

              <button
                type="button"
                className="register-btn"
                onClick={openRegister}
              >
                Enskri
              </button>

            </div>

          )}

        </div>

      </header>

      {/* ======================================================
          LOGIN MODAL
      ====================================================== */}

      <LoginModal
        isOpen={showLogin}
        onClose={() =>
          setShowLogin(false)
        }
        onSwitchToRegister={
          openRegister
        }
        onLoginSuccess={
          handleLoginSuccess
        }
      />

      {/* ======================================================
          REGISTER MODAL
      ====================================================== */}

      <RegisterModal
        isOpen={showRegister}
        onClose={closeRegister}
        onSwitchToLogin={
          openLogin
        }
      />

    </>
  );
};

export default Navbar;

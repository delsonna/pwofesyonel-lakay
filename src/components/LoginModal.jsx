import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./LoginModal.css";

const LoginModal = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      /*
      ================================
      LOGIN SUPABASE
      ================================
      */

      const {
        data,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        throw loginError;
      }

      /*
      ================================
      VERIFY SESSION
      ================================
      */

      if (!data?.session || !data?.user) {
        throw new Error(
          "Sesyon ou a pa disponib. Tanpri konekte ankò."
        );
      }

      /*
      ================================
      USER INFORMATION
      ================================
      */

      const user = data.user;

      const firstName =
        user.user_metadata?.first_name || "";

      const lastName =
        user.user_metadata?.last_name || "";

      const loggedUser = {
        id: user.id,
        firstName,
        lastName,
        email: user.email,
      };

      /*
      ================================
      SEND USER TO APP
      ================================
      */

      if (onLoginSuccess) {
        onLoginSuccess(loggedUser);
      }

      /*
      ================================
      CLEAN FORM
      ================================
      */

      setEmail("");
      setPassword("");
      setError("");

      onClose();

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Email oswa modpas la pa kòrèk."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-modal-overlay"
      onClick={onClose}
    >
      <div
        className="login-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* CLOSE */}

        <button
          className="login-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Fèmen"
        >
          ×
        </button>


        {/* HEADER */}

        <div className="login-modal-header">

          <div className="login-modal-logo">
            PL
          </div>

          <h2>
            Byenveni
          </h2>

          <p>
            Konekte sou kont Pwofesyonèl Lakay ou.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        {/* FORM */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="login-form-group">

            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="Antre email ou"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="login-form-group">

            <label htmlFor="login-password">
              Modpas
            </label>

            <input
              id="login-password"
              type="password"
              placeholder="Antre modpas ou"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          {/* OPTIONS */}

          <div className="login-form-options">

            <label className="remember-me">

              <input type="checkbox" />

              <span>
                Sonje mwen
              </span>

            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Ou bliye modpas?
            </button>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Koneksyon..."
              : "Konekte"}
          </button>

        </form>


        {/* REGISTER */}

        <div className="login-register">

          <span>
            Ou poko gen kont?
          </span>

          <button
            type="button"
            onClick={onSwitchToRegister}
          >
            Enskri
          </button>

        </div>

      </div>
    </div>
  );
};

export default LoginModal;
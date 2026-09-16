import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./RegisterModal.css";

const RegisterModal = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const [accountCreated, setAccountCreated] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("REGISTER BUTTON CLICKED");

    setError("");

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim()
    ) {
      setError(
        "Tanpri ranpli prenon ak non ou."
      );
      return;
    }

    if (!formData.email.trim()) {
      setError(
        "Tanpri antre email ou."
      );
      return;
    }

    if (!formData.phone.trim()) {
      setError(
        "Tanpri antre nimewo telefòn ou."
      );
      return;
    }

    if (
      formData.password.length < 6
    ) {
      setError(
        "Modpas la dwe gen omwen 6 karaktè."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Modpas yo pa menm."
      );
      return;
    }

    try {
      setLoading(true);

      /*
      ================================
      CREATE SUPABASE ACCOUNT
      ================================
      */

      const {
        data,
        error: signUpError,
      } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,

        options: {
          data: {
            first_name:
              formData.firstName.trim(),

            last_name:
              formData.lastName.trim(),

            phone:
              formData.phone.trim(),
          },
        },
      });

      console.log(
        "SUPABASE SIGNUP RESULT:",
        data
      );

      if (signUpError) {
        throw signUpError;
      }

      /*
      ================================
      ACCOUNT CREATED
      ================================
      */

      setAccountCreated(true);

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      setError(
        error.message ||
          "Gen yon pwoblèm pandan kont lan t ap kreye."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAccountCreated(false);

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    setError("");

    onClose();
  };

  return (
    <div
      className="register-modal-overlay"
      onClick={handleClose}
    >

      <div
        className="register-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <button
          className="register-modal-close"
          type="button"
          onClick={handleClose}
        >
          ×
        </button>


        {accountCreated ? (

          /*
          ================================
          SUCCESS
          ================================
          */

          <div className="account-success">

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Kont ou an kreye ak siksè!
            </h2>

            <p>
              Kont ou kreye avèk siksè.
              SVP, ale nan bwat resepsyon ou
              pou konfime email la.Avan ou konekte
            </p>

            <button
              type="button"
              className="continue-setup-btn"
              onClick={handleClose}
            >
              Fèmen
            </button>

          </div>

        ) : (

          /*
          ================================
          REGISTER FORM
          ================================
          */

          <>

            <div className="register-modal-header">

              <div className="register-modal-logo">
                PL
              </div>

              <h2>
                Kreye kont ou
              </h2>

              <p>
                Enskri sou Pwofesyonèl Lakay
                pou kòmanse.
              </p>

            </div>


            {error && (
              <div className="register-error">
                {error}
              </div>
            )}


            <form
              className="register-form"
              onSubmit={handleRegister}
            >

              <div className="register-form-group">

                <label>
                  Prenon
                </label>

                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Egzanp: Jean"
                  required
                />

              </div>


              <div className="register-form-group">

                <label>
                  Non
                </label>

                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Egzanp: Pierre"
                  required
                />

              </div>


              <div className="register-form-group">

                <label>
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Egzanp: jean@email.com"
                  required
                />

              </div>


              <div className="register-form-group">

                <label>
                  Telefòn
                </label>

                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+509..."
                  required
                />

              </div>


              <div className="register-form-group">

                <label>
                  Modpas
                </label>

                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Kreye yon modpas"
                  required
                />

              </div>


              <div className="register-form-group">

                <label>
                  Konfime modpas
                </label>

                <input
                  name="confirmPassword"
                  type="password"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Ekri modpas la ankò"
                  required
                />

              </div>


              <label className="register-terms">

                <input
                  type="checkbox"
                  required
                />

                <span>
                  Mwen dakò ak kondisyon
                  ak règleman
                  Pwofesyonèl Lakay yo.
                </span>

              </label>


              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >
                {loading
                  ? "Kreyasyon kont..."
                  : "Kreye kont"}
              </button>

            </form>


            <div className="register-login">

              <span>
                Ou deja gen yon kont?
              </span>

              <button
                type="button"
                onClick={onSwitchToLogin}
              >
                Konekte
              </button>

            </div>

          </>

        )}

      </div>

    </div>
  );
};

export default RegisterModal;
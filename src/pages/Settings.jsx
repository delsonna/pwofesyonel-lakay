
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Settings.css";
import { supabase } from "../lib/supabase";

function Settings() {
  const [notifications, setNotifications] = useState(true);

  // ==============================
  // PASSWORD
  // ==============================
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // ==============================
  // OPEN MODAL
  // ==============================
  const openPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess("");
    setShowPasswordModal(true);
  };

  // ==============================
  // CLOSE MODAL
  // ==============================
  const closePasswordModal = () => {
    if (passwordLoading) return;

    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  // ==============================
  // CHANGE PASSWORD
  // ==============================
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Tanpri ranpli tout chan yo.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "Nouvo modpas la dwe genyen omwen 6 karaktè."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "Konfimasyon nouvo modpas la pa menm ak nouvo modpas la."
      );
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "Nouvo modpas la dwe diferan ak ansyen modpas la."
      );
      return;
    }

    setPasswordLoading(true);

    try {
      // ==============================
      // 1. GET CURRENT USER
      // ==============================
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        throw new Error(
          "Nou pa jwenn enfòmasyon sou kont ou."
        );
      }

      // ==============================
      // 2. VERIFY OLD PASSWORD
      // ==============================
      const { error: verifyError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

      if (verifyError) {
        throw new Error(
          "Ansyen modpas la pa kòrèk."
        );
      }

      // ==============================
      // 3. UPDATE PASSWORD
      // ==============================
      const { error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        throw new Error(
          updateError.message ||
            "Nou pa kapab chanje modpas la kounye a."
        );
      }

      // ==============================
      // 4. SUCCESS
      // ==============================
      setPasswordSuccess(
        "Modpas ou chanje avèk siksè."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 1800);

    } catch (error) {
      setPasswordError(
        error.message ||
          "Yon pwoblèm rive pandan chanjman modpas la."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="settings-page">

      <div className="settings-container">

        <Link to="/" className="settings-back">
          ← Retounen
        </Link>

        <div className="settings-header">
          <div className="settings-icon">⚙️</div>

          <div>
            <h1>Paramèt</h1>
            <p>
              Jere preferans ak kont ou sou Pwofesyonèl Lakay.
            </p>
          </div>
        </div>

        <div className="settings-card">

          {/* =========================
              SEKIRITE
          ========================== */}
          <div className="settings-section">

            <div className="section-title">
              <span>🔐</span>

              <div>
                <h2>Sekirite</h2>
                <p>
                  Pwoteje epi jere aksè kont ou.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="settings-row"
              onClick={openPasswordModal}
            >
              <span>Chanje modpas</span>
              <span>›</span>
            </button>

          </div>

          <div className="settings-divider" />

          {/* =========================
              NOTIFIKASYON
          ========================== */}
          <div className="settings-section">

            <div className="section-title">
              <span>🔔</span>

              <div>
                <h2>Notifikasyon</h2>
                <p>
                  Chwazi kijan ou vle resevwa enfòmasyon.
                </p>
              </div>
            </div>

            <div className="settings-row">
              <div>
                <strong>Notifikasyon</strong>

                <small>
                  Resevwa nouvèl ak enfòmasyon enpòtan.
                </small>
              </div>

              <button
                type="button"
                className={`toggle ${
                  notifications ? "active" : ""
                }`}
                onClick={() =>
                  setNotifications(!notifications)
                }
                aria-label="Aktive oswa dezaktive notifikasyon"
              >
                <span />
              </button>
            </div>

          </div>

          <div className="settings-divider" />

          {/* =========================
              LANG
          ========================== */}
          <div className="settings-section">

            <div className="section-title">
              <span>🌐</span>

              <div>
                <h2>Lang</h2>
                <p>
                  Chwazi lang ou prefere itilize.
                </p>
              </div>
            </div>

            <div className="language-options">

              <button
                type="button"
                className="language-option active"
              >
                Kreyòl Ayisyen
              </button>

              <button
                type="button"
                className="language-option"
              >
                Français
              </button>

              <button
                type="button"
                className="language-option"
              >
                English
              </button>

            </div>

          </div>

          <div className="settings-divider" />

          {/* =========================
              KONFIDANSYALITE
          ========================== */}
          <div className="settings-section">

            <div className="section-title">
              <span>🛡️</span>

              <div>
                <h2>Konfidansyalite</h2>
                <p>
                  Kontwole enfòmasyon ak vi prive kont ou.
                </p>
              </div>
            </div>

            <Link
              to="/privacy"
              className="settings-row"
            >
              <span>Règleman konfidansyalite</span>
              <span>›</span>
            </Link>

            <Link
              to="/terms"
              className="settings-row"
            >
              <span>Kondisyon itilizasyon</span>
              <span>›</span>
            </Link>

          </div>

          <div className="settings-divider" />

          {/* =========================
              JESYON KONT
          ========================== */}
          <div className="settings-section danger-section">

            <div className="section-title">
              <span>🗑️</span>

              <div>
                <h2>Jesyon kont</h2>
                <p>
                  Opsyon ki gen rapò ak kont ou.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="delete-account"
            >
              Efase kont mwen
            </button>

          </div>

        </div>

        <div className="settings-footer">
          <strong>Pwofesyonèl Lakay</strong>
          <span>© 2026 — Tout dwa rezève.</span>
        </div>

      </div>

      {/* =========================
          CHANJE MODPAS MODAL
      ========================== */}
      {showPasswordModal && (
        <div
          className="password-modal-overlay"
          onClick={closePasswordModal}
        >
          <div
            className="password-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              type="button"
              className="password-modal-close"
              onClick={closePasswordModal}
              disabled={passwordLoading}
              aria-label="Fèmen"
            >
              ×
            </button>

            <div className="password-modal-icon">
              🔐
            </div>

            <h2>Chanje modpas</h2>

            <p className="password-modal-description">
              Pou sekirite kont ou, antre ansyen modpas
              ou epi chwazi yon nouvo modpas.
            </p>

            {passwordError && (
              <div className="password-message error">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="password-message success">
                ✓ {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword}>

              <div className="password-field">
                <label htmlFor="current-password">
                  Ansyen modpas
                </label>

                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  placeholder="Antre ansyen modpas la"
                  autoComplete="current-password"
                  disabled={passwordLoading}
                />
              </div>

              <div className="password-field">
                <label htmlFor="new-password">
                  Nouvo modpas
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Antre nouvo modpas la"
                  autoComplete="new-password"
                  disabled={passwordLoading}
                />
              </div>

              <div className="password-field">
                <label htmlFor="confirm-password">
                  Konfime nouvo modpas
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Repete nouvo modpas la"
                  autoComplete="new-password"
                  disabled={passwordLoading}
                />
              </div>

              <button
                type="submit"
                className="password-submit"
                disabled={passwordLoading}
              >
                {passwordLoading
                  ? "Tanpri tann..."
                  : "Chanje modpas"}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Settings;

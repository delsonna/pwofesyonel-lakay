
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* ================= BRAND ================= */}
        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            <span className="footer-logo-mark">PL</span>

            <span className="footer-logo-name">
              Pwofesyonèl <strong>Lakay</strong>
            </span>
          </Link>

          <p className="footer-description">
            Konekte ak pwofesyonèl serye toupre ou,
            rapidman ak fasilite.
          </p>

          <div className="footer-socials">

            <a href="#" aria-label="Facebook">
              f
            </a>

            <a href="#" aria-label="LinkedIn">
              in
            </a>

            <a href="#" aria-label="Instagram">
              ig
            </a>

            <a href="#" aria-label="X">
              𝕏
            </a>

          </div>

        </div>


        {/* ================= EXPLORE ================= */}
        <div className="footer-column">

          <h3>Eksplore</h3>

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

        </div>


        {/* ================= SERVICES ================= */}
        <div className="footer-column">

          <h3>Sèvis popilè</h3>

          <Link to="/professionals?service=Plonbye">
            Plonbye
          </Link>

          <Link to="/professionals?service=Elektrisyen">
            Elektrisyen
          </Link>

          <Link to="/professionals?service=Mekanisyen">
            Mekanisyen
          </Link>

          <Link to="/professionals?service=Pent">
            Pent
          </Link>

        </div>


        {/* ================= CONTACT ================= */}
        <div className="footer-column footer-contact">

          <h3>Kontakte nou</h3>

          <div className="contact-item">
            <span className="contact-symbol">⌖</span>
            <span>Port-au-Prince, Haïti</span>
          </div>

          <div className="contact-item">
            <span className="contact-symbol">◉</span>
            <span>+509 4041-0034</span>
          </div>

          <div className="contact-item">
            <span className="contact-symbol">@</span>
            <span>delsonnasony7@gmail.com</span>
          </div>

        </div>

      </div>


      {/* ================= BOTTOM ================= */}
      <div className="footer-bottom">

        <p>
          © 2026 Pwofesyonèl Lakay. Tout dwa rezève.
        </p>

        <div className="footer-legal">

          <Link to="/privacy">
            Konfidansyalite
          </Link>

          <span className="footer-divider">•</span>

          <Link to="/terms">
            Kondisyon
          </Link>

        </div>

      </div>

    </footer>
  );
};

export default Footer;

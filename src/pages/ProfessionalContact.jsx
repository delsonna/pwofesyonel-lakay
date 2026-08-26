import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProfessionalContact.css";
import { supabase } from "../lib/supabase";

const ProfessionalContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfessional = async () => {
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        setError("Pwofesyonèl sa a pa jwenn.");
      } else {
        setProfessional(data);
      }

      setLoading(false);
    };

    fetchProfessional();
  }, [id]);

  if (loading) {
    return (
      <main className="professional-contact">
        <div className="contact-professional-container">
          <div className="contact-professional-header">
            <h1>Ap chaje...</h1>
            <p>
              Tanpri tann pandan n ap chèche enfòmasyon
              pwofesyonèl la.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !professional) {
    return (
      <main className="professional-contact">
        <div className="contact-professional-container">

          <button
            className="back-button"
            onClick={() => navigate("/professionals")}
          >
            ←
          </button>

          <div className="contact-professional-header">
            <h1>Pwofesyonèl sa a pa jwenn</h1>
            <p>
              Pwofil ou ap chèche a pa disponib.
            </p>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="professional-contact">

      <div className="contact-professional-container">

        <button
          className="back-button"
          onClick={() => navigate(`/professional/${id}`)}
        >
          ←
        </button>

        <div className="contact-professional-header">

          <span>CONTACT PWOFESYONÈL</span>

          <h1>Kontakte pwofesyonèl la</h1>

          <p>
            Jwenn tout enfòmasyon ou bezwen pou kontakte
            pwofesyonèl ou chwazi a.
          </p>

        </div>

        <div className="professional-contact-card">

          {/* PROFILE */}

          <div className="contact-profile">

            <div className="contact-profile-avatar">

              {professional.image ? (
                <img
                  src={professional.image}
                  alt={professional.name}
                />
              ) : (
                <span>👤</span>
              )}

            </div>

            <div className="contact-profile-info">

              <span className="contact-status">
                ● Disponib kounye a
              </span>

              <h2>{professional.name}</h2>

              <p className="contact-profession">
                {professional.profession}
              </p>

              <p className="contact-location">
                📍 {professional.location}
              </p>

              <div className="contact-rating">
                ★★★★★
                <span>{professional.rating}</span>
              </div>

            </div>

          </div>

          {/* CONTACT INFORMATION */}

          <div className="contact-information">

            <h3>
              Enfòmasyon pou kontakte li
            </h3>

            <div className="contact-info-grid">

              <div className="contact-info-item">
                <span>👤</span>

                <div>
                  <small>Non</small>
                  <strong>
                    {professional.first_name || "—"}
                  </strong>
                </div>
              </div>

              <div className="contact-info-item">
                <span>👤</span>

                <div>
                  <small>Prenon</small>
                  <strong>
                    {professional.last_name || "—"}
                  </strong>
                </div>
              </div>

              <div className="contact-info-item">
                <span>📞</span>

                <div>
                  <small>Telefòn</small>
                  <strong>
                    {professional.phone || "—"}
                  </strong>
                </div>
              </div>

              <div className="contact-info-item">
                <span>✉️</span>

                <div>
                  <small>Email</small>
                  <strong>
                    {professional.email || "—"}
                  </strong>
                </div>
              </div>

              <div className="contact-info-item">
                <span>💬</span>

                <div>
                  <small>WhatsApp</small>
                  <strong>
                    {professional.whatsapp || "—"}
                  </strong>
                </div>
              </div>

              <div className="contact-info-item">
                <span>📍</span>

                <div>
                  <small>Zòn sèvis</small>
                  <strong>
                    {professional.location || "—"}
                  </strong>
                </div>
              </div>

            </div>

          </div>

          {/* TRUST MESSAGE */}

          <div className="contact-message">

            <div className="contact-message-icon">
              🤝
            </div>

            <div>

              <h3>
                Mèsi paske w fè nou konfyans.
              </h3>

              <p>
                Pwofesyonèl Lakay la pou ede w jwenn
                pwofesyonèl serye toupre ou. Nou espere
                ou jwenn bon moun nan pou sèvis ou bezwen an.
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
};

export default ProfessionalContact;
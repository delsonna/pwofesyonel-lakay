import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProfessionalProfile.css";
import ReviewSection from "../components/ReviewSection";
import { supabase } from "../lib/supabase";

const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfessional = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        setError(error.message);
        setProfessional(null);
      } else {
        setProfessional(data);
      }

      setLoading(false);
    };

    fetchProfessional();
  }, [id]);

  // AP CHAJE
  if (loading) {
    return (
      <main className="professional-profile">
        <div className="profile-container">

          <div className="profile-arrows">
            <button
              className="profile-arrow"
              onClick={() => navigate("/professionals")}
              aria-label="Retounen"
            >
              ←
            </button>
          </div>

          <div className="profile-content">
            <h1>
              Ap chaje pwofil la...
            </h1>

            <p>
              Tanpri tann yon ti moman.
            </p>
          </div>

        </div>
      </main>
    );
  }

  // ERÈ / PWOFESYONÈL PA JWENN
  if (!professional) {
    return (
      <main className="professional-profile">
        <div className="profile-container">

          <div className="profile-arrows">
            <button
              className="profile-arrow"
              onClick={() => navigate("/professionals")}
              aria-label="Retounen"
            >
              ←
            </button>
          </div>

          <div className="profile-content">

            <h1>
              Pwofesyonèl sa a pa jwenn
            </h1>

            <p>
              Pwofil ou ap chèche a pa disponib.
            </p>

            {error && (
              <p>
                Erè: {error}
              </p>
            )}

            <button
              className="contact-professional-btn"
              onClick={() => navigate("/professionals")}
            >
              Gade tout pwofesyonèl
            </button>

          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="professional-profile">

      <div className="profile-container">

        {/* BACK BUTTON */}
        <div className="profile-arrows">

          <button
            className="profile-arrow"
            onClick={() => navigate("/professionals")}
            aria-label="Retounen"
          >
            ←
          </button>

        </div>


        {/* PROFILE HEADER */}
        <div className="profile-header">

          <div className="profile-avatar">

            {professional.image ? (
              <img
                src={professional.image}
                alt={professional.name}
              />
            ) : (
              <div className="profile-avatar-placeholder">
                👤
              </div>
            )}

          </div>


          <div className="profile-main-info">

            <span className="profile-status">
              ● Disponib kounye a
            </span>

            <h1>
              {professional.name}
            </h1>

            <p className="profile-profession">
              {professional.profession}
            </p>

            <p className="profile-location">
              📍 {professional.location}
            </p>

            <div className="profile-rating">
              ★★★★★

              <span>
                {professional.rating}
              </span>
            </div>

          </div>

        </div>


        {/* PROFILE CONTENT */}
        <div className="profile-content">

          {/* ABOUT */}
          <section className="profile-about">

            <h2>
              Tout sa ou dwe konnen de{" "}
              {professional.name}
            </h2>

            <p>
              {professional.description ||
                "Enfòmasyon sou pwofesyonèl sa a ap disponib byento."}
            </p>

          </section>


          {/* SERVICES */}
          <section className="profile-services">

            <h2>
              Sèvis mwen yo
            </h2>

            {Array.isArray(professional.services) &&
            professional.services.length > 0 ? (

              <ul>
                {professional.services.map(
                  (service, index) => (
                    <li key={index}>
                      {service}
                    </li>
                  )
                )}
              </ul>

            ) : (

              <p>
                Lis sèvis pwofesyonèl sa a ap disponib
                byento.
              </p>

            )}

          </section>


          {/* CONTACT BUTTON */}
          <button
            className="contact-professional-btn"
            onClick={() =>
              navigate(
                `/professional/${professional.id}/contact`
              )
            }
          >
            Kontakte {professional.name}
          </button>

        </div>


        {/* REVIEWS */}
        <ReviewSection />

      </div>

    </main>
  );
};

export default ProfessionalProfile;
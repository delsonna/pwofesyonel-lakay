
import "./Home.css";
import Navbar from "../components/Navbar";
import ProfessionalCard from "../components/ProfessionalCard";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const Home = () => {
  const navigate = useNavigate();

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pwofesyonèl ki ap parèt nan Hero card la
  const [heroIndex, setHeroIndex] = useState(0);

  // Efè fade lè pwofesyonèl la chanje
  const [heroChanging, setHeroChanging] = useState(false);

  // =====================================================
  // NORMALIZE NON PWOFESYON / SÈVIS
  // =====================================================
  const normalizeService = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // =====================================================
  // KATEGORI POPILÈ YO
  // =====================================================
  const categories = [
    {
      icon: "🔧",
      name: "Plonbye",
      service: "Plonbye",
    },
    {
      icon: "⚡",
      name: "Elektrisyen",
      service: "Elektrisyen",
    },
    {
      icon: "🚗",
      name: "Mekanisyen",
      service: "Mekanisyen",
    },
    {
      icon: "🎨",
      name: "Pent",
      service: "Pent",
    },
    {
      icon: "🧱",
      name: "Mason",
      service: "Mason",
    },
    {
      icon: "💻",
      name: "Enfòmatik",
      service: "Enfòmatik",
    },
  ];

  // =====================================================
  // CHAJE PWOFESYONÈL YO SOTI SUPABASE
  // =====================================================
  useEffect(() => {
    let mounted = true;

    const fetchProfessionals = async () => {
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);

        if (mounted) {
          setProfessionals([]);
          setLoading(false);
        }

        return;
      }

      if (mounted) {
        const professionalList = data || [];

        setProfessionals(professionalList);
        setLoading(false);

        // Si nouvo lis la pi kout pase index aktyèl la,
        // nou retounen sou premye pwofesyonèl la.
        setHeroIndex((currentIndex) => {
          if (professionalList.length === 0) {
            return 0;
          }

          return currentIndex >= professionalList.length
            ? 0
            : currentIndex;
        });
      }
    };

    // Premye chajman
    fetchProfessionals();

    // ===================================================
    // SUPABASE REALTIME
    // ===================================================
    const channel = supabase
      .channel("home-professionals")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "professionals",
        },
        () => {
          fetchProfessionals();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // =====================================================
  // CHANJE HERO PROFESSIONAL CHAK 6 SEGOND
  // =====================================================
  useEffect(() => {
    if (professionals.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      // Kòmanse fade
      setHeroChanging(true);

      // Apre ti moman fade la, chanje pwofesyonèl la
      setTimeout(() => {
        setHeroIndex((currentIndex) => {
          return (currentIndex + 1) % professionals.length;
        });

        setHeroChanging(false);
      }, 350);
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [professionals.length]);

  // =====================================================
  // KONTE PWOFESYONÈL PA KATEGORI
  // =====================================================
  const getProfessionalCount = (service) => {
    const normalizedService = normalizeService(service);

    return professionals.filter(
      (professional) =>
        normalizeService(professional.profession) === normalizedService
    ).length;
  };

  // =====================================================
  // PROFESSIONAL POU HERO
  // =====================================================
  const heroProfessional = professionals[heroIndex];

  // =====================================================
  // 3 PWOFESYONÈL REKÒMANDE
  // =====================================================
  const recommendedProfessionals = professionals.slice(0, 3);

  return (
    <>
      <Navbar />

      <main className="home">

        {/* =====================================================
            HERO SECTION
        ===================================================== */}
        <section className="hero">

          <div className="hero-container">

            <div className="hero-content">

              <span className="hero-badge">
                <h4>* Sèvis pwofesyonèl toupre ou</h4>
              </span>

              <h1>
                Jwenn bon
                <span> pwofesyonèl la</span>
                <br />
                toupre lakay ou.
              </h1>

              
<p className="hero-description">
  Pwofesyonèl Lakay konekte w ak teknisyen ak pwofesyonèl
  serye nan zòn ou an. Chèche sèvis ou bezwen an fasil,
  rapid epi san tèt chaje.
</p>

<p className="hero-guide">
  Anvan ou kontakte yon pwofesyonèl, ou ka ale nan seksyon
  Kategori a pou dekouvri tout sèvis ki disponib sou
  platfòm lan. Chwazi kategori ki enterese w la, gade
  pwofesyonèl ki disponib yo, epi vizite pwofil yo pou
  jwenn plis enfòmasyon sou sèvis yo. Si ou se yon
  pwofesyonèl epi ou vle ofri sèvis ou sou Pwofesyonèl
  Lakay, ale sou pwofil ou epi chwazi bouton
  <strong> Enskri kòm pwofesyonèl</strong>. Apre sa,
  swiv etap yo pou ranpli enfòmasyon ou yo epi mete
  pwofil ou disponib sou platfòm lan.
</p>

              <div className="hero-buttons">

                <button
                  className="primary-btn"
                  onClick={() => navigate("/professionals")}
                >
                  Jwenn yon pwofesyonèl
                </button>

                <button
                  className="secondary-btn"
                  onClick={() => navigate("/about")}
                >
                  Sou nou
                </button>

              </div>

            </div>

            {/* =====================================================
                HERO PROFESSIONAL CARD
            ===================================================== */}
            <div className="hero-visual">

              <div
                className={`hero-card ${
                  heroChanging ? "hero-card-changing" : ""
                }`}
              >

                <div className="hero-card-top">
                  <span className="status-dot"></span>
                  Disponib kounye a
                </div>

                {loading ? (

                  <div className="professional-avatar">
                    👨🏾‍🔧
                  </div>

                ) : heroProfessional ? (

                  <div className="hero-professional-content">

                    <div className="professional-avatar">

                      {heroProfessional.image ? (
                        <img
                          src={heroProfessional.image}
                          alt={heroProfessional.name}
                        />
                      ) : (
                        "👨🏾‍🔧"
                      )}

                    </div>

                    <h3>
                      {heroProfessional.name}
                    </h3>

                    <p>
                      {heroProfessional.profession}
                    </p>

                    <div className="rating">
                      ★★★★★
                      <span>
                        {heroProfessional.rating ?? 0}
                      </span>
                    </div>

                    <div className="location">
                      📍 {heroProfessional.location}
                    </div>

                    <button
                      className="profile-btn"
                      onClick={() =>
                        navigate(
                          `/professional/${heroProfessional.id}`
                        )
                      }
                    >
                      Gade pwofil
                    </button>

                  </div>

                ) : (

                  <>

                    <div className="professional-avatar">
                      👨🏾‍🔧
                    </div>

                    <h3>
                      Pwofesyonèl Lakay
                    </h3>

                    <p>
                      Pwofesyonèl disponib
                    </p>

                  </>

                )}

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            SEARCH SECTION
        ===================================================== */}
        <section className="search-section">

          <div className="search-container">

            <div className="search-heading">

              <span>
                JWENN YON PWOFESYONÈL
              </span>

              <h2>
                Ki sèvis ou bezwen?
              </h2>

              <p>
                Tape sèvis la ak zòn ou ye a pou jwenn
                pwofesyonèl ki toupre ou.
              </p>

            </div>

            <div className="search-box">

              <div className="search-field">

                <span className="search-icon">
                  🔧
                </span>

                <div>

                  <small>
                    Sèvis
                  </small>

                  <input
                    type="text"
                    placeholder="Tape sèvis ou bezwen..."
                  />

                </div>

              </div>

              <div className="search-divider"></div>

              <div className="search-field">

                <span className="search-icon">
                  📍
                </span>

                <div>

                  <small>
                    Zòn
                  </small>

                  <input
                    type="text"
                    placeholder="Tape zòn ou..."
                  />

                </div>

              </div>

              <button
                className="search-btn"
                onClick={() => navigate("/professionals")}
              >
                🔍 Chèche
              </button>

            </div>

          </div>

        </section>


        {/* =====================================================
            CATEGORIES SECTION
        ===================================================== */}
        <section className="categories-section">

          <div className="section-container">

            <div className="section-heading">

              <div>

                <span>
                  DOMÈN POPILÈ
                </span>

                <h2>
                  Ki sèvis ou bezwen?
                </h2>

              </div>

              <button
                className="view-all-btn"
                onClick={() => navigate("/categories")}
              >
                Gade tout →
              </button>

            </div>

            <div className="categories-grid">

              {categories.map((category) => {

                const count = getProfessionalCount(
                  category.service
                );

                return (
                  <div
                    className="category-card"
                    key={category.service}
                    onClick={() =>
                      navigate(
                        `/professionals?service=${encodeURIComponent(
                          category.service
                        )}`
                      )
                    }
                  >

                    <div className="category-icon">
                      {category.icon}
                    </div>

                    <h3>
                      {category.name}
                    </h3>

                    <p className="category-count">
                      {loading
                        ? "..."
                        : `${count} pwofesyonèl`}
                    </p>

                    <button
                      type="button"
                      className="category-professionals-btn"
                      onClick={(e) => {
                        e.stopPropagation();

                        navigate(
                          `/professionals?service=${encodeURIComponent(
                            category.service
                          )}`
                        );
                      }}
                    >
                      Gade pwofesyonèl
                      <span>→</span>
                    </button>

                  </div>
                );
              })}

            </div>

          </div>

        </section>


        {/* =====================================================
            PROFESSIONALS SECTION
        ===================================================== */}
        <section className="professionals-section">

          <div className="section-container">

            <div className="section-heading">

              <div>

                <span>
                  PROFESYONÈL REKÒMANDE
                </span>

                <h2>
                  Moun ou ka fè konfyans
                </h2>

              </div>

              <button
                className="view-all-btn"
                onClick={() => navigate("/professionals")}
              >
                Gade tout →
              </button>

            </div>

            <div className="professionals-grid">

              {loading ? (

                <p>
                  Ap chaje pwofesyonèl yo...
                </p>

              ) : recommendedProfessionals.length > 0 ? (

                recommendedProfessionals.map((professional) => (

                  <ProfessionalCard
                    key={professional.id}
                    id={professional.id}
                    name={professional.name}
                    profession={professional.profession}
                    location={professional.location}
                    rating={professional.rating}
                    image={professional.image}
                  />

                ))

              ) : (

                <p>
                  Pa gen pwofesyonèl disponib pou kounye a.
                </p>

              )}

            </div>

          </div>

        </section>


        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}
        <section className="how-section">

          <div className="section-container">

            <div className="center-heading">

              <span>
                FASIL EPI RAPID
              </span>

              <h2>
                Kijan Pwofesyonèl Lakay mache?
              </h2>

              <p>
                Nan kèk etap sèlman, ou ka jwenn moun ki kapab
                ede w ak sèvis ou bezwen an.
              </p>

            </div>

            <div className="steps">

              <div className="step">

                <div className="step-number">
                  01
                </div>

                <h3>
                  Chèche sèvis ou
                </h3>

                <p>
                  Chwazi sèvis ou bezwen an epi antre zòn kote
                  ou ye a.
                </p>

              </div>

              <div className="step">

                <div className="step-number">
                  02
                </div>

                <h3>
                  Chwazi pwofesyonèl
                </h3>

                <p>
                  Konpare pwofesyonèl yo, gade pwofil yo,
                  eksperyans ak evalyasyon yo.
                </p>

              </div>

              <div className="step">

                <div className="step-number">
                  03
                </div>

                <h3>
                  Kontakte li
                </h3>

                <p>
                  Kontakte pwofesyonèl ou chwazi a epi
                  òganize sèvis la.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default Home;

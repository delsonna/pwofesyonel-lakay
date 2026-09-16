
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfessionalCard from "../components/ProfessionalCard";
import { supabase } from "../lib/supabase";
import "./Professionals.css";

const Professionals = () => {
  const [searchParams] = useSearchParams();

  const selectedService = searchParams.get("service") || "";

  const [service, setService] = useState(selectedService);
  const [location, setLocation] = useState("");

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // PAGINATION
  // =========================================

  const PROFESSIONALS_PER_PAGE = 9;

  const [currentPage, setCurrentPage] = useState(1);

  // =========================================
  // CHAJЕ PWOFESYONÈL YO SOTI NAN SUPABASE
  // =========================================

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("professionals")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
        setError(error.message);
      } else {
        setProfessionals(data || []);
      }

      setLoading(false);
    };

    fetchProfessionals();
  }, []);

  // =========================================
  // FILTRE PWOFESYONÈL YO
  // =========================================

  const filteredProfessionals = professionals.filter((professional) => {
    const matchesService =
      service.trim() === "" ||
      professional.profession
        ?.toLowerCase()
        .includes(service.toLowerCase());

    const matchesLocation =
      location.trim() === "" ||
      professional.location
        ?.toLowerCase()
        .includes(location.toLowerCase());

    return matchesService && matchesLocation;
  });

  // =========================================
  // TOTAL PAJ YO
  // =========================================

  const totalPages = Math.ceil(
    filteredProfessionals.length / PROFESSIONALS_PER_PAGE
  );

  // =========================================
  // SI FILTÈ YO CHANJE
  // RETOUNEN SOU PAJ 1
  // =========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [service, location]);

  // =========================================
  // PWOFESYONÈL POU PAJ AKTYÈL LA
  // =========================================

  const startIndex =
    (currentPage - 1) * PROFESSIONALS_PER_PAGE;

  const endIndex =
    startIndex + PROFESSIONALS_PER_PAGE;

  const currentProfessionals =
    filteredProfessionals.slice(startIndex, endIndex);

  // =========================================
  // CHANJE PAJ
  // =========================================

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    // Retounen anlè lis pwofesyonèl yo
    setTimeout(() => {
      const listSection = document.querySelector(
        ".professionals-list-section"
      );

      if (listSection) {
        listSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);
  };

  return (
    <>
      <Navbar />

      <main className="professionals-page">

        {/* =========================================
            PAGE HEADER
        ========================================= */}

        <section className="professionals-header">

          <div className="professionals-header-content">

            <span className="page-label"></span>

            <h1>
              Jwenn pwofesyonèl
              <span> ou bezwen an</span>
            </h1>

            <p>
              Chèche teknisyen ak pwofesyonèl serye
              selon sèvis ak zòn ou.
            </p>

          </div>

        </section>


        {/* =========================================
            SEARCH
        ========================================= */}

        <section className="professionals-search">

          <div className="professionals-search-container">

            <div className="professional-search-field">

              <span>🔧</span>

              <div>

                <small>Sèvis</small>

                <input
                  type="text"
                  placeholder="Tape sèvis ou bezwen..."
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                />

              </div>

            </div>


            <div className="professional-search-field">

              <span>📍</span>

              <div>

                <small>Zòn</small>

                <input
                  type="text"
                  placeholder="Tape zòn ou..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />

              </div>

            </div>


            <button className="professional-search-btn">
              Chèche
            </button>

          </div>

        </section>


        {/* =========================================
            PROFESSIONALS LIST
        ========================================= */}

        <section className="professionals-list-section">

          <div className="professionals-list-container">

            {/* LIST HEADER */}

            <div className="professionals-list-header">

              <div>

                <h2>
                  {service
                    ? `Pwofesyonèl ${service}`
                    : "Pwofesyonèl disponib"}
                </h2>

                <p>
                  {loading
                    ? "Ap chaje..."
                    : `${filteredProfessionals.length} pwofesyonèl jwenn`}
                </p>

              </div>


              <select className="sort-select">

                <option>
                  Pi rekòmande
                </option>

                <option>
                  Pi byen note
                </option>

                <option>
                  Pi pre mwen
                </option>

                <option>
                  Pi nouvo
                </option>

              </select>

            </div>


            {/* =========================================
                CARDS
            ========================================= */}

            <div className="professionals-page-grid">

              {loading ? (

                <div className="no-professionals">

                  <h3>
                    Ap chaje pwofesyonèl yo...
                  </h3>

                </div>

              ) : error ? (

                <div className="no-professionals">

                  <h3>
                    Erè pandan nap chaje pwofesyonèl yo.
                  </h3>

                  <p>
                    {error}
                  </p>

                </div>

              ) : currentProfessionals.length > 0 ? (

                currentProfessionals.map((professional) => (

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

                <div className="no-professionals">

                  <h3>
                    Pa gen pwofesyonèl pou sèvis sa a ankò.
                  </h3>

                  <p>
                    Eseye yon lòt sèvis oswa yon lòt zòn.
                  </p>

                </div>

              )}

            </div>


            {/* =========================================
                PAGINATION
            ========================================= */}

            {!loading &&
              !error &&
              filteredProfessionals.length > 0 &&
              totalPages > 1 && (

                <div className="professionals-pagination">

                  {/* PREVIOUS */}

                  <button
                    className="pagination-arrow"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Pwochen paj anvan"
                  >
                    ← <span>Anvan</span>
                  </button>


                  {/* PAGE NUMBERS */}

                  <div className="pagination-numbers">

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (

                      <button
                        key={page}
                        className={`pagination-number ${
                          currentPage === page
                            ? "active"
                            : ""
                        }`}
                        onClick={() => goToPage(page)}
                        aria-label={`Paj ${page}`}
                        aria-current={
                          currentPage === page
                            ? "page"
                            : undefined
                        }
                      >
                        {page}
                      </button>

                    ))}

                  </div>


                  {/* NEXT */}

                  <button
                    className="pagination-arrow"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Pwochen paj"
                  >
                    <span>Apre</span> →
                  </button>

                </div>

              )}


            {/* PAGINATION INFO */}

            {!loading &&
              !error &&
              filteredProfessionals.length > 0 &&
              totalPages > 1 && (

                <div className="pagination-info">

                  Paj {currentPage} sou {totalPages}

                </div>

              )}

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default Professionals;

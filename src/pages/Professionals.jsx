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

  // Chaje pwofesyonèl yo soti nan Supabase
  useEffect(() => {
    const fetchProfessionals = async () => {
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

  // Filtre pwofesyonèl yo
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

  return (
    <>
      <Navbar />

      <main className="professionals-page">

        {/* PAGE HEADER */}
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


        {/* SEARCH */}
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


        {/* PROFESSIONALS LIST */}
        <section className="professionals-list-section">

          <div className="professionals-list-container">

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


            {/* CARDS */}
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

              ) : filteredProfessionals.length > 0 ? (

                filteredProfessionals.map((professional) => (

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

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default Professionals;

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Categories.css";
import { supabase } from "../lib/supabase";

const Categories = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  ==========================================================
  KATEGORI YO
  ==========================================================
  */

  const categories = [
    {
      icon: "🏠",
      title: "Kay & Reparasyon",
      services: [
        "Plonbye",
        "Elektrisyen",
        "Mason",
        "Pent",
        "Menuizye",
        "Soudeur",
        "Platrè / Gypsum",
        "Mozayik",
        "Roofing / Toiture",
        "Pòt & Fenèt",
        "Klima",
        "Frijidè",
      ],
    },
    {
      icon: "🚗",
      title: "Otomobil & Transpò",
      services: [
        "Mekanisyen",
        "Elektrisyen oto",
        "Reparasyon moto",
        "Vulkanizatè",
        "Lave machin",
        "Remokaj",
        "Chofè prive",
        "Chofè livrezon",
      ],
    },
    {
      icon: "💻",
      title: "Teknoloji",
      services: [
        "Reparasyon òdinatè",
        "Reparasyon telefòn",
        "Kamera sekirite",
        "Network / Wi-Fi",
        "Web Designer",
        "Graphic Designer",
        "Digital Marketing",
        "Fotograf / Videograf",
      ],
    },
    {
      icon: "🧹",
      title: "Kay & Netwayaj",
      services: [
        "Netwayaj kay",
        "Netwayaj biwo",
        "Laundry",
        "Pest Control",
        "Jardinaj",
        "Landscaping",
        "Demenajman",
      ],
    },
    {
      icon: "💇🏽",
      title: "Bote & Swen pèsonèl",
      services: [
        "Kwafè",
        "Barber",
        "Makeup Artist",
        "Nail Technician",
        "Estetisyen",
        "Massage Therapist",
      ],
    },
    {
      icon: "🩺",
      title: "Sante & Swen",
      services: [
        "Enfimyè",
        "Caregiver",
        "Home Health Aide",
        "Physiotherapist",
        "Swen granmoun",
      ],
    },
    {
      icon: "📚",
      title: "Edikasyon",
      services: [
        "Pwofesè",
        "Tutor",
        "Pwofesè lang",
        "Pwofesè mizik",
        "Pwofesè òdinatè",
        "Preparasyon egzamen",
      ],
    },
    {
      icon: "📦",
      title: "Biznis & Sèvis",
      services: [
        "Livrezon",
        "Courier",
        "Kontab",
        "Tradiktè",
        "Administratif",
        "Konsiltan biznis",
        "Event Planner",
      ],
    },
    {
      icon: "🎉",
      title: "Evènman",
      services: [
        "Fotograf",
        "Videograf",
        "DJ",
        "Mizisyen",
        "Dekoratè",
        "Catering",
        "Event Planner",
        "Sonorisation",
      ],
    },
    {
      icon: "🔨",
      title: "Travay espesyalize",
      services: [
        "Locksmith / Serrurier",
        "Soudeur",
        "Glass Installer",
        "Generator Technician",
        "Solar Technician",
        "Security System Installer",
      ],
    },
    {
      icon: "✨",
      title: "Lòt sèvis",
      services: [
        "Sèvis mwen pa jwenn nan lis la",
      ],
    },
  ];

  /*
  ==========================================================
  NORMALIZE NON SÈVIS YO
  ==========================================================
  */

  const normalizeService = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  /*
  ==========================================================
  CHAJE PWOFESYONÈL YO
  ==========================================================
  */

  useEffect(() => {
    let mounted = true;

    const fetchProfessionals = async () => {
      try {
        const { data, error } = await supabase
          .from("professionals")
          .select("id, profession");

        if (error) {
          throw error;
        }

        if (mounted) {
          setProfessionals(data || []);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des professionnels:",
          error
        );

        if (mounted) {
          setProfessionals([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProfessionals();

    /*
    ========================================================
    SUPABASE REALTIME
    ========================================================
    */

    const channel = supabase
      .channel("categories-professionals-count")
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

  /*
  ==========================================================
  KONTE PWOFESYONÈL POU YON SÈVIS
  ==========================================================
  */

  const getProfessionalCount = (service) => {
    const normalizedService = normalizeService(service);

    return professionals.filter((professional) => {
      return (
        normalizeService(professional.profession) ===
        normalizedService
      );
    }).length;
  };

  /*
  ==========================================================
  KONTE TOTAL PWOFESYONÈL NAN YON GWO KATEGORI
  ==========================================================
  */

  const getCategoryTotal = (services) => {
    const serviceNames = new Set(
      services.map((service) => normalizeService(service))
    );

    return professionals.filter((professional) =>
      serviceNames.has(
        normalizeService(professional.profession)
      )
    ).length;
  };

  /*
  ==========================================================
  RENDER
  ==========================================================
  */

  return (
    <>
      <Navbar />

      <main className="categories-page">

        {/* HEADER */}
        <section className="categories-header">
          <div className="categories-header-content">

            <span className="page-label">
              PWOFESYONÈL LAKAY
            </span>

            <h1>
              Tout sèvis
              <span> nan yon sèl kote</span>
            </h1>

            <p>
              Chwazi kategori ki koresponn ak sèvis ou bezwen an
              epi jwenn pwofesyonèl ki kapab ede w.
            </p>

          </div>
        </section>


        {/* CATEGORIES */}
        <section className="categories-list-section">

          <div className="categories-container">

            <div className="categories-heading">

              <span>KATEGORI SÈVIS</span>

              <h2>
                Kisa ou bezwen fè?
              </h2>

              <p>
                Eksplore diferan kategori sèvis ki disponib
                sou Pwofesyonèl Lakay.
              </p>

            </div>


            <div className="categories-grid">

              {categories.map((category) => {

                const categoryTotal =
                  getCategoryTotal(category.services);

                return (
                  <div
                    className="category-large-card"
                    key={category.title}
                  >

                    <div className="category-card-icon">
                      {category.icon}
                    </div>


                    <div className="category-card-content">

                      <h3>
                        {category.title}
                      </h3>


                      <p>
                        {category.services.length} sèvis disponib
                        {" · "}
                        {loading
                          ? "..."
                          : `${categoryTotal} pwofesyonèl`}
                      </p>


                      <div className="services-list">

                        {category.services.map((service) => {

                          const count =
                            getProfessionalCount(service);

                          return (
                            <span
                              key={service}
                              title={`${count} pwofesyonèl`}
                            >
                              {service}

                              <strong
                                style={{
                                  marginLeft: "6px",
                                  fontWeight: "600",
                                }}
                              >
                                ({loading ? "..." : count})
                              </strong>
                            </span>
                          );
                        })}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default Categories;

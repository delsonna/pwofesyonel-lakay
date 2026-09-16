
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Categories.css";
import { supabase } from "../lib/supabase";

const Categories = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  ==========================================================
  KATEGORI BAZ YO
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
      services: [],
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
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  };

  /*
  ==========================================================
  DETÈMINE KATEGORI POU NOUVO METYE
  ==========================================================
  */

  const detectCategory = (profession) => {
    const normalized = normalizeService(profession);

    if (!normalized) {
      return "Lòt sèvis";
    }

    /*
    ----------------------------------------------------------
    EDIKASYON
    ----------------------------------------------------------
    */

    const educationKeywords = [
      "normalyen",
      "normalien",
      "profese",
      "professeur",
      "teacher",
      "tutor",
      "edikat",
      "education",
      "pedagog",
      "pedagoj",
      "lekòl",
      "lekol",
      "lang",
      "matematik",
      "fizik",
      "chimi",
      "literati",
      "istwa",
      "geografi",
      "ansenye",
      "ansèyman",
      "enseignement",
      "formate",
      "formateur",
      "instructeur",
    ];

    if (
      educationKeywords.some((keyword) =>
        normalized.includes(keyword)
      )
    ) {
      return "Edikasyon";
    }

    /*
    ----------------------------------------------------------
    TEKNOLOJI
    ----------------------------------------------------------
    */

    const technologyKeywords = [
      "informatik",
      "enformatik",
      "computer",
      "ordinateur",
      "telefon",
      "phone",
      "web",
      "developer",
      "developpeur",
      "program",
      "software",
      "logiciel",
      "network",
      "reseau",
      "wifi",
      "graphic",
      "designer",
      "digital",
      "cyber",
      "security",
      "it ",
      "technicien informatique",
    ];

    if (
      technologyKeywords.some((keyword) =>
        normalized.includes(keyword)
      )
    ) {
      return "Teknoloji";
    }

    /*
    ----------------------------------------------------------
    SANTE
    ----------------------------------------------------------
    */

    const healthKeywords = [
      "enfimy",
      "infirm",
      "caregiver",
      "health",
      "sante",
      "physio",
      "medecin",
      "dokte",
      "doctor",
      "pharmac",
      "terapis",
      "therap",
      "massage",
      "swen granmoun",
      "aide soignant",
    ];

    if (
      healthKeywords.some((keyword) =>
        normalized.includes(keyword)
      )
    ) {
      return "Sante & Swen";
    }

    /*
    ----------------------------------------------------------
    BOTE & SWEN PÈSONÈL
    ----------------------------------------------------------
    */

    const beautyKeywords = [
      "kwafe",
      "coiffe",
      "barber",
      "cheve",
      "makiyaj",
      "makeup",
      "nail",
      "ong",
      "estet",
      "beaut",
      "bote",
      "pediky",
      "maniky",
      "spa",
    ];

    if (
      beautyKeywords.some((keyword) =>
        normalized.includes(keyword)
      )
    ) {
      return "Bote & Swen pèsonèl";
    }

    /*
    ----------------------------------------------------------
    OTOMOBIL & TRANSPÒ
    ----------------------------------------------------------
    */

    const transportKeywords = [
      "mekanisyen",
      "mechanic",
      "oto",
      "automobile",
      "machin",
      "moto",
      "motoc",
      "vulkan",
      "pne",
      "remokaj",
      "tow",
      "chofe",
      "chauffeur",
      "livrezon",
      "delivery",
      "transp",
    ];

    if (
      transportKeywords.some((keyword) =>
        normalized.includes(keyword)
      )
    ) {
      return "Otomobil & Transpò";
    }

    /*
    ----------------------------------------------------------
    KAY & NETWAYAJ
    ----------------------------------------------------------
    */

    const cleaningKeywords = [
      "netway",
      "nettoyage",
      "clean",
      "laundry",
      "lesiv",
      "pest",
      "derat",
      "dezin",
      "jardin",
      "jardinya",
      "jardinaj",
      "landscape",
      "landscaping",
      "demenaj",
      "deménagement",
      "menaj",
      "housekeeping",
    ];

    if (
      cleaningKeywords.some((keyword) =>
        normalized.includes(keyword)
      )
    ) {
      return "Kay & Netwayaj";
    }

    /*
    ----------------------------------------------------------
    KAY & REPARASYON
    ----------------------------------------------------------
    */

    const homeRepairKeywords = [
      "plonbye",
      "plomberie",
      "elektrisyen",
      "electricien",
      "electric",
      "mason",
      "maçon",
      "pent",
      "peint",
      "menuiz",
      "charpent",
      "soude",
      "platre",
      "gypsum",
      "mozayik",
      "carrelage",
      "roofing",
      "toiture",
      "fenet",
      "porte",
      "klima",
      "climatisation",
      "frijide",
      "refriger",
      "reparasyon kay",
    ];

    if (
      homeRepairKeywords.some((keyword) =>
        normalized.includes(keyword)
      )
    ) {
      return "Kay & Reparasyon";
    }

    /*
    ----------------------------------------------------------
    BIZNIS & SÈVIS
    ----------------------------------------------------------
    */

    const businessKeywords = [
      "kontab",
      "comptable",
      "account",
      "tradik",
      "traduct",
      "administratif",
      "administration",
      "business",
      "biznis",
      "konsiltan",
      "consultant",
      "sekrete",
      "secretary",
      "courier",
      "livrezon",
    ];

    if (
      businessKeywords.some((keyword) =>
        normalized.includes(keyword)
      )
    ) {
      return "Biznis & Sèvis";
    }

    /*
    ----------------------------------------------------------
    EVÈNMAN
    ----------------------------------------------------------
    */

    const eventKeywords = [
      "fotograf",
      "photograph",
      "videograf",
      "videograph",
      "dj",
      "mizisyen",
      "musicien",
      "dekor",
      "catering",
      "traiteur",
      "event",
      "evènman",
      "evenman",
      "sonor",
      "wedding",
      "maryaj",
    ];

    if (
      eventKeywords.some((keyword) =>
        normalized.includes(keyword)
      )
    ) {
      return "Evènman";
    }

    /*
    ----------------------------------------------------------
    TRAVAY ESPESYALIZE
    ----------------------------------------------------------
    */

    const specializedKeywords = [
      "locksmith",
      "serrurier",
      "glass installer",
      "vit",
      "generator",
      "jenerat",
      "solar",
      "solè",
      "security system",
      "sistèm sekirite",
      "sekurite",
      "sikirite",
    ];

    if (
      specializedKeywords.some((keyword) =>
        normalized.includes(keyword)
      )
    ) {
      return "Travay espesyalize";
    }

    /*
    ----------------------------------------------------------
    SI NOU PA REKONÈT LI
    ----------------------------------------------------------
    */

    return "Lòt sèvis";
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
  KONSTWI DYNAMIC SERVICES YO
  ==========================================================
  */

  const dynamicCategories = useMemo(() => {
    /*
    Map pou evite menm metye a repete.
    */

    const existingServices = new Set();

    categories.forEach((category) => {
      category.services.forEach((service) => {
        existingServices.add(
          normalizeService(service)
        );
      });
    });

    /*
    Nou kreye yon kopi kategori yo.
    */

    const result = categories.map((category) => ({
      ...category,
      services: [...category.services],
    }));

    /*
    Chèche tout metye ki soti nan database la.
    */

    const dynamicServices = new Map();

    professionals.forEach((professional) => {
      const profession =
        String(
          professional?.profession || ""
        ).trim();

      if (!profession) return;

      const normalized =
        normalizeService(profession);

      /*
      Si metye a deja nan lis kategori yo,
      pa ajoute li ankò.
      */

      if (existingServices.has(normalized)) {
        return;
      }

      /*
      Si se yon nouvo metye, detèmine kategori li.
      */

      const categoryTitle =
        detectCategory(profession);

      if (!dynamicServices.has(categoryTitle)) {
        dynamicServices.set(
          categoryTitle,
          new Map()
        );
      }

      const categoryMap =
        dynamicServices.get(categoryTitle);

      if (!categoryMap.has(normalized)) {
        categoryMap.set(
          normalized,
          profession
        );
      }
    });

    /*
    Ajoute nouvo metye yo nan bon kategori a.
    */

    result.forEach((category) => {
      const categoryMap =
        dynamicServices.get(category.title);

      if (!categoryMap) return;

      categoryMap.forEach((profession) => {
        category.services.push(profession);
      });
    });

    return result;
  }, [professionals]);

  /*
  ==========================================================
  KONTE PWOFESYONÈL POU YON SÈVIS
  ==========================================================
  */

  const getProfessionalCount = (service) => {
    const normalizedService =
      normalizeService(service);

    return professionals.filter(
      (professional) =>
        normalizeService(
          professional.profession
        ) === normalizedService
    ).length;
  };

  /*
  ==========================================================
  KONTE TOTAL PWOFESYONÈL NAN YON KATEGORI
  ==========================================================
  */

  const getCategoryTotal = (services) => {
    const serviceNames = new Set(
      services.map((service) =>
        normalizeService(service)
      )
    );

    return professionals.filter((professional) =>
      serviceNames.has(
        normalizeService(
          professional.profession
        )
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
              Chwazi kategori ki koresponn ak sèvis ou
              bezwen an epi jwenn pwofesyonèl ki kapab
              ede w.
            </p>

          </div>

        </section>


        {/* CATEGORIES */}

        <section className="categories-list-section">

          <div className="categories-container">

            <div className="categories-heading">

              <span>
                KATEGORI SÈVIS
              </span>

              <h2>
                Kisa ou bezwen fè?
              </h2>

              <p>
                Eksplore diferan kategori sèvis ki
                disponib sou Pwofesyonèl Lakay.
              </p>

            </div>


            <div className="categories-grid">

              {dynamicCategories.map(
                (category) => {

                  const categoryTotal =
                    getCategoryTotal(
                      category.services
                    );

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
                          {category.services.length} sèvis
                          disponib
                          {" · "}
                          {loading
                            ? "..."
                            : `${categoryTotal} pwofesyonèl`}
                        </p>


                        <div className="services-list">

                          {category.services.map(
                            (service) => {

                              const count =
                                getProfessionalCount(
                                  service
                                );

                              return (
                                <span
                                  key={service}
                                  title={`${count} pwofesyonèl`}
                                >

                                  {service}

                                  <strong
                                    style={{
                                      marginLeft:
                                        "6px",
                                      fontWeight:
                                        "600",
                                    }}
                                  >
                                    (
                                    {loading
                                      ? "..."
                                      : count}
                                    )
                                  </strong>

                                </span>
                              );
                            }
                          )}

                          {/* 
                          ------------------------------------------------
                          MESAJ SI LÒT SÈVIS PA GEN OKENN METYE
                          ------------------------------------------------
                          */}

                          {category.title ===
                            "Lòt sèvis" &&
                            category.services.length ===
                              0 && (
                              <span>
                                Pa gen lòt sèvis
                                ajoute pou kounye a.
                              </span>
                            )}

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default Categories;

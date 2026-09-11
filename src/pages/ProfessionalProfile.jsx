import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProfessionalProfile.css";
import ReviewSection from "../components/ReviewSection";
import { supabase } from "../lib/supabase";

const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const fileInputRef = useRef(null);

  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changingPhoto, setChangingPhoto] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // FETCH PROFILE
  // =========================================

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        setLoading(true);
        setError("");

        // =====================================
        // 1. SI GEN ID → PROFILE PIBLIK
        // =====================================

        if (id) {
          const {
            data,
            error: profileError,
          } = await supabase
            .from("professionals")
            .select("*")
            .eq("id", id)
            .single();

          if (profileError) {
            console.error(
              "Supabase profile error:",
              profileError
            );

            setError(profileError.message);
            setProfessional(null);
            return;
          }

          setProfessional(data);
          return;
        }

        // =====================================
        // 2. SAN ID → MON PROFIL
        // =====================================

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw new Error(
            `Nou pa kapab verifye kont ou: ${userError.message}`
          );
        }

        if (!user) {
          throw new Error(
            "Ou dwe konekte pou wè profil ou."
          );
        }

        console.log("AUTH USER ID:", user.id);
        console.log("AUTH USER EMAIL:", user.email);

        const authEmail = user.email?.trim();

        if (!authEmail) {
          throw new Error(
            "Kont ou pa gen yon email ki asosye avè l."
          );
        }

        const {
          data,
          error: profileError,
        } = await supabase
          .from("professionals")
          .select("*")
          .ilike("email", authEmail)
          .limit(1)
          .maybeSingle();

        if (profileError) {
          console.error(
            "Own profile error:",
            profileError
          );

          throw new Error(
            `Nou pa kapab jwenn profil pwofesyonèl ou: ${profileError.message}`
          );
        }

        if (!data) {
          console.error(
            "Pa gen pwofil ki gen email sa:",
            authEmail
          );

          throw new Error(
            "Nou pa jwenn profil pwofesyonèl ki asosye ak kont ou."
          );
        }

        console.log(
          "OWN PROFESSIONAL PROFILE:",
          data
        );

        setProfessional(data);

      } catch (err) {
        console.error(
          "Fetch professional error:",
          err
        );

        setError(
          err?.message ||
            "Gen yon pwoblèm pandan pwofil la t ap chaje."
        );

        setProfessional(null);

      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  // =========================================
  // CHANGE PROFILE PHOTO
  // =========================================

  const handleChangePhoto = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Foto a dwe PNG, JPG oswa JPEG."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Foto a pa dwe depase 5 MB."
      );

      e.target.value = "";
      return;
    }

    try {
      setChangingPhoto(true);

      // =====================================
      // GET CURRENT USER
      // =====================================

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(
          userError.message
        );
      }

      if (!user) {
        throw new Error(
          "Ou dwe konekte pou chanje foto profil ou."
        );
      }

      if (!professional?.id) {
        throw new Error(
          "Nou pa jwenn ID pwofil pwofesyonèl la."
        );
      }

      // =====================================
      // CREATE UNIQUE FILE PATH
      // =====================================

      const fileExtension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const fileName =
        `profile-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}.${fileExtension}`;

      const filePath =
        `${user.id}/profile/${fileName}`;

      console.log(
        "NEW PROFILE PHOTO PATH:",
        filePath
      );

      // =====================================
      // UPLOAD NEW PHOTO
      // =====================================

      const {
        error: uploadError,
      } = await supabase.storage
        .from("professional-images")
        .upload(
          filePath,
          file,
          {
            cacheControl: "3600",
            upsert: false,
            contentType:
              file.type || "image/jpeg",
          }
        );

      if (uploadError) {
        console.error(
          "Profile photo upload error:",
          uploadError
        );

        throw new Error(
          `Foto a pa t ka upload: ${uploadError.message}`
        );
      }

      console.log(
        "PHOTO UPLOAD SUCCESS:",
        filePath
      );

      // =====================================
      // GET PUBLIC URL
      // =====================================

      const {
        data: publicImageData,
      } = supabase.storage
        .from("professional-images")
        .getPublicUrl(filePath);

      const newImageUrl =
        publicImageData?.publicUrl;

      if (!newImageUrl) {
        throw new Error(
          "Nou pa t kapab kreye URL nouvo foto a."
        );
      }

      console.log(
        "NEW IMAGE URL:",
        newImageUrl
      );

      // =====================================
      // UPDATE PROFESSIONAL
      // =====================================

      const {
        data: updatedRows,
        error: updateError,
      } = await supabase
        .from("professionals")
        .update({
          image: newImageUrl,
        })
        .eq("id", professional.id)
        .select("id, image");

      if (updateError) {
        console.error(
          "Professional photo update error:",
          updateError
        );

        throw new Error(
          `Foto a upload, men profil la pa t mete nouvo foto a: ${updateError.message}`
        );
      }

      // =====================================
      // VERIFY DATABASE UPDATE
      // =====================================

      if (
        !updatedRows ||
        updatedRows.length !== 1
      ) {
        console.error(
          "Supabase update returned:",
          updatedRows
        );

        throw new Error(
          "Foto a upload, men Supabase pa konfime mizajou pwofil la. Sa ka vle di policy UPDATE sou tab professionals la pa pèmèt kont sa modifye pwofil la."
        );
      }

      const updatedProfessional =
        updatedRows[0];

      console.log(
        "UPDATED PROFESSIONAL:",
        updatedProfessional
      );

      if (
        updatedProfessional.image !==
        newImageUrl
      ) {
        throw new Error(
          "Supabase pa retounen nouvo foto a apre mizajou."
        );
      }

      // =====================================
      // UPDATE SCREEN
      // =====================================

      setProfessional((current) => ({
        ...current,
        image: updatedProfessional.image,
      }));

      console.log(
        "PROFILE PHOTO UPDATED SUCCESSFULLY"
      );

    } catch (err) {
      console.error(
        "Change profile photo error:",
        err
      );

      setError(
        err?.message ||
          "Gen yon pwoblèm pandan foto a t ap chanje."
      );

    } finally {
      setChangingPhoto(false);

      e.target.value = "";
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="professional-profile">
        <div className="profile-container">

          <div className="profile-arrows">
            <button
              className="profile-arrow"
              onClick={() =>
                navigate("/professionals")
              }
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

  // =========================================
  // PROFILE NOT FOUND
  // =========================================

  if (!professional) {
    return (
      <main className="professional-profile">
        <div className="profile-container">

          <div className="profile-arrows">
            <button
              className="profile-arrow"
              onClick={() =>
                navigate("/professionals")
              }
              aria-label="Retounen"
            >
              ←
            </button>
          </div>

          <div className="profile-content">

            <h1>
              Pwofil la pa jwenn
            </h1>

            <p>
              {error ||
                "Pwofil pwofesyonèl sa a pa disponib."}
            </p>

            <button
              className="contact-professional-btn"
              onClick={() =>
                navigate("/professionals")
              }
            >
              Gade tout pwofesyonèl
            </button>

          </div>

        </div>
      </main>
    );
  }

  // =========================================
  // CHECK IF THIS IS OWN PROFILE
  // =========================================

  const isOwnProfile = !id;

  // =========================================
  // MAIN PROFILE
  // =========================================

  return (
    <main className="professional-profile">

      <div className="profile-container">

        {/* BACK BUTTON */}

        <div className="profile-arrows">

          <button
            className="profile-arrow"
            onClick={() =>
              navigate(
                isOwnProfile
                  ? "/"
                  : "/professionals"
              )
            }
            aria-label="Retounen"
          >
            ←
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="setup-error">
            {error}
          </div>
        )}

        {/* PROFILE HEADER */}

        <div className="profile-header">

          {/* PHOTO */}

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

            {/* CHANGE PHOTO */}

            {isOwnProfile && (
              <>
                <button
                  type="button"
                  className="change-profile-photo-btn"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={changingPhoto}
                >
                  {changingPhoto
                    ? "Ap chanje..."
                    : "📷 Chanje foto"}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleChangePhoto}
                  style={{
                    display: "none",
                  }}
                />
              </>
            )}

          </div>

          {/* MAIN INFO */}

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
                {professional.rating ?? 0}
              </span>
            </div>

          </div>

        </div>

        {/* OWN PROFILE ACTION */}

        {isOwnProfile && (
          <div className="own-profile-actions">

            <button
              type="button"
              className="contact-professional-btn"
              onClick={() =>
                navigate(
                  `/professional/${professional.id}/edit`
                )
              }
            >
              ✏️ Modifye profil
            </button>

          </div>
        )}

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

            {Array.isArray(
              professional.services
            ) &&
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

          {/* CONTACT */}

          {!isOwnProfile && (
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
          )}

        </div>

        {/* REVIEWS */}

        <ReviewSection />

      </div>

    </main>
  );
};

export default ProfessionalProfile;
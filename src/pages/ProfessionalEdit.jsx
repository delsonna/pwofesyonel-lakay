
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./ProfessionalEdit.css";

export default function ProfessionalEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [professional, setProfessional] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    phone: "",
    email: "",
    whatsapp: "",
    profession: "",
    experience: "",
    location: "",
    services: "",
    description: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState("");

  // =====================================================
  // CHARGE PROFIL
  // =====================================================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw new Error(authError.message);
        }

        if (!user) {
          navigate("/");
          return;
        }

        const { data, error: profileError } = await supabase
          .from("professionals")
          .select("*")
          .eq("id", id)
          .single();

        if (profileError || !data) {
          throw new Error(
            "Nou pa jwenn pwofil pwofesyonèl sa a."
          );
        }

        // Verifye pwopriyetè pwofil la
        if (
          data.email &&
          user.email &&
          data.email.toLowerCase() !== user.email.toLowerCase()
        ) {
          throw new Error(
            "Ou pa gen otorizasyon pou modifye pwofil sa a."
          );
        }

        setProfessional(data);

        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          birthDate: data.birth_date || "",
          phone: data.phone || "",
          email: data.email || "",
          whatsapp: data.whatsapp || "",
          profession: data.profession || "",
          experience: data.experience || "",
          location: data.location || "",
          services: Array.isArray(data.services)
            ? data.services.join(", ")
            : data.services || "",
          description: data.description || "",
        });

        setPreviewPhoto(data.image || "");
      } catch (err) {
        console.error("ProfessionalEdit load error:", err);
        setError(
          err.message || "Yon erè rive pandan n ap chaje pwofil la."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, navigate]);

  // =====================================================
  // CHANJMAN NAN FORM
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =====================================================
  // FOTO
  // =====================================================
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Tanpri chwazi yon foto PNG, JPG oswa JPEG."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Foto a pa dwe depase 5MB.");
      return;
    }

    setError("");
    setProfilePhoto(file);

    const localPreview = URL.createObjectURL(file);
    setPreviewPhoto(localPreview);
  };

  // =====================================================
  // VALIDASYON
  // =====================================================
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return "Tanpri antre non ou.";
    }

    if (!formData.lastName.trim()) {
      return "Tanpri antre siyati ou.";
    }

    if (!formData.phone.trim()) {
      return "Tanpri antre nimewo telefòn ou.";
    }

    if (!formData.profession.trim()) {
      return "Tanpri antre pwofesyon ou.";
    }

    if (!formData.location.trim()) {
      return "Tanpri antre zòn kote ou disponib la.";
    }

    return "";
  };

  // =====================================================
  // KONTINYE → PREVIEW
  // =====================================================
  const handleNext = () => {
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // RETOUNEN → FORM
  // =====================================================
  const handleBack = () => {
    setError("");
    setStep(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // UPLOAD NOUVO FOTO
  // =====================================================
  const uploadProfilePhoto = async () => {
    if (!profilePhoto) {
      return professional?.image || null;
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error(
        "Sesyon ou a pa disponib. Tanpri konekte ankò."
      );
    }

    const extension =
      profilePhoto.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName =
      `${user.id}/profile-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("professional-images")
      .upload(fileName, profilePhoto, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(
        `Foto a pa t ka upload: ${uploadError.message}`
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("professional-images")
      .getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) {
      throw new Error(
        "Supabase pa t retounen URL foto a."
      );
    }

    return publicUrlData.publicUrl;
  };

  // =====================================================
  // SOVE CHANJMAN YO
  // =====================================================
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error(
          "Sesyon ou a pa disponib. Tanpri konekte ankò."
        );
      }

      let imageUrl = professional?.image || null;

      if (profilePhoto) {
        imageUrl = await uploadProfilePhoto();
      }

      /*
       * Nou pa mete okenn enfòmasyon verifikasyon isit la.
       *
       * Nou modifye sèlman enfòmasyon pwofil piblik yo.
       */
      const updatedData = {
        name:
          `${formData.firstName.trim()} ${formData.lastName.trim()}`,

        profession: formData.profession.trim(),

        location: formData.location.trim(),

        description: formData.description.trim(),

        first_name: formData.firstName.trim(),

        last_name: formData.lastName.trim(),

        birth_date: formData.birthDate || null,

        phone: formData.phone.trim(),

        whatsapp: formData.whatsapp.trim(),

        // Email la rete menm jan ak kont lan.
        email: professional.email,

        image: imageUrl,
      };

      const {
        data: updatedRows,
        error: updateError,
      } = await supabase
        .from("professionals")
        .update(updatedData)
        .eq("id", professional.id)
        .select(
          "id, name, profession, location, description, first_name, last_name, birth_date, phone, whatsapp, email, image"
        );

      if (updateError) {
        throw new Error(
          `Pwofil la pa t ka mete ajou: ${updateError.message}`
        );
      }

      if (!updatedRows || updatedRows.length !== 1) {
        throw new Error(
          "Supabase pa t konfime mizajou pwofil la."
        );
      }

      setProfessional((current) => ({
        ...current,
        ...updatedRows[0],
      }));

      setProfilePhoto(null);

      if (updatedRows[0].image) {
        setPreviewPhoto(updatedRows[0].image);
      }

      // Retounen sou profil piblik la
      navigate(`/professional/${professional.id}`);
    } catch (err) {
      console.error("ProfessionalEdit save error:", err);

      setError(
        err.message ||
          "Yon erè rive pandan n ap sove chanjman yo."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="professional-edit-loading">
        <div className="professional-edit-loading-box">
          <div className="professional-edit-spinner"></div>
          <p>Ap chaje pwofil ou...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR / PROFIL PA JWENN
  // =====================================================
  if (!professional) {
    return (
      <div className="professional-edit-page">
        <div className="professional-edit-container">
          <div className="professional-edit-card">
            <div className="professional-edit-error">
              {error || "Pwofil la pa jwenn."}
            </div>

            <button
              type="button"
              className="professional-edit-button professional-edit-button-back"
              onClick={() => navigate("/profile")}
            >
              ← Retounen sou pwofil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // STEP 1 — MODIFYE
  // =====================================================
  if (step === 1) {
    return (
      <div className="professional-edit-page">
        <div className="professional-edit-container">

          <div className="professional-edit-header">
            <div className="professional-edit-badge">
              PROFIL PWOFESYONÈL
            </div>

            <h1>Modifye profil</h1>

            <p>
              Mete enfòmasyon pwofesyonèl ou yo ajou.
            </p>
          </div>

          <div className="professional-edit-card">

            {error && (
              <div className="professional-edit-error">
                {error}
              </div>
            )}

            {/* FOTO */}
            <div className="professional-edit-photo-section">

              <div className="professional-edit-photo">
                {previewPhoto ? (
                  <img
                    src={previewPhoto}
                    alt="Foto pwofil"
                  />
                ) : (
                  <div className="professional-edit-photo-placeholder">
                    {formData.firstName?.charAt(0)}
                    {formData.lastName?.charAt(0)}
                  </div>
                )}
              </div>

              <label
                htmlFor="professionalEditPhoto"
                className="professional-edit-photo-button"
              >
                📷 Chanje foto
              </label>

              <input
                id="professionalEditPhoto"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handlePhotoChange}
                className="professional-edit-hidden-input"
              />

              <small>
                PNG, JPG oswa JPEG — 5MB maximum
              </small>
            </div>

            <div className="professional-edit-title">
              <h2>Enfòmasyon pwofesyonèl</h2>
              <p>
                Se enfòmasyon sa yo kliyan yo ka wè sou profil ou.
              </p>
            </div>

            <div className="professional-edit-form">

              {/* NON + SIYATI */}
              <div className="professional-edit-grid">

                <div className="professional-edit-form-group">
                  <label htmlFor="firstName">
                    Non
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Non ou"
                  />
                </div>

                <div className="professional-edit-form-group">
                  <label htmlFor="lastName">
                    Siyati
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Siyati ou"
                  />
                </div>

              </div>

              {/* DAT NESANS + TELEFÒN */}
              <div className="professional-edit-grid">

                <div className="professional-edit-form-group">
                  <label htmlFor="birthDate">
                    Dat nesans
                  </label>

                  <input
                    id="birthDate"
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="professional-edit-form-group">
                  <label htmlFor="phone">
                    Telefòn
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nimewo telefòn"
                  />
                </div>

              </div>

              {/* EMAIL + WHATSAPP */}
              <div className="professional-edit-grid">

                <div className="professional-edit-form-group">
                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    readOnly
                  />

                  <span className="professional-edit-helper">
                    Email kont ou a pa chanje isit la.
                  </span>
                </div>

                <div className="professional-edit-form-group">
                  <label htmlFor="whatsapp">
                    WhatsApp
                  </label>

                  <input
                    id="whatsapp"
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Nimewo WhatsApp"
                  />
                </div>

              </div>

              {/* PWOFESYON + EKSPERYANS */}
              <div className="professional-edit-grid">

                <div className="professional-edit-form-group">
                  <label htmlFor="profession">
                    Pwofesyon
                  </label>

                  <input
                    id="profession"
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder="Pa egzanp: Elektrisyen"
                  />
                </div>

                <div className="professional-edit-form-group">
                  <label htmlFor="experience">
                    Eksperyans
                  </label>

                  <input
                    id="experience"
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Pa egzanp: 5 ane"
                  />
                </div>

              </div>

              {/* ZÒN */}
              <div className="professional-edit-form-group">
                <label htmlFor="location">
                  Zòn / Kote
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Pa egzanp: Delmas, Haiti"
                />
              </div>

              {/* SÈVIS */}
              <div className="professional-edit-form-group">
                <label htmlFor="services">
                  Sèvis ou ofri
                </label>

                <textarea
                  id="services"
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                  placeholder="Ekri sèvis ou ofri yo..."
                  rows="4"
                />
              </div>

              {/* DESKRIPSYON */}
              <div className="professional-edit-form-group">
                <label htmlFor="description">
                  Deskripsyon
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Pale yon ti jan de sèvis ou ak eksperyans ou..."
                  rows="5"
                />
              </div>

            </div>

            {/* BUTTON */}
            <div className="professional-edit-actions">
              <button
                type="button"
                className="professional-edit-button professional-edit-button-back"
                onClick={() => navigate(`/professional/${id}`)}
              >
                ← Anile
              </button>

              <button
                type="button"
                className="professional-edit-button professional-edit-button-next"
                onClick={handleNext}
              >
                Kontinye →
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // STEP 2 — PREVIEW
  // =====================================================
  return (
    <div className="professional-edit-page">
      <div className="professional-edit-container">

        <div className="professional-edit-header">
          <div className="professional-edit-badge">
            PREVIEW PROFIL
          </div>

          <h1>Verifye chanjman yo</h1>

          <p>
            Men kijan enfòmasyon pwofil ou ap parèt.
          </p>
        </div>

        <div className="professional-edit-card">

          {error && (
            <div className="professional-edit-error">
              {error}
            </div>
          )}

          <div className="professional-edit-preview">

            {/* PHOTO + NON */}
            <div className="professional-edit-preview-top">

              <div className="professional-edit-preview-photo">
                {previewPhoto ? (
                  <img
                    src={previewPhoto}
                    alt="Foto pwofil"
                  />
                ) : (
                  <div className="professional-edit-preview-initials">
                    {formData.firstName?.charAt(0)}
                    {formData.lastName?.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <h2>
                  {formData.firstName}{" "}
                  {formData.lastName}
                </h2>

                <p className="professional-edit-preview-profession">
                  {formData.profession || "Pwofesyonèl"}
                </p>
              </div>

            </div>

            {/* DISPONIBILITE */}
            <div className="professional-edit-available">
              <span className="professional-edit-available-dot">
                ●
              </span>
              Disponib kounye a
            </div>

            {/* INFO */}
            <div className="professional-edit-preview-info">

              <div className="professional-edit-preview-row">
                <span className="professional-edit-preview-label">
                  📍 Zòn
                </span>

                <span>
                  {formData.location || "Pa espesifye"}
                </span>
              </div>

              <div className="professional-edit-preview-row">
                <span className="professional-edit-preview-label">
                  📞 Telefòn
                </span>

                <span>
                  {formData.phone || "Pa espesifye"}
                </span>
              </div>

              {formData.whatsapp && (
                <div className="professional-edit-preview-row">
                  <span className="professional-edit-preview-label">
                    WhatsApp
                  </span>

                  <span>
                    {formData.whatsapp}
                  </span>
                </div>
              )}

              {formData.experience && (
                <div className="professional-edit-preview-row">
                  <span className="professional-edit-preview-label">
                    Eksperyans
                  </span>

                  <span>
                    {formData.experience}
                  </span>
                </div>
              )}

              {formData.services && (
                <div className="professional-edit-preview-row">
                  <span className="professional-edit-preview-label">
                    Sèvis mwen ofri
                  </span>

                  <span>
                    {formData.services}
                  </span>
                </div>
              )}

              {formData.description && (
                <div className="professional-edit-preview-row">
                  <span className="professional-edit-preview-label">
                    Konsènan mwen
                  </span>

                  <span>
                    {formData.description}
                  </span>
                </div>
              )}

            </div>

          </div>

          {/* ACTIONS */}
          <div className="professional-edit-actions">

            <button
              type="button"
              className="professional-edit-button professional-edit-button-back"
              onClick={handleBack}
              disabled={saving}
            >
              ← Modifye ankò
            </button>

            <button
              type="button"
              className="professional-edit-button professional-edit-button-save"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Ap sove..."
                : "✓ Konfime & Sove"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
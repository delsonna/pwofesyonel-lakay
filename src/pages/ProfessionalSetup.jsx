import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import IdentityVerification from "../components/IdentityVerification";
import "./ProfessionalSetup.css";

const ProfessionalSetup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState("NIF");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [otherProfession, setOtherProfession] = useState(false);

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
    documentNumber: "",
  });

  /* ================================
     HANDLE INPUT
  ================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  /* ================================
     STEP 1 → STEP 2
  ================================= */

  const handleNext = (e) => {
    e.preventDefault();

    setError("");
    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================================
     STEP 2 → STEP 3
  ================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setStep(3);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================================
     SAVE PROFESSIONAL
  ================================= */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      /*
      =========================================
      VERIFY USER ONLY WHEN SAVING
      =========================================
      */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error(
          "Ou dwe konekte sou kont ou avan ou anrejistre pwofil pwofesyonèl la."
        );
      }

      /*
      =========================================
      VALIDATION
      =========================================
      */

      if (!formData.firstName.trim()) {
        throw new Error("Tanpri antre prenon ou.");
      }

      if (!formData.lastName.trim()) {
        throw new Error("Tanpri antre non ou.");
      }

      if (!formData.phone.trim()) {
        throw new Error("Tanpri antre nimewo telefòn ou.");
      }

      if (!formData.email.trim()) {
        throw new Error("Tanpri antre email ou.");
      }

      if (!formData.profession.trim()) {
        throw new Error("Tanpri chwazi metye ou.");
      }

      if (!formData.location.trim()) {
        throw new Error("Tanpri antre zòn sèvis ou.");
      }

      if (!formData.services.trim()) {
        throw new Error("Tanpri antre sèvis ou ofri yo.");
      }

      /*
      =========================================
      FULL NAME
      =========================================
      */

      const fullName =
        `${formData.firstName.trim()} ${formData.lastName.trim()}`;

      /*
      =========================================
      INSERT PROFESSIONAL
      =========================================
      */

      const {
        data: professional,
        error: professionalError,
      } = await supabase
        .from("professionals")
        .insert([
          {
            name: fullName,

            profession: formData.profession.trim(),

            location: formData.location.trim(),

            rating: 0,

            image: null,

            description: formData.description.trim(),

            first_name: formData.firstName.trim(),

            last_name: formData.lastName.trim(),

            phone: formData.phone.trim(),

            email: formData.email.trim(),

            whatsapp: formData.whatsapp.trim(),
          },
        ])
        .select()
        .single();

      if (professionalError) {
        throw professionalError;
      }

      /*
      =========================================
      SAVE IDENTITY VERIFICATION
      =========================================
      */

      if (professional) {
        const {
          error: verificationError,
        } = await supabase
          .from("professional_verifications")
          .insert([
            {
              professional_id: professional.id,

              document_type: documentType,

              document_number:
                formData.documentNumber.trim(),

              identity_document: null,

              face_verification: null,

              verification_status: "pending",
            },
          ]);

       if (verificationError) {
  console.error("Verification error:", verificationError);

  throw new Error(
    `Pwofil la anrejistre, men verifikasyon an pa t anrejistre: ${verificationError.message}`
  );
}
      }

      /*
      =========================================
      SUCCESS
      =========================================
      */

      setSaved(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (error) {
      console.error(
        "Professional save error:",
        error
      );

      setError(
        error.message ||
          "Gen yon pwoblèm pandan pwofil lan t ap anrejistre."
      );

    } finally {
      setSaving(false);
    }
  };

  /* ================================
     SUCCESS PAGE
  ================================= */

  if (saved) {
    return (
      <main className="professional-setup">

        <div className="setup-container">

          <div className="setup-success">

            <div className="success-icon">
              ✓
            </div>

            <span className="success-label">
              KONFIMASYON
            </span>

            <h1>
              Enskripsyon fèt ak siksè!
            </h1>

            <p>
              Enfòmasyon pwofil pwofesyonèl ou an
              anrejistre avèk siksè.
            </p>

            <button
              type="button"
              className="setup-submit success-button"
              onClick={() => navigate("/")}
            >
              Retounen sou paj akey →
            </button>

          </div>

        </div>

      </main>
    );
  }

  /* ================================
     MAIN PAGE
  ================================= */

  return (
    <main className="professional-setup">

      <div className="setup-container">

        {/* BACK BUTTON */}

        <button
          className="setup-back"
          type="button"
          onClick={() => {
            if (step === 1) {
              navigate("/");
            } else {
              setStep(step - 1);

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          }}
        >
          ← Retounen
        </button>


        {/* HEADER */}

        <div className="setup-header">

          <span>
            KONFIGIRASYON PWOFESYONÈL
          </span>

          <h1>
            Konplete pwofil ou
          </h1>

          <p>
            Bay kèk enfòmasyon sou ou ak sèvis ou yo
            pou kliyan yo ka konnen pwofesyonèl yo ap kontakte a.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="setup-error">
            {error}
          </div>
        )}


        <form
          className="setup-form"
          onSubmit={
            step === 1
              ? handleNext
              : handleSubmit
          }
        >

          {/* =====================================
              STEP 1
          ====================================== */}

          {step === 1 && (
            <>

              {/* PERSONAL INFORMATION */}

              <section className="setup-section">

                <div className="setup-section-title">

                  <span>
                    01
                  </span>

                  <div>

                    <h2>
                      Enfòmasyon pèsonèl
                    </h2>

                    <p>
                      Enfòmasyon sa yo ap ede kliyan yo idantifye ou.
                    </p>

                  </div>

                </div>


                <div className="setup-grid">

                  {/* PRENON */}

                  <div className="setup-field">

                    <label>
                      Prenon
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Egzanp: Jean"
                      required
                    />

                  </div>


                  {/* NON */}

                  <div className="setup-field">

                    <label>
                      Non
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Egzanp: Pierre"
                      required
                    />

                  </div>


                  {/* DAT NESANS */}

                  <div className="setup-field">

                    <label>
                      Dat nesans
                    </label>

                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* TELEFÒN */}

                  <div className="setup-field">

                    <label>
                      Telefòn
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+509..."
                      required
                    />

                  </div>


                  {/* EMAIL */}

                  <div className="setup-field">

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Egzanp: jean@email.com"
                      required
                    />

                  </div>


                  {/* WHATSAPP */}

                  <div className="setup-field">

                    <label>
                      WhatsApp
                    </label>

                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+509..."
                      required
                    />

                  </div>

                </div>


                {/* FOTO PWOFIL */}

                <div className="setup-field">

                  <label>
                    Foto pwofil
                  </label>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                  />

                </div>

              </section>


              {/* PROFESSIONAL INFORMATION */}

              <section className="setup-section">

                <div className="setup-section-title">

                  <span>
                    02
                  </span>

                  <div>

                    <h2>
                      Enfòmasyon pwofesyonèl
                    </h2>

                    <p>
                      Di kliyan yo ki sèvis ou ofri.
                    </p>

                  </div>

                </div>


                <div className="setup-grid">

                  {/* METYE */}

                  <div className="setup-field">

                    <label>
                      Metye
                    </label>

                    <select
                      value={
                        otherProfession
                          ? "Lòt"
                          : formData.profession
                      }
                      onChange={(e) => {

                        const value =
                          e.target.value;

                        if (value === "Lòt") {

                          setOtherProfession(true);

                          setFormData((prev) => ({
                            ...prev,
                            profession: "",
                          }));

                        } else {

                          setOtherProfession(false);

                          setFormData((prev) => ({
                            ...prev,
                            profession: value,
                          }));

                        }

                      }}
                      required={!otherProfession}
                    >

                      <option value="">
                        Chwazi metye ou
                      </option>

                      <option value="Elektrisyen">
                        Elektrisyen
                      </option>

                      <option value="Plonbye">
                        Plonbye
                      </option>

                      <option value="Mekanisyen">
                        Mekanisyen
                      </option>

                      <option value="Mason">
                        Mason
                      </option>

                      <option value="Pent">
                        Pent
                      </option>

                      <option value="Enfòmatik">
                        Enfòmatik
                      </option>

                      <option value="Klimatizasyon">
                        Klimatizasyon
                      </option>

                      <option value="Soudeur">
                        Soudeur
                      </option>

                      <option value="Menuizye">
                        Menuizye
                      </option>

                      <option value="Jardinye">
                        Jardinye
                      </option>

                      <option value="Netwayè">
                        Netwayè
                      </option>

                      <option value="Lòt">
                        Lòt
                      </option>

                    </select>


                    {otherProfession && (

                      <input
                        type="text"
                        value={formData.profession}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            profession: e.target.value,
                          }))
                        }
                        placeholder="Ekri non metye ou..."
                        required
                      />

                    )}

                  </div>


                  {/* EXPERIENCE */}

                  <div className="setup-field">

                    <label>
                      Ane eksperyans
                    </label>

                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Chwazi
                      </option>

                      <option value="Mwens pase 1 ane">
                        Mwens pase 1 ane
                      </option>

                      <option value="1 - 3 ane">
                        1 - 3 ane
                      </option>

                      <option value="4 - 7 ane">
                        4 - 7 ane
                      </option>

                      <option value="8 - 10 ane">
                        8 - 10 ane
                      </option>

                      <option value="Plis pase 10 ane">
                        Plis pase 10 ane
                      </option>

                    </select>

                  </div>


                  {/* LOCATION */}

                  <div className="setup-field">

                    <label>
                      Zòn sèvis
                    </label>

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Egzanp: Delmas"
                      required
                    />

                  </div>


                  {/* SERVICES */}

                  <div className="setup-field">

                    <label>
                      Sèvis ou ofri
                    </label>

                    <input
                      type="text"
                      name="services"
                      value={formData.services}
                      onChange={handleChange}
                      placeholder="Egzanp: Enstalasyon elektrik"
                      required
                    />

                  </div>

                </div>


                {/* DESCRIPTION */}

                <div className="setup-field">

                  <label>
                    Deskripsyon pwofesyonèl
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Prezante tèt ou ak eksperyans ou..."
                    required
                  />

                </div>

              </section>


              {/* NEXT */}

              <div className="setup-submit-area">

                <p>
                  🔒 Enfòmasyon prive ou yo ap rete pwoteje.
                </p>

                <button
                  type="submit"
                  className="setup-submit"
                >
                  Suivant →
                </button>

              </div>

            </>
          )}


          {/* =====================================
              STEP 2
          ====================================== */}

          {step === 2 && (
            <>

              <section className="setup-section">

                <div className="setup-section-title">

                  <span>
                    03
                  </span>

                  <div>

                    <h2>
                      Verifikasyon idantite
                    </h2>

                    <p>
                      Verifye idantite ou pou pwoteje kliyan
                      ak pwofesyonèl yo.
                    </p>

                  </div>

                </div>


                <div className="setup-field">

                  <label>
                    Kalite dokiman
                  </label>

                  <div className="document-options">

                    <button
                      type="button"
                      className={
                        documentType === "NIF"
                          ? "document-option active"
                          : "document-option"
                      }
                      onClick={() =>
                        setDocumentType("NIF")
                      }
                    >
                      NIF
                    </button>


                    <button
                      type="button"
                      className={
                        documentType === "NINU"
                          ? "document-option active"
                          : "document-option"
                      }
                      onClick={() =>
                        setDocumentType("NINU")
                      }
                    >
                      NINU
                    </button>


                    <button
                      type="button"
                      className={
                        documentType === "Paspò"
                          ? "document-option active"
                          : "document-option"
                      }
                      onClick={() =>
                        setDocumentType("Paspò")
                      }
                    >
                      Paspò
                    </button>

                  </div>

                </div>


                <div className="setup-field">

                  <label>
                    Nimewo {documentType}
                  </label>

                  <input
                    type="text"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleChange}
                    placeholder={`Antre nimewo ${documentType}`}
                    required
                  />

                </div>

              </section>


              {/* IDENTITY VERIFICATION */}

              <section className="setup-section">

                <div className="setup-section-title">

                  <span>
                    04
                  </span>

                  <div>

                    <h2>
                      Verifikasyon vizaj ak pyès
                    </h2>

                    <p>
                      Verifye pyès idantite ak vizaj ou.
                    </p>

                  </div>

                </div>


                <IdentityVerification />

              </section>


              <div className="setup-submit-area">

                <p>
                  🔒 Enfòmasyon prive ou yo ap rete pwoteje.
                </p>

                <button
                  type="submit"
                  className="setup-submit"
                >
                  Soumèt pwofil pou verifikasyon →
                </button>

              </div>

            </>
          )}


          {/* =====================================
              STEP 3
          ====================================== */}

          {step === 3 && (
            <>

              <section className="setup-section">

                <div className="setup-section-title">

                  <span>
                    05
                  </span>

                  <div>

                    <h2>
                      Konfime enfòmasyon yo
                    </h2>

                    <p>
                      Verifye enfòmasyon ou yo anvan ou
                      anrejistre pwofil la.
                    </p>

                  </div>

                </div>


                <div className="confirmation-grid">

                  <div className="confirmation-item">
                    <small>Prenon</small>
                    <strong>
                      {formData.firstName}
                    </strong>
                  </div>

                  <div className="confirmation-item">
                    <small>Non</small>
                    <strong>
                      {formData.lastName}
                    </strong>
                  </div>

                  <div className="confirmation-item">
                    <small>Telefòn</small>
                    <strong>
                      {formData.phone}
                    </strong>
                  </div>

                  <div className="confirmation-item">
                    <small>Email</small>
                    <strong>
                      {formData.email}
                    </strong>
                  </div>

                  <div className="confirmation-item">
                    <small>WhatsApp</small>
                    <strong>
                      {formData.whatsapp}
                    </strong>
                  </div>

                  <div className="confirmation-item">
                    <small>Metye</small>
                    <strong>
                      {formData.profession}
                    </strong>
                  </div>

                  <div className="confirmation-item">
                    <small>Zòn sèvis</small>
                    <strong>
                      {formData.location}
                    </strong>
                  </div>

                  <div className="confirmation-item">
                    <small>Sèvis</small>
                    <strong>
                      {formData.services}
                    </strong>
                  </div>

                </div>

              </section>


              {/* SAVE */}

              <div className="setup-submit-area">

                <p>
                  🔒 Tout enfòmasyon yo pare pou anrejistreman.
                </p>

                <button
                  type="button"
                  className="setup-submit"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? "Anrejistreman..."
                    : "Save pwofil la →"}
                </button>

              </div>

            </>
          )}

        </form>

      </div>

    </main>
  );
};

export default ProfessionalSetup;
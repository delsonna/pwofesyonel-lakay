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

  // =========================================
  // FILES
  // =========================================

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [identityDocument, setIdentityDocument] = useState(null);
  const [faceVerification, setFaceVerification] = useState(null);

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =========================================
  // PROFILE PHOTO
  // =========================================

  const handleProfilePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setProfilePhoto(null);
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Foto pwofil la dwe PNG, JPG oswa JPEG."
      );

      e.target.value = "";
      setProfilePhoto(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Foto pwofil la pa dwe depase 5 MB."
      );

      e.target.value = "";
      setProfilePhoto(null);
      return;
    }

    setProfilePhoto(file);
    setError("");
  };

  // =========================================
  // CONVERT CAPTURED DATA TO FILE
  // =========================================

  const normalizeCapturedFile = async (
    captured,
    defaultName
  ) => {
    if (!captured) {
      return null;
    }

    // Already a File
    if (captured instanceof File) {
      return captured;
    }

    // Blob
    if (captured instanceof Blob) {
      return new File(
        [captured],
        defaultName,
        {
          type: captured.type || "image/jpeg",
        }
      );
    }

    // Some components may return { file: File }
    if (captured.file instanceof File) {
      return captured.file;
    }

    // Some components may return { blob: Blob }
    if (captured.blob instanceof Blob) {
      return new File(
        [captured.blob],
        defaultName,
        {
          type:
            captured.blob.type ||
            "image/jpeg",
        }
      );
    }

    // Data URL
    if (
      typeof captured === "string" &&
      captured.startsWith("data:")
    ) {
      try {
        const response = await fetch(captured);
        const blob = await response.blob();

        return new File(
          [blob],
          defaultName,
          {
            type:
              blob.type ||
              "image/jpeg",
          }
        );
      } catch (conversionError) {
        console.error(
          "Data URL conversion error:",
          conversionError
        );

        return null;
      }
    }

    return null;
  };

  // =========================================
  // UPLOAD FILE TO SUPABASE STORAGE
  // =========================================

  const uploadFile = async (
    bucketName,
    file,
    folder
  ) => {
    if (!file) {
      throw new Error(
        `Pa gen fichye pou upload nan ${bucketName}.`
      );
    }

    const normalizedFile =
      await normalizeCapturedFile(
        file,
        `verification-${Date.now()}.jpg`
      );

    if (!normalizedFile) {
      throw new Error(
        `Fichye pou ${bucketName} la pa valab.`
      );
    }

    const originalName =
      normalizedFile.name || "image.jpg";

    const fileExtension =
      originalName.includes(".")
        ? originalName
            .split(".")
            .pop()
            ?.toLowerCase()
        : "jpg";

    const safeExtension =
      fileExtension || "jpg";

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.${safeExtension}`;

    const filePath =
      `${folder}/${fileName}`;

    console.log(
      `Uploading ${bucketName}:`,
      filePath
    );

    const {
      error: uploadError,
    } = await supabase.storage
      .from(bucketName)
      .upload(
        filePath,
        normalizedFile,
        {
          cacheControl: "3600",
          upsert: false,
          contentType:
            normalizedFile.type ||
            "image/jpeg",
        }
      );

    if (uploadError) {
      console.error(
        `Upload error ${bucketName}:`,
        uploadError
      );

      throw new Error(
        `Upload echwe nan ${bucketName}: ${uploadError.message}`
      );
    }

    console.log(
      `Upload successful ${bucketName}:`,
      filePath
    );

    return filePath;
  };

  // =========================================
  // STEP 1 → STEP 2
  // =========================================

  const handleNext = (e) => {
    e.preventDefault();

    setError("");

    if (!formData.firstName.trim()) {
      setError("Tanpri antre prenon ou.");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Tanpri antre non ou.");
      return;
    }

    if (!formData.birthDate) {
      setError("Tanpri chwazi dat nesans ou.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Tanpri antre nimewo telefòn ou.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Tanpri antre email ou.");
      return;
    }

    if (!formData.whatsapp.trim()) {
      setError("Tanpri antre nimewo WhatsApp ou.");
      return;
    }

    if (!formData.profession.trim()) {
      setError(
        "Tanpri chwazi oswa antre metye ou."
      );
      return;
    }

    if (!formData.experience.trim()) {
      setError(
        "Tanpri chwazi ane eksperyans ou."
      );
      return;
    }

    if (!formData.location.trim()) {
      setError("Tanpri antre zòn sèvis ou.");
      return;
    }

    if (!formData.services.trim()) {
      setError(
        "Tanpri antre sèvis ou ofri yo."
      );
      return;
    }

    if (!formData.description.trim()) {
      setError(
        "Tanpri ekri yon ti deskripsyon pwofesyonèl ou."
      );
      return;
    }

    if (!profilePhoto) {
      setError(
        "Tanpri chwazi yon foto pwofil."
      );
      return;
    }

    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================
  // STEP 2 → STEP 3
  // =========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!documentType) {
      setError(
        "Tanpri chwazi kalite dokiman an."
      );
      return;
    }

    if (!formData.documentNumber.trim()) {
      setError(
        "Tanpri antre nimewo dokiman ou."
      );
      return;
    }

    if (!identityDocument) {
      setError(
        "Tanpri pran foto dokiman idantite ou."
      );
      return;
    }

    if (!faceVerification) {
      setError(
        "Tanpri fè verifikasyon figi ou."
      );
      return;
    }

    setStep(3);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================
  // SAVE PROFESSIONAL
  // =========================================

  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);
      setError("");

      // =======================================
      // 1. VERIFY CURRENT USER
      // =======================================

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
          "Ou dwe konekte sou kont ou avan ou anrejistre pwofil pwofesyonèl la."
        );
      }

      console.log(
        "CURRENT USER:",
        user.id
      );

      // =======================================
      // 2. FINAL VALIDATION
      // =======================================

      if (!profilePhoto) {
        throw new Error(
          "Foto pwofil la obligatwa."
        );
      }

      if (!identityDocument) {
        throw new Error(
          "Dokiman idantite a obligatwa."
        );
      }

      if (!faceVerification) {
        throw new Error(
          "Verifikasyon figi a obligatwa."
        );
      }

      if (!formData.documentNumber.trim()) {
        throw new Error(
          "Nimewo dokiman an obligatwa."
        );
      }

      // =======================================
      // 3. NORMALIZE VERIFICATION FILES
      // =======================================

      const normalizedIdentityDocument =
        await normalizeCapturedFile(
          identityDocument,
          "identity-document.jpg"
        );

      const normalizedFaceVerification =
        await normalizeCapturedFile(
          faceVerification,
          "face-verification.jpg"
        );

      if (!normalizedIdentityDocument) {
        throw new Error(
          "Dokiman idantite a pa yon fichye ki valab."
        );
      }

      if (!normalizedFaceVerification) {
        throw new Error(
          "Foto verifikasyon figi a pa yon fichye ki valab."
        );
      }

      console.log(
        "IDENTITY FILE:",
        normalizedIdentityDocument
      );

      console.log(
        "FACE FILE:",
        normalizedFaceVerification
      );

      // =======================================
      // 4. UNIQUE FOLDER
      // =======================================

      const uniqueFolder =
        `${user.id}-${Date.now()}`;

      console.log(
        "UNIQUE FOLDER:",
        uniqueFolder
      );

      // =======================================
      // 5. UPLOAD PROFILE PHOTO
      // =======================================

      const profileImagePath =
        await uploadFile(
          "professional-images",
          profilePhoto,
          uniqueFolder
        );

      if (!profileImagePath) {
        throw new Error(
          "Foto pwofil la pa t jwenn yon path apre upload."
        );
      }

      // =======================================
      // 6. GET PUBLIC PROFILE IMAGE URL
      // =======================================

      const {
        data: publicImageData,
      } = supabase.storage
        .from("professional-images")
        .getPublicUrl(
          profileImagePath
        );

      const profileImageUrl =
        publicImageData?.publicUrl ||
        null;

      if (!profileImageUrl) {
        throw new Error(
          "Nou pa t kapab kreye URL foto pwofil la."
        );
      }

      console.log(
        "PROFILE IMAGE PATH:",
        profileImagePath
      );

      console.log(
        "PROFILE IMAGE URL:",
        profileImageUrl
      );

      // =======================================
      // 7. UPLOAD IDENTITY DOCUMENT
      // =======================================

      const identityDocumentPath =
        await uploadFile(
          "identity-documents",
          normalizedIdentityDocument,
          uniqueFolder
        );

      if (!identityDocumentPath) {
        throw new Error(
          "Dokiman idantite a pa t jwenn yon path apre upload."
        );
      }

      console.log(
        "IDENTITY DOCUMENT PATH:",
        identityDocumentPath
      );

      // =======================================
      // 8. UPLOAD FACE VERIFICATION
      // =======================================

      const faceVerificationPath =
        await uploadFile(
          "face-verification",
          normalizedFaceVerification,
          uniqueFolder
        );

      if (!faceVerificationPath) {
        throw new Error(
          "Foto figi a pa t jwenn yon path apre upload."
        );
      }

      console.log(
        "FACE VERIFICATION PATH:",
        faceVerificationPath
      );

      // =======================================
      // 9. FULL NAME
      // =======================================

      const fullName =
        `${formData.firstName.trim()} ${formData.lastName.trim()}`;

      // =======================================
      // 10. INSERT PROFESSIONAL
      // =======================================

      const {
        data: professional,
        error: professionalError,
      } = await supabase
        .from("professionals")
        .insert([
          {
            name: fullName,

            profession:
              formData.profession.trim(),

            location:
              formData.location.trim(),

            rating: 0,

            image:
              profileImageUrl,

            description:
              formData.description.trim(),

            first_name:
              formData.firstName.trim(),

            last_name:
              formData.lastName.trim(),

              birth_date: 
              formData.birthDate,

            phone:
              formData.phone.trim(),

            email:
              formData.email.trim(),

            whatsapp:
              formData.whatsapp.trim(),
          },
        ])
        .select()
        .single();

      if (professionalError) {
        console.error(
          "Professional insert error:",
          professionalError
        );

        throw new Error(
          `Pwofil la pa t anrejistre: ${professionalError.message}`
        );
      }

      if (!professional?.id) {
        throw new Error(
          "Pwofil la pa t retounen yon ID apre anrejistreman."
        );
      }

      console.log(
        "PROFESSIONAL CREATED:",
        professional
      );

      // =======================================
      // 11. PREPARE VERIFICATION DATA
      // =======================================

      const verificationData = {
        professional_id:
          professional.id,

        document_type:
          documentType,

        document_number:
          formData.documentNumber.trim(),

        identity_document:
          identityDocumentPath,

        face_verification:
          faceVerificationPath,

        verification_status:
          "pending",
      };

      // IMPORTANT DEBUG
      console.log(
        "================================="
      );

      console.log(
        "VERIFICATION DATA SENT TO SUPABASE:"
      );

      console.log(
        verificationData
      );

      console.log(
        "professional_id:",
        verificationData.professional_id
      );

      console.log(
        "identity_document:",
        verificationData.identity_document
      );

      console.log(
        "face_verification:",
        verificationData.face_verification
      );

      console.log(
        "================================="
      );

      // =======================================
      // 12. INSERT VERIFICATION
      // =======================================

const {
  error: verificationError,
} = await supabase
  .from("professional_verifications")
  .insert([
    verificationData,
  ]);

if (verificationError) {
  console.error(
    "Verification insert error:",
    verificationError
  );

  throw new Error(
    `Pwofil la anrejistre, men verifikasyon an pa t anrejistre: ${verificationError.message}`
  );
}

console.log(
  "VERIFICATION CREATED SUCCESSFULLY"
);

// =======================================
// 13. SUCCESS
// =======================================

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
        error?.message ||
          "Gen yon pwoblèm pandan pwofil lan t ap anrejistre."
      );
    } finally {
      setSaving(false);
    }
  };
  // =========================================
  // SUCCESS PAGE
  // =========================================

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

            <p>
              Dokiman ou yo resevwa epi pwofil ou a
              ap tann verifikasyon administratè a.
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

  // =========================================
  // MAIN PAGE
  // =========================================

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
            pou kliyan yo ka konnen pwofesyonèl yo ap
            kontakte a.
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
              : step === 2
              ? handleSubmit
              : (e) => e.preventDefault()
          }
        >

          {/* =====================================
              STEP 1
          ====================================== */}

          {step === 1 && (
            <>

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
                      Enfòmasyon sa yo ap ede kliyan yo
                      idantifye ou.
                    </p>

                  </div>

                </div>

                <div className="setup-grid">

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
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleProfilePhoto}
                    required
                  />

                  {profilePhoto && (
                    <small>
                      ✓ Foto chwazi:{" "}
                      {profilePhoto.name}
                    </small>
                  )}

                  <small>
                    PNG, JPG oswa JPEG — maksimòm 5 MB.
                  </small>

                </div>

              </section>

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

                        setError("");

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
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            profession:
                              e.target.value,
                          }));

                          setError("");
                        }}
                        placeholder="Ekri non metye ou..."
                        required
                      />

                    )}

                  </div>

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
                      Verifye idantite ou pou pwoteje
                      kliyan ak pwofesyonèl yo.
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

                <IdentityVerification
                  onDocumentCaptured={
                    (file) => {
                      console.log(
                        "IDENTITY DOCUMENT RECEIVED:",
                        file
                      );

                      setIdentityDocument(file);
                      setError("");
                    }
                  }

                  onFaceCaptured={
                    (file) => {
                      console.log(
                        "FACE VERIFICATION RECEIVED:",
                        file
                      );

                      setFaceVerification(file);
                      setError("");
                    }
                  }
                />

                <div className="confirmation-grid">

                  <div className="confirmation-item">

                    <small>
                      DOKIMAN IDANTITE
                    </small>

                    <strong>
                      {identityDocument
                        ? "✓ Dokiman pare"
                        : "Poko pran dokiman"}
                    </strong>

                  </div>

                  <div className="confirmation-item">

                    <small>
                      FOTO FIGI
                    </small>

                    <strong>
                      {faceVerification
                        ? "✓ Foto figi pare"
                        : "Poko fè verifikasyon"}
                    </strong>

                  </div>

                </div>

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
                      Verifye enfòmasyon ou yo anvan
                      ou anrejistre pwofil la.
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
                    <small>Eksperyans</small>
                    <strong>
                      {formData.experience}
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

                  <div className="confirmation-item">
                    <small>Dokiman</small>
                    <strong>
                      {documentType}
                    </strong>
                  </div>

                  <div className="confirmation-item">
                    <small>DOKIMAN IDANTITE</small>
                    <strong>
                      {identityDocument
                        ? "✓ Pare"
                        : "Poko pare"}
                    </strong>
                  </div>

                  <div className="confirmation-item">
                    <small>FOTO FIGI</small>
                    <strong>
                      {faceVerification
                        ? "✓ Pare"
                        : "Poko pare"}
                    </strong>
                  </div>

                </div>

              </section>

              <div className="setup-submit-area">

                <p>
                  🔒 Tout enfòmasyon yo pare pou
                  anrejistreman an.
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
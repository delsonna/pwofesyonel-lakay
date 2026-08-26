import { useEffect, useRef, useState } from "react";
import "./IdentityVerification.css";

const IdentityVerification = ({
  onDocumentCaptured,
  onFaceCaptured,
}) => {
  // =========================================
  // DOCUMENT SCANNER
  // =========================================

  const [documentCameraOpen, setDocumentCameraOpen] = useState(false);
  const [documentPhoto, setDocumentPhoto] = useState(null);

  const documentVideoRef = useRef(null);
  const documentStreamRef = useRef(null);

  // =========================================
  // FACE VERIFICATION
  // =========================================

  const [faceCameraOpen, setFaceCameraOpen] = useState(false);
  const [facePhoto, setFacePhoto] = useState(null);

  const faceVideoRef = useRef(null);
  const faceStreamRef = useRef(null);

  // =========================================
  // OPEN DOCUMENT CAMERA
  // =========================================

  const openDocumentCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      });

      documentStreamRef.current = stream;

      setDocumentCameraOpen(true);

      setTimeout(() => {
        if (documentVideoRef.current) {
          documentVideoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error(error);

      alert(
        "Nou pa kapab ouvri kamera a. Tanpri bay navigatè a pèmisyon pou itilize kamera a."
      );
    }
  };

  // =========================================
  // CLOSE DOCUMENT CAMERA
  // =========================================

  const closeDocumentCamera = () => {
    if (documentStreamRef.current) {
      documentStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      documentStreamRef.current = null;
    }

    setDocumentCameraOpen(false);
  };

  // =========================================
  // TAKE DOCUMENT PHOTO
  // =========================================

  const takeDocumentPhoto = () => {
    const video = documentVideoRef.current;

    if (!video || !video.videoWidth) {
      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const file = new File(
          [blob],
          `identity-document-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        setDocumentPhoto(URL.createObjectURL(blob));

        // Voye foto a bay ProfessionalSetup
        if (onDocumentCaptured) {
          onDocumentCaptured(file);
        }
      },
      "image/jpeg",
      0.9
    );

    closeDocumentCamera();
  };

  // =========================================
  // RETAKE DOCUMENT
  // =========================================

  const retakeDocument = () => {
    setDocumentPhoto(null);

    if (onDocumentCaptured) {
      onDocumentCaptured(null);
    }

    openDocumentCamera();
  };

  // =========================================
  // OPEN FACE CAMERA
  // =========================================

  const openFaceCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      faceStreamRef.current = stream;

      setFaceCameraOpen(true);

      setTimeout(() => {
        if (faceVideoRef.current) {
          faceVideoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error(error);

      alert(
        "Nou pa kapab ouvri kamera a. Tanpri bay navigatè a pèmisyon pou itilize kamera a."
      );
    }
  };

  // =========================================
  // CLOSE FACE CAMERA
  // =========================================

  const closeFaceCamera = () => {
    if (faceStreamRef.current) {
      faceStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      faceStreamRef.current = null;
    }

    setFaceCameraOpen(false);
  };

  // =========================================
  // TAKE FACE PHOTO
  // =========================================

  const takeFacePhoto = () => {
    const video = faceVideoRef.current;

    if (!video || !video.videoWidth) {
      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const file = new File(
          [blob],
          `face-verification-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        setFacePhoto(URL.createObjectURL(blob));

        // Voye foto vizaj la bay ProfessionalSetup
        if (onFaceCaptured) {
          onFaceCaptured(file);
        }
      },
      "image/jpeg",
      0.9
    );

    closeFaceCamera();
  };

  // =========================================
  // RETAKE FACE
  // =========================================

  const retakeFace = () => {
    setFacePhoto(null);

    if (onFaceCaptured) {
      onFaceCaptured(null);
    }

    openFaceCamera();
  };

  // =========================================
  // CLEAN CAMERAS
  // =========================================

  useEffect(() => {
    return () => {
      if (documentStreamRef.current) {
        documentStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (faceStreamRef.current) {
        faceStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // =========================================
  // RETURN
  // =========================================

  return (
    <div className="identity-verification">

      {/* =====================================
          01 — DOCUMENT
      ====================================== */}

      <div className="verification-card">

        <div className="verification-title">

          <div className="verification-number">
            01
          </div>

          <div>

            <h3>
              Eskane pyès idantite ou an
            </h3>

            <p>
              Pran yon foto klè devan pyès idantite ou
              avèk kamera aparèy ou.
            </p>

          </div>

        </div>


        {/* CAMERA NOT OPEN */}

        {!documentCameraOpen && !documentPhoto && (

          <button
            type="button"
            className="verification-camera-btn"
            onClick={openDocumentCamera}
          >
            📷 Ouvri kamera pou eskane pyès la
          </button>

        )}


        {/* DOCUMENT CAMERA */}

        {documentCameraOpen && (

          <div className="verification-camera">

            <div className="video-wrapper">

              <video
                ref={documentVideoRef}
                autoPlay
                playsInline
                muted
              />

              <div className="document-overlay">

                <div className="document-frame">
                </div>

                <span>
                  Mete pyès la andedan kare a
                </span>

              </div>

            </div>


            <div className="camera-buttons">

              <button
                type="button"
                className="take-photo-btn"
                onClick={takeDocumentPhoto}
              >
                📸 Pran foto pyès la
              </button>

              <button
                type="button"
                className="cancel-camera-btn"
                onClick={closeDocumentCamera}
              >
                Fèmen kamera
              </button>

            </div>

          </div>

        )}


        {/* DOCUMENT PHOTO */}

        {documentPhoto && (

          <div className="verification-result">

            <img
              src={documentPhoto}
              alt="Pyès idantite eskane"
            />

            <div className="verification-success">

              <span>
                ✓ Pyès idantite a eskane avèk siksè
              </span>

              <button
                type="button"
                onClick={retakeDocument}
              >
                Pran yon lòt foto
              </button>

            </div>

          </div>

        )}

      </div>


      {/* =====================================
          02 — FACE
      ====================================== */}

      <div className="verification-card">

        <div className="verification-title">

          <div className="verification-number">
            02
          </div>

          <div>

            <h3>
              Verifye vizaj ou
            </h3>

            <p>
              Sèvi ak kamera devan aparèy ou pou
              verifye vizaj ou.
            </p>

          </div>

        </div>


        {/* CAMERA NOT OPEN */}

        {!faceCameraOpen && !facePhoto && (

          <button
            type="button"
            className="verification-camera-btn"
            onClick={openFaceCamera}
          >
            📷 Ouvri kamera pou verifye vizaj
          </button>

        )}


        {/* FACE CAMERA */}

        {faceCameraOpen && (

          <div className="verification-camera face-camera">

            <div className="video-wrapper">

              <video
                ref={faceVideoRef}
                autoPlay
                playsInline
                muted
              />

              <div className="face-overlay">

                <div className="face-frame">
                </div>

                <span>
                  Mete vizaj ou nan sèk la
                </span>

              </div>

            </div>


            <div className="camera-buttons">

              <button
                type="button"
                className="take-photo-btn"
                onClick={takeFacePhoto}
              >
                📸 Pran foto vizaj
              </button>

              <button
                type="button"
                className="cancel-camera-btn"
                onClick={closeFaceCamera}
              >
                Fèmen kamera
              </button>

            </div>

          </div>

        )}


        {/* FACE PHOTO */}

        {facePhoto && (

          <div className="verification-result face-result">

            <img
              src={facePhoto}
              alt="Vizaj itilizatè"
            />

            <div className="verification-success">

              <span>
                ✓ Vizaj la verifye avèk siksè
              </span>

              <button
                type="button"
                onClick={retakeFace}
              >
                Pran yon lòt foto
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default IdentityVerification;

import { useEffect, useState } from "react";
import "./ReviewSection.css";
import { supabase } from "../lib/supabase";

const ReviewSection = ({ professionalId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // LOAD REVIEWS
  // =========================================

  useEffect(() => {
    const fetchReviews = async () => {
      if (!professionalId) {
        setLoadingReviews(false);
        return;
      }

      try {
        setLoadingReviews(true);
        setError("");

        const { data, error: reviewsError } = await supabase
          .from("reviews")
          .select("*")
          .eq("professional_id", professionalId)
          .order("created_at", { ascending: false });

        if (reviewsError) {
          console.error("Reviews fetch error:", reviewsError);
          throw reviewsError;
        }

        setReviews(data || []);
      } catch (err) {
        console.error("Fetch reviews error:", err);

        setError(
          err?.message ||
            "Nou pa kapab chaje avis yo kounye a."
        );
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [professionalId]);

  // =========================================
  // SUBMIT REVIEW
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!professionalId) {
      setError(
        "Nou pa jwenn pwofesyonèl ki resevwa avis sa a."
      );
      return;
    }

    if (rating === 0) {
      setError("Tanpri chwazi yon nòt ant 1 ak 5 zetwal.");
      return;
    }

    if (comment.trim() === "") {
      setError("Tanpri ekri yon commentaire.");
      return;
    }

    try {
      setSubmitting(true);

      // =====================================
      // GET CURRENT USER
      // =====================================

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setError(
          "Ou dwe konekte pou w ka bay yon avis."
        );
        return;
      }

      // =====================================
      // INSERT REVIEW
      // =====================================

      const { data: newReview, error: insertError } =
        await supabase
          .from("reviews")
          .insert({
            professional_id: Number(professionalId),
            user_id: user.id,
            rating: Number(rating),
            comment: comment.trim(),
          })
          .select()
          .single();

      if (insertError) {
        console.error(
          "Review insert error:",
          insertError
        );

        throw insertError;
      }

      console.log(
        "NEW REVIEW SAVED:",
        newReview
      );

      // =====================================
      // ADD REVIEW TO SCREEN
      // =====================================

      setReviews((currentReviews) => [
        newReview,
        ...currentReviews,
      ]);

      // =====================================
      // RESET FORM
      // =====================================

      setRating(0);
      setComment("");

      alert("Avis ou a anrejistre avèk siksè! ⭐");
    } catch (err) {
      console.error(
        "Submit review error:",
        err
      );

      setError(
        err?.message ||
          "Gen yon pwoblèm pandan avis la t ap anrejistre."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================
  // CALCULATE AVERAGE
  // =========================================

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) =>
            total + Number(review.rating || 0),
          0
        ) / reviews.length
      : 0;

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    try {
      return new Date(date).toLocaleDateString(
        "fr-FR",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
    } catch {
      return "";
    }
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <section className="reviews-section">

      <div className="reviews-container">

        {/* HEADER */}

        <div className="reviews-header">

          <div>
            <span className="reviews-label">
              AVIS KLIYAN
            </span>

            <h2>
              Sa kliyan yo di
            </h2>

            <p>
              Dekouvri eksperyans lòt kliyan ak
              pwofesyonèl sa a.
            </p>
          </div>

          {/* RATING SUMMARY */}

          <div className="rating-summary">

            <strong>
              {averageRating.toFixed(1)}
            </strong>

            <div className="summary-stars">
              {"★★★★★"}
            </div>

            <span>
              {reviews.length} avis
            </span>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="setup-error">
            {error}
          </div>
        )}

        {/* WRITE REVIEW */}

        <div className="write-review">

          <h3>
            Kijan eksperyans ou te ye?
          </h3>

          <p>
            Bay pwofesyonèl sa a yon nòt epi
            pataje eksperyans ou.
          </p>

          <form onSubmit={handleSubmit}>

            {/* STARS */}

            <div className="review-rating">

              <span>
                Bay yon nòt:
              </span>

              <div className="rating-buttons">

                {[1, 2, 3, 4, 5].map((star) => (

                  <button
                    key={star}
                    type="button"
                    className={
                      star <= rating
                        ? "star-button active"
                        : "star-button"
                    }
                    onClick={() =>
                      setRating(star)
                    }
                    aria-label={`${star} zetwal`}
                    disabled={submitting}
                  >
                    ★
                  </button>

                ))}

              </div>

            </div>

            {/* COMMENT */}

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Ekri commentaire ou sou sèvis la..."
              rows="4"
              disabled={submitting}
            />

            <button
              type="submit"
              className="submit-review"
              disabled={submitting}
            >
              {submitting
                ? "Ap anrejistre..."
                : "Soumèt avis"}
            </button>

          </form>

        </div>

        {/* REVIEWS LIST */}

        <div className="reviews-list">

          {loadingReviews ? (

            <p>
              Ap chaje avis yo...
            </p>

          ) : reviews.length === 0 ? (

            <p>
              Pwofesyonèl sa a poko resevwa okenn avis.
            </p>

          ) : (

            reviews.map((review) => (

              <article
                className="review-card"
                key={review.id}
              >

                <div className="review-top">

                  <div className="review-user">

                    <div className="review-avatar">
                      U
                    </div>

                    <div>
                      <h4>
                        Kliyan
                      </h4>

                      <span>
                        {formatDate(
                          review.created_at
                        )}
                      </span>
                    </div>

                  </div>

                  <div className="review-stars">
                    {"★".repeat(
                      Number(review.rating)
                    )}

                    {"☆".repeat(
                      5 - Number(review.rating)
                    )}
                  </div>

                </div>

                <p className="review-comment">
                  {review.comment}
                </p>

              </article>

            ))

          )}

        </div>

      </div>

    </section>
  );
};

export default ReviewSection;
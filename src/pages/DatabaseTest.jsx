import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const DatabaseTest = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const testDatabase = async () => {
      const { data, error } = await supabase
        .from("professionals")
        .select("*");

      if (error) {
        setError(error.message);
      } else {
        setProfessionals(data);
      }

      setLoading(false);
    };

    testDatabase();
  }, []);

  if (loading) {
    return <h2>Ap teste Supabase...</h2>;
  }

  if (error) {
    return (
      <div>
        <h2>❌ Database pa konekte</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>✅ Supabase konekte!</h1>

      <h2>
        {professionals.length} pwofesyonèl jwenn
      </h2>

      {professionals.map((professional) => (
        <div
          key={professional.id}
          style={{
            marginBottom: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>{professional.name}</h3>
          <p>{professional.profession}</p>
          <p>{professional.location}</p>
          <p>⭐ {professional.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default DatabaseTest;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Professionals from "./pages/Professionals";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";

import ProfessionalProfile from "./pages/ProfessionalProfile";
import ProfessionalContact from "./pages/ProfessionalContact";
import ProfessionalSetup from "./pages/ProfessionalSetup";
import IdentityVerification from "./components/IdentityVerification";
import ProfessionalEdit from "./pages/ProfessionalEdit";
import DatabaseTest from "./pages/DatabaseTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* PROFESSIONALS */}
        <Route
          path="/professionals"
          element={<Professionals />}
        />

        {/* CATEGORIES */}
        <Route
          path="/categories"
          element={<Categories />}
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* PROFESSIONAL PROFILE */}
        <Route
          path="/professional/:id"
          element={<ProfessionalProfile />}
        />

        {/* PROFESSIONAL CONTACT */}
        <Route
          path="/professional/:id/contact"
          element={<ProfessionalContact />}
        />

        {/* PROFESSIONAL SETUP */}
        <Route
          path="/professional-setup"
          element={<ProfessionalSetup />}
        />

        {/* IDENTITY VERIFICATION */}
        <Route
          path="/identity-verification"
          element={<IdentityVerification />}
        />

        {/* SUPABASE DATABASE TEST */}
        <Route
          path="/database-test"
          element={<DatabaseTest />}
        />
          <Route
  path="/profile"
  element={<ProfessionalProfile />}
/>

<Route
  path="/professional/:id/edit"
  element={<ProfessionalEdit />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
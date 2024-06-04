import { useState } from "react";
import Topbar from "../../components/careerComp/topbar/Topbar";
import Menu from "../../components/careerComp/menu/Menu";
import Intro from "../../components/careerComp/intro/Intro";
import Portfolio from "../../components/careerComp/portfolio/Portfolio";
import Works from "../../components/careerComp/works/Works";
import Testimonials from "../../components/careerComp/testimonials/Testimonials";
import Contact from "../../components/careerComp/contact/Contact";
import "./career.scss";

function Career() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="career">
      <Topbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="sections_career">
        <Intro />
        <Portfolio />
        <Works />
        <Testimonials />
        <Contact />
      </div>
    </div>
  );
}

export default Career;

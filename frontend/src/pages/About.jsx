import React from "react";
import KindergartenWelcome from "../components/KindergartenWelcome";
import MissionVisionPage from "../components/MissionVisionPage";
import HistoryTimeline from "../components/HistoryTimeline";
import OurBestTeacher from "../components/OurBestTeachers"
const About = () => {
  return (
    <div>
      <KindergartenWelcome />
      <MissionVisionPage />
      <HistoryTimeline />
      <OurBestTeacher/>
    </div>
  );
};

export default About;

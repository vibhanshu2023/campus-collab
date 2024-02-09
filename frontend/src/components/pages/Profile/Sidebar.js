import React, { useState,useEffect } from "react";
import axios from "axios";
import './Sidebar.css'


function Sidebar({m_strUser}) {

  const[profiles,setProfiles]=useState([]);
  useEffect(() => {
    const username=JSON.parse(localStorage.getItem('msalAccount'))[
      "username"
    ]
    axios.get(`http://localhost:8080/getprofile?userid=${username}`)
      .then(Profile => {
        setProfiles(Profile.data);
      })
      .catch(err => console.log(err));
  }, [m_strUser]);
  

  console.log(profiles);

  
  const [activeSection, setActiveSection] = useState("profile");

  const handleSectionToggle = (section) => {
    setActiveSection(activeSection === section ? section : section);
  };
  return (
    <div className="app">
      <div className="profile-nav">
        <div
          className={
            activeSection === "profile"
              ? "view-profile-open"
              : "view-profile-close"
          }
        >
          <button
            className="profile-btn"
            onClick={() => handleSectionToggle("profile")}
          >
            <img src=""></img>Profile {activeSection === "profile" ? "▲" : "▼"}
          </button>

          {activeSection === "profile" && (
            <div className="profile-details">
              <div className="profile-head">
                <img src=""></img>
                <div className="profile-name">
                  <p className="p1">{profiles.map(profile => profile.name)}</p>
                  
                </div>
              </div>
              <div className="profile-origin">

                <div className="profile-know">
                  <p className="p3">Web Development</p>
                  <p className="p4">UI Design</p>
                </div>

                <div className="education">
                  <div><img src=""></img> <p>{profiles.map(profile => profile.branch)}</p></div>
                  <div> <img src=""></img><p>I{profiles.map(profile => profile.institute)}</p></div>
                </div>
                
              </div>

              <button className="line"></button>

              {/* <div className="profile-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div> */}
            </div>

          )}
        </div>

        <div
          className={
            activeSection === "expertise"
              ? "view-expertise-open"
              : "view-expertise-close"
          }
        >
          <button
            className="profile-btn"
            onClick={() => handleSectionToggle("expertise")}
          >
            <img src=""></img>Expertise{" "}
            {activeSection === "expertise" ? "▲" : "▼"}
          </button>
          {activeSection === "expertise" && (
            <div className="expertise-details">
              <button className="line"></button>
              {/* <ul>
                <li>Backend Dev</li>
                <li>UI Design</li>
                <li>Frontend Dev</li>
                <li>Product Management</li>
                <li>Aero-modelling</li>
                <li>Web Development</li>
              </ul> */}
              <div className="data1"><img src=""></img>Backend Dev <img src=""></img></div>
              <div className="data1"><img src=""></img>UI Design<img src=""></img></div>
              <div className="data1"><img src=""></img>Frontend Dev<img src=""></img></div>
              <div className="data1"><img src=""></img>Product Managemen<img src=""></img></div>
              <div className="data1"><img src=""></img>Aero-modelling<img src=""></img></div>
              <div className="data1"><img src=""></img>Web Development<img src=""></img></div>
            </div>
          )}
        </div>
        <div className="view-profile-close">
          <button className="profile-btn">
            {" "}
            <img src=""></img> Courses
          </button>
        </div>
        {/* <div className="view-profile-close">
          <button className="profile-btn">
            {" "}
            <img src=""></img>Get In Touch
          </button>
        </div> */}
      </div>
      <div>
        <button className="edit-profile-btn">Edit Profile</button>
      </div>
    </div>
  );
}

export default Sidebar;
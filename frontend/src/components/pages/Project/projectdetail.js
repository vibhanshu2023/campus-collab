import React, { useState, useEffect } from "react";
import Navbar from "../../header/Navbar";
// import "./PostedProject.css";
// import "./Review.css";
import "./projectdetail.css";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams to extract parameters
import Review from "./Review";
import thumbsUp from "../../assets/thumbs-up.png";

const Project = () => {
  const { projectId } = useParams(); // Extract project ID from URL
  const [projects, setProjects] = useState([]); // Initialize projects state as an empty array
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [profiles, setProfiles] = useState([]);
  const storedUserData = localStorage.getItem("user"); // Retrieve the stored user data

  const user = JSON.parse(storedUserData); // Parse the stored user data from JSON to JavaScript object

  useEffect(() => {
    axios
      .get(`http://localhost:8050/api/profile/${user.uid}`)
      .then((Profile) => {
        console.log(Profile);
        setProfiles(Profile.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Fetch project details using project ID
    const fetchProjectDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8050/api/Project/${projectId}`
        );
        if (response.data.status === "success") {
          setProjects(response.data.data); // Set projects state to the array of project data
          setComments(response.data.data.comments || []); // Set comments state from fetched project data
        } else {
          console.error(
            "Failed to fetch project details:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetail();
  }, [projectId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8050/api/comments/${projectId}`
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [projectId]);

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8050/api/comments", {
        projectId,
        userName: profiles.name, // Replace with actual username or fetch from authentication
        image: profiles.imageUrl,
        content: newComment,
      });
      console.log(response);
      if (response.data.status === "success") {
        setComments([...comments, response.data.comment]);
        setNewComment("");
      } else {
        console.error("Failed to post comment:", response.data.message);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  //LIKES

  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);

  const handleLikeClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:8050/api/projectslike/${projectId}/${user.uid}/like`,
        { method: "POST" }
      );
      if (response.ok) {
        setLiked(!liked);
        setTotalLikes((prevTotalLikes) =>
          liked ? prevTotalLikes - 1 : prevTotalLikes + 1
        );
      } else {
        console.error("Failed to update like status");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };
  //LIKES END

  //Collaboration

  const [text, setText] = useState("");
  const [receiverId, setReceiverId] = useState("");

  const handleCollaboration = async () => {
    try {
      const senderName = profiles.name; // Assuming profiles contains sender information

      let projectName = ""; // Initialize projectName

      // Check if projects array is not empty and projects[0].name is defined
      if (projects.length > 0 && projects[0].name) {
        projectName = projects[0].name; // Assign projectName if conditions are met
      } else {
        console.error("Project name is not available.");
        return; // Exit the function if project name is not available
      }

      const messageText = `Message from ${senderName} regarding project ${projectName}: ${text}`;

      const requestBody = {
        text: messageText,
        senderId: senderName, // Assuming senderName is the sender's name
        receiverId: projectName, // Assign receiverId using projectName
      };

      console.log(requestBody);

      // Send POST request to the server
      await axios.post("http://localhost:8050/api/messages", requestBody);
      alert("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="pd-project-main-pp">
        <div className="pd-content-shown-pp">
          <form>
            <div className="pd-Id-div-pp">
              <input
                type="text"
                className="pd-project-projectId"
                placeholder="Enter Project ID (Compulsory)"
                value={projectId}
                readOnly // Make the input read-only
              />
            </div>
            <h1>Project Detail</h1>
            {projects && projects.length > 0 && (
              <div>
                <h2>Project ID: {projects[0].projectId}</h2>
                <p>Email: {projects[0].email}</p>
                <p>
                  Images: <img src={projects[0].images} alt="Project Image" />
                </p>
                <h3>Input Fields:</h3>
                <ul>
                  {projects[0].inputFields.map((field, index) => (
                    <li key={index}>
                      Type: {field.type}, Value: {field.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="pd-review-section">
        <div className="pd-heading">
          Project Heading
          <p className="pd-update-btn">Completed</p>
        </div>

        <div className="pd-section">
          <div className="pd-user-info">
            <div className="pd-user-user">
              <div className="pd-user-name">
                Owner
                {projects.length > 0 && (
                  <div className="pd-my-name">
                    <img src=""></img>
                    <div className="pd-final-name">
                      <p className="pd-p1">{projects[0].name}</p>
                      <p className="pd-p2">134 projects - 3 following</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="pd-about-proj">
                <div className="pd-category">
                  Category
                  <div className="pd-cat-names">
                    <div className="pd-badge1">Web Development</div>
                    <div className="pd-badge2">App Development</div>
                  </div>
                </div>
                <div className="pd-tools-used">
                  Tools Used
                  <p>Figma, React.js, VS Code, NodeJs</p>
                </div>
              </div>
            </div>
            <button className="pd-edit-me">Edit Project</button>
            <button onClick={handleCollaboration}>Collaborate</button>
          </div>

          <div className="pd-right-review">
            {/* <div className="pd-right-review"> */}
            <div className="pd-right-head">
              <p>Reviews & Feedback</p>
              <button onClick={handleLikeClick}>
                {liked ? "Unlike" : "Like"} {totalLikes}
              </button>
            </div>
            {/* </div> */}

            {/* <button onClick={() => handleCollaborationRequest(projectId)}>Request Collaboration</button> */}
            <div className="pd-right-content">
              <div className="pd-post-div">
                <input
                  type="text"
                  placeholder="What are your comments on this project?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="pd-post-btn" onClick={handleCommentSubmit}>
                  POST
                </button>
              </div>
              <div className="pd-posted-reviews">
                {comments.map((comment) => (
                  <div className="pd-one-post" key={comment._id}>
                    <img className="pd-poster-pic" src={comment.image}></img>

                    <div className="pd-poster-content">
                      <div className="pd-div-1">
                        <div className="pd-d1">{comment.userName}</div>
                        <div className="pd-d2">&nbsp;. {comment.createdAt}</div>
                      </div>
                      <div className="pd-the-comment">{comment.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;

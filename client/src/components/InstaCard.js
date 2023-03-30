import { useMutation } from "@apollo/client";
import { useState } from "react";
import { Button, Card, Form, Image } from "react-bootstrap";
import { FaRegClock } from "react-icons/fa";
import { CREATE_COMMENT } from "../utils/mutations";
import Auth from "../utils/auth";

const images = {};
function importAll(r) {
  r.keys().forEach((key) => (images[key] = r(key)));
}
importAll(require.context("../assets", false, /\.jpg$/));

function getTimeSince(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  const elapsed = now - date;
  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }
}

export default function InstaCard({
  imageSrc,
  videoSrc,
  profilePic,
  caption,
  likes,
  user,
  timestamp,
  comments,
  post,
}) {
  const [createComment, { data }] = useMutation(CREATE_COMMENT);
  const [stateComments, setStateComments] = useState(comments);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  
  const timeSince = getTimeSince(timestamp);


  const handleComment = async (event) => {
    event.preventDefault();
    if (Auth.loggedIn()) {
      try {
        await createComment({
          variables: {
            post: post,
            comment: comment,
            username: Auth.getProfile().data.username,
          },
        });
        setStateComments((prev) => [
          ...prev,
          {
            post: post,
            comment: comment,
            username: Auth.getProfile().data.username,
          },
        ]);
      } catch (e) {
        console.error(e);
      }
      setComment("");
    }
  };
  const handleChange = (event) => {
    const { value } = event.target;
    setComment(value);
  };
  const viewComments = () => {
    setShowComments(!showComments);
    console.log(comments);
  };
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Card style={{ width: "600px", marginBottom: "20px" }}>
        <Card.Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              src={images[profilePic]}
              roundedCircle
              style={{ width: "60px", height: "60px", marginRight: "20px" }}
            />
            <div>
              <p style={{ margin: "0" }}>{user}</p>
            </div>
          </span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaRegClock style={{ marginRight: "5px" }} />
            <p style={{ margin: "0" }}>{timeSince}</p>
          </div>
        </Card.Header>
        {videoSrc ? (
          <Card.Img variant="top" src={images["./animal.jpg"]} />
        ) : (
          <Card.Img variant="top" src={images[imageSrc]} />
        )}
        <Card.Body>
          <Card.Text>{caption}</Card.Text>
          <Button variant="primary">{likes} Like</Button>
        </Card.Body>
        <Card.Body>
          <Form>
            <span
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleComment}>
                  Post Comment
                </Button>
              </span>
              <Button
                variant="primary"
                style={{ height: "50px" }}
                onClick={viewComments}
              >
                View comments
              </Button>
            </span>
          </Form>
          {showComments && (
            <div>
              <h4>Comments:</h4>
              {stateComments && (
                <div>
                  {stateComments.map((comment, idx) => {
                    if (comment.comment !== "") {
                      return (
                        <>
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <p style={{ margin: "0" }}>
                                {comment.username} :{" "}
                              </p>
                              <p> {comment.comment}</p>
                            </span>
                          </div>
                          <hr key={idx + "br"} />
                        </>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

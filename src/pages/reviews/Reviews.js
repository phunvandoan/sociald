import { useContext, useEffect, useRef, useState } from "react";
import Wrapper from "../../components/wrapper/Wrapper";
import axios from "axios";
import ItemReview from "../../components/itemReview/ItemReview";
import "./reviews.css";
import { Rating } from "@mui/material";
import { Cancel, FileCopySharp } from "@mui/icons-material";
import { upload } from "../../apiCall";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "react-bootstrap";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [valueRating, setValueRating] = useState(0);
  const [showCreateReview, setShowCreateReview] = useState(false);
  const { user: currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const inputRef = useRef();
  useEffect(() => {
    const getAllReviews = async () => {
      try {
        const res = await axios.get(
          `https://backenddofscocial-1.onrender.com/api/reviews/getAllReview`
        );
        setReviews(res.data.reverse());
      } catch (err) {
        console.log(err);
      }
    };
    getAllReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (valueRating) {
      const newReview = {
        userId: currentUser._id,
        text: inputRef.current.value,
        rating: valueRating,
      };
      if (file) {
        const data = new FormData();
        const fileName = Date.now() + file.name;
        data.append("name", fileName);
        data.append("file", file);
        newReview.img = fileName;
        try {
          await axios.post(
            "https://backenddofscocial-1.onrender.com/api/upload",
            data
          );
          console.log("updateSuccess");
        } catch (err) {
          console.log(err);
        }
      }
      try {
        const res = await axios.post(
          `https://backenddofscocial-1.onrender.com/api/reviews`,
          newReview
        );
        setReviews([res.data, ...reviews]);
        inputRef.current.value = "";
        setShowCreateReview(false);
        setValueRating(0);
        setFile(null);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("you need choose star rating ");
    }
  };

  const handleDelete = async (review) => {
    try {
      await axios.delete(
        `https://backenddofscocial-1.onrender.com/api/delete/${review.img}`
      );
    } catch (err) {
      console.log(err);
    }
    try {
      axios.delete(
        `https://backenddofscocial-1.onrender.com/api/reviews/${review._id}`,
        {
          data: {
            userId: currentUser._id,
            isAdmin: currentUser.isAdmin,
          },
        }
      );
      setReviews(reviews.filter((r) => r._id !== review._id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (review) => {
    if (showCreateReview === true) {
      let newReview = {};
      if (currentUser.isAdmin) {
        newReview = {
          isAdmin: currentUser.isAdmin,
          text: inputRef.current.value,
          rating: valueRating,
        };
      } else {
        newReview = {
          userId: currentUser._id,
          text: inputRef.current.value,
          rating: valueRating,
        };
      }

      try {
        await axios.delete(
          `https://backenddofscocial-1.onrender.com/api/delete/${review.img}`
        );
      } catch (err) {
        console.log(err);
      }
      if (file) {
        const data = new FormData();
        const fileName = Date.now() + file.name;
        data.append("name", fileName);
        data.append("file", file);
        newReview.img = fileName;
        try {
          await axios.post(
            "https://backenddofscocial-1.onrender.com/api/upload",
            data
          );
          console.log("updateSuccess");
        } catch (err) {
          console.log(err);
        }
      }
      try {
        axios.put(
          `https://backenddofscocial-1.onrender.com/api/reviews/${review._id}`,
          newReview
        );
        setReviews(
          reviews.map((r) => {
            if (r._id === review._id) {
              if (newReview.text) r.text = newReview.text;
              if (newReview.rating) r.rating = newReview.rating;
              if (newReview.img) r.img = newReview.img;
            }
            return r;
          })
        );
        inputRef.current.value = "";
        setShowCreateReview(false);
        setValueRating(0);
        setFile(null);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("bạn vẫn chưa hộp thoại để sửa mà ");
    }
  };

  return (
    <Wrapper sologan="write your review about me here ">
      <button
        className="buttonCreateReview"
        onClick={() => setShowCreateReview(!showCreateReview)}
      >
        create review
      </button>
      {showCreateReview && (
        <form
          className="reviewForm"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <input
            type="text"
            className="textReviewForm"
            ref={inputRef}
            placeholder="write your review "
          />
          <label htmlFor="fileReviewForm">
            <FileCopySharp />
            <input
              type="file"
              id="fileReviewForm"
              accept=".png, .jpeg, .jpg, .mp4"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
          </label>

          <Rating
            name="simple-controlled"
            value={valueRating}
            onChange={(event, newValue) => {
              setValueRating(newValue);
            }}
          />
          <Button
            className="submitCreateReview"
            type="submit"
            variant="success"
          >
            submit
          </Button>
          {file && (
            <div className="reviewImgContainer">
              {(file.type === "image/png" ||
                file.type === "image/jpeg" ||
                file.type === "image/jpeg") && (
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="reviewImg"
                />
              )}
              {file.type === "video/mp4" && (
                <video
                  controls
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="reviewImg"
                ></video>
              )}

              <Cancel
                className="reviewCancelImg"
                onClick={() => setFile(null)}
              />
            </div>
          )}
        </form>
      )}
      {reviews.map((review) => (
        <ItemReview
          review={review}
          onDelete={() => handleDelete(review)}
          onUpdate={() => handleUpdate(review)}
          key={review._id}
        ></ItemReview>
      ))}
    </Wrapper>
  );
}

export default Reviews;

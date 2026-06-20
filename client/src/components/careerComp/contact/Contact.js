import { useState } from "react";
import "./contact.scss";

function Contact() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [message, setMessage] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(true);
  };
  return (
    <div id="contact" className="contact">
      <div className="left">
        <img src={`${PF}imgCareer/shake.svg`} alt="" />
      </div>
      <div className="right">
        <h2>Contact.</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Email" />
          <textarea placeholder="Tin nhắn"></textarea>
          <button type="submit">Gửi</button>
          {message && <span>Cảm ơn, tôi sẽ trả lời sớm nhất :)</span>}
        </form>
      </div>
    </div>
  );
}

export default Contact;

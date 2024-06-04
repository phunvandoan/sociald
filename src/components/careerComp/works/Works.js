import Carousel from "react-bootstrap/Carousel";
import "./works.scss";

export default function Works() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const data = [
    {
      id: "1",
      icon: `${PF}/imgCareer/mobile.png`,
      title: "Web Design",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      img: "https://99designs-blog.imgix.net/blog/wp-content/uploads/2018/10/attachment_100040756-e1538485934255.jpeg?auto=format&q=60&fit=max&w=930",
    },
    {
      id: "2",
      icon: `${PF}/imgCareer/globe.png`,
      title: "Mobile Application",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      img: "https://i.pinimg.com/originals/e9/c9/2f/e9c92f7869d682a6fa5a97fb8a298f30.jpg",
    },
    {
      id: "3",
      icon: `${PF}/imgCareer/writing.png`,
      title: "Branding",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      img: "https://i.pinimg.com/originals/a9/f6/94/a9f69465d972a004ad581f245d6ad581.jpg",
    },
  ];

  return (
    <div className="works" id="works">
      <Carousel className="slider">
        {data.map((d) => (
          <Carousel.Item key={d.id}>
            <div className="container">
              <div className="item">
                <div className="left">
                  <div className="leftContainer">
                    <div className="imgContainer">
                      <img src={d.icon} alt={d.title} />
                    </div>
                    <h2>{d.title}</h2>
                    <p>{d.desc}</p>
                    <span>Projects</span>
                  </div>
                </div>
                <div className="right">
                  <img src={d.img} alt={d.title} />
                </div>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

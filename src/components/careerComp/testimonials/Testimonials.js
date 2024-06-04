import "./testimonials.scss";

function Testimonials() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const PFIC = process.env.REACT_APP_PUBLIC_FOLDER_IMAGE_CAREER;

  const data = [
    {
      id: 1,
      name: "Phùng Văn Đoàn",
      title: "Senior Developer",
      img: `${PF}person/noAvatar.png`,
      icon: `${PFIC}/twitter.png`,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat magnam dolorem.",
      featured: true,
    },
    {
      id: 2,
      name: "Dương Quang Thái",
      title: "Co-Founder of DELKA",
      img: `${PF}person/noAvatar.png`,
      icon: `${PFIC}/youtube.png`,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat magnam dolorem recusandae perspiciatis ducimus vel hic temporibus. ",
      featured: true,
    },
    {
      id: 3,
      name: "Le Thi Kieu Ngan",
      title: "CEO of ALBI",
      img: `${PF}person/noAvatar.png`,
      icon: `${PFIC}/linkedin.png`,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat magnam dolorem",
      featured: true,
    },
  ];
  return (
    <div className="testimonials" id="testimonials">
      <h1>Member</h1>
      <div className="container">
        {data.map((d) => (
          <div className={d.featured ? "card featured" : "card"}>
            <div className="top">
              <img src={`${PFIC}/right-arrow.png`} className="left" alt="" />
              <img src={d.img} alt="" className="user" />
              <img src={d.icon} alt="" className="right" />
            </div>
            <div className="center">{d.desc}</div>
            <div className="bottom">
              <h3>{d.name}</h3>
              <h4>{d.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;

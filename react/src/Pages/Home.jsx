import Navbar from "../components/Navbar";
import knowl from "../Assets/knowl.jpg";
function Home(){
    return(
        <>
<div style={{
      height: "100%",
        backgroundColor: "#F0FFF0",
}}>
    <div>
<div
  className="container"
  style={{
    backgroundImage: `url(${knowl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "60px",
    paddingBottom: "200px",
    minHeight: "100vh",
    color: "white",
    backgroundColor: "rgba(0,0,0,0.4)",
    backgroundBlendMode: "darken"
  }}
>
  <h1
    style={{
      textAlign: "center",
      paddingTop: "20px",
      fontFamily: "Arial",
      fontSize: "50px",
      color: "white",
backgroundColor: "rgba(0,0,0,0.4)",
backgroundBlendMode: "darken",
    }}
  >
    Welcome to this site
  </h1>

  <p style={{ fontSize: "24px", lineHeight: "1.6" }}>
    This platform is designed to help individuals learn new skills and expand
    their knowledge in a practical and engaging way. Our mission is to provide
    high-quality educational resources that support continuous learning and
    professional growth.
  </p>
</div>
</div>
</div>
</>
    );
}
export default Home;
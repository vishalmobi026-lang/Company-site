
function Navbar({setPage}){
    return (
<nav style={{
    backgroundColor:"black",
    position:"fixed",
    top:"0",
    left:"0",
    color:"white",
    padding:"15px",
    width:"100%",
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
     boxSizing: "border-box" 
    }}>
<div>
    <img src="" alt="companylogo" style={{ height: "30px" }} />
    
</div>
<ul style={{
    display:"flex",
    gap:"25px",
    listStyle:"none",
    justifyContent:"center",

    }}>

    <li onClick={()=>setPage("Home")} style={{cursor:"pointer"}}>Home</li>
    <li onClick={()=>setPage("About")} style={{cursor:"pointer"}}>About</li>
     <li onClick={()=>setPage("Contact")} style={{cursor:"pointer"}}>Contact</li>
</ul>
</nav>
    );
}
export default Navbar;
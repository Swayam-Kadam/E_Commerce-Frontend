import loading from "@/assets/images/gif/loader.gif";
import { useSelector } from "react-redux";
const PageLoader = ({ loadingState = false }) => {
  const  pageLoader  = useSelector((state) => state.login);
  return (
    <div className={`loader ${pageLoader || loadingState ? "show" : ""}`} style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
      <img src={loading} alt="Loading..." width={"60px"} />
    </div>
  );
};
export default PageLoader;

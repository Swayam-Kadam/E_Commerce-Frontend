import loading from "@/assets/images/gif/loader.gif";

const PageLoader = ({ loadingState = true }) => {
  if (!loadingState) return null;

  return (
    <div
      className="loader show"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <img src={loading} alt="Loading..." width={"60px"} />
    </div>
  );
};
export default PageLoader;

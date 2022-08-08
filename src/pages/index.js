import Layout from "../hocs/Layout";

const HomePage = () => (
  <Layout content="Home page for Metadados Rio">
    <div className="p-5 bg-light rounded-3">
      <div className="container-fluid py-3">
        <h1 className="display-5 fw-bold">Home Page</h1>
        <p className="fs-4 mt-3">Welcome to Metadados Rio!</p>
      </div>
    </div>
  </Layout>
);

export default HomePage;

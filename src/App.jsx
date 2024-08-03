import { ToastContainer } from "react-toastify";
import List from "./List";

function App() {
  return (
    <div className="container">
      <ToastContainer position="top-center" />
      <List />
    </div>
  );
}

export default App;

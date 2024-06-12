import "./App.css";
import { Routes , Route } from "react-router-dom";
import Home from "./pages/Home.jsx"
// import NavBar from "./Components/common/NavBar.jsx";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex-col font-inter">
      {/* <NavBar/> */}
      <Routes>
        <Route path="/" element={<Home/>}></Route>
      </Routes>
    </div>
  );
}

export default App;

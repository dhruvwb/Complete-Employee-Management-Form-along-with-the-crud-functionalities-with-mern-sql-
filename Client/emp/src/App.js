import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Reg from "./Component/Employee Registration/Reg";
import ListOfAllEmp from "./Component/Employee Registration/ListOfAllEmp";
import { Routes, Route } from "react-router-dom";
import GetSingleUser from "./Component/Employee Registration/GetSingleUser";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Reg />} />
      <Route path="/ListofAllEmp" element={<ListOfAllEmp />} />
      <Route path="/GetSingleUser/:id" element={<GetSingleUser />} />
    </Routes>
  );
}

export default App;

import Home from './pages/Home';
import Nav from './Components/Nav';
import { Route, Routes } from "react-router-dom";

function App() {

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home/>}/>
        {/* <Route path="/currencies" element={<Currencies/>}/>
        <Route path="/price/:symbol" element={<Price/>}/> */}
      </Routes>
    </>
  );
}

export default App
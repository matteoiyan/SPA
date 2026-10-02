import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Player from "./pages/Player";
import Profile from "./pages/Profile";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/video/:id" element={<Player />} />
        <Route path="/profile" element={<Profile />} />
      </Routes></Layout>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import Heroes from "./Pages/Pages/Heroes/Heroes";
import Posts from "./Pages/Pages/Posts/Posts";
import Series from "./Pages/Pages/Series/Series";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Pages/Authentication/AuthContext";
import Authentication from "./Pages/Authentication/Authentication";
import PrivateRoutes from "./Pages/Authentication/PrivateRoutes";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Home from "./Pages/Pages/Home/Home";
import AddPost from "./Pages/Pages/Posts/AddPost";
import UpdatePost from "./Pages/Pages/Posts/UpdatePost";
import AddSeries from "./Pages/Pages/Series/AddSeries";
import UpdateSeries from "./Pages/Pages/Series/UpdateSeries";
import DetailSeries from "./Pages/Pages/Series/DetailSeries";
import AddSeriesPart from "./Pages/Pages/SeriesPart/AddSeriesPart";
import UpdateSeriesPart from "./Pages/Pages/SeriesPart/UpdateSeriesPart";

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Authentication />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Dashboard />}>
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/heroes" element={<Heroes />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/add-post" element={<AddPost />} />
                <Route path="/update-post/:id" element={<UpdatePost />} />
                <Route path="/series" element={<Series />} />
                <Route path="/add-series" element={<AddSeries />} />
                <Route path="/update-series/:id" element={<UpdateSeries />} />
                <Route path="/detail-series/:id" element={<DetailSeries />} />
                <Route
                  path="/series/:id/add-part"
                  element={<AddSeriesPart />}
                />
                <Route
                  path="/update-series-part/:id"
                  element={<UpdateSeriesPart />}
                />
              </>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;

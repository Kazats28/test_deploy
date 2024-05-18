import HomePage from "../pages/HomePage.jsx";
import FavoriteList from "../pages/FavoriteList.jsx";
import MediaDetail from "../pages/MediaDetail.jsx";
import MediaList from "../pages/MediaList.jsx";
import MediaSearch from "../pages/MediaSearch.jsx";
import PasswordUpdate from "../pages/PasswordUpdate.jsx";
import BookingList from "../pages/BookingList.jsx";
import ProtectedPage from "../components/common/ProtectedPage.jsx";
import AddedMovieList from "../pages/AddedMovieList.jsx";
import ProtectedPageAdmin from "../components/common/ProtectedPageAdmin.jsx";
import AddMovie from "../pages/AddMovie.jsx";
import FixMovie from "../pages/FixMovie.jsx";
import React from 'react';
export const routesGen = {
  home: "/",
  mediaList: "/movie",
  mediaDetail: (id) => `/movie/${id}`,
  mediaSearch: "/search",
  favoriteList: "/favorites",
  bookingList: "/bookings",
  passwordUpdate: "/password-update",
  addMovie: "/addmovie",
  listMovie: "/listmovie",
  update: (id) => `/update/${id}`
};

const routes = [
  {
    index: true,
    element: <HomePage />,
    state: "home"
  },
  {
    path: "/search",
    element: <MediaSearch />,
    state: "search"
  },
  {
    path: "/password-update",
    element: (
      <ProtectedPage>
        <PasswordUpdate />
      </ProtectedPage>
    ),
    state: "password.update"
  },
  {
    path: "/favorites",
    element: (
      <ProtectedPage>
        <FavoriteList />
      </ProtectedPage>
    ),
    state: "favorites"
  },
  {
    path: "/bookings",
    element: (
      <ProtectedPage>
        <BookingList />
      </ProtectedPage>
    ),
    state: "bookings"
  },
  {
    path: "/movie",
    element: <MediaList />
  },
  {
    path: "/movie/:id",
    element: <MediaDetail />
  },
  {
    path: "/addmovie",
    element: (
      <ProtectedPageAdmin>
        <AddMovie />
      </ProtectedPageAdmin>
    ),
    state: "add"
  },
  {
    path: "/listmovie",
    element: (
      <ProtectedPageAdmin>
        <AddedMovieList />
      </ProtectedPageAdmin>
    ),
    state: "list"
  },
  {
    path: "/update/:id",
    element: (
      <ProtectedPageAdmin>
        <FixMovie />
      </ProtectedPageAdmin>
    ),
    state: "update"
  }
];

export default routes;
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import "bootstrap/dist/css/bootstrap.min.css";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
import FriendFinder from "./pages/FriendFinder";
import FriendList from "./pages/FriendList";
import Login from "./pages/Login";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Timeline from "./pages/Timeline";

const client = new ApolloClient({
  link: createUploadLink({
    uri: "/graphql",
  }),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Container fluid>
          <Row>
            <Col md={3}>
              <Navigation />
            </Col>
            <Col
              md={9}
              className="d-flex justify-content-center align-items-center"
            >
              <Routes>
                <Route path="/" element={<Timeline />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/post" element={<Post />} />
                <Route path="/addFriend" element={<FriendFinder />} />
                <Route path="/friendList" element={<FriendList />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;

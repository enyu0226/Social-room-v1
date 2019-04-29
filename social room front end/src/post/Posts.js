import React, { Component } from "react";
import { list } from "./apiPost";
import DefaultPost from "../images/cutePig.jpg";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      page: 1
    };
  }

  loadPosts = page => {
    list(page).then(data => {
      if (data) {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ posts: data });
        }
      }
    });
  };

  componentDidMount() {
    this.loadPosts(this.state.page);
  }

  loadMore = number => {
    this.setState({ page: this.state.page + number });
    this.loadPosts(this.state.page + number);
  };

  loadLess = number => {
    this.setState({ page: this.state.page - number });
    this.loadPosts(this.state.page - number);
  };

  renderPosts = posts => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : " Unknown";

          return (
            <div className="card col-md-4" key={i} style={{ margin: 20 }}>
              <div className="card-body">
                <Link to={`/user/${post.postedBy._id}`}>
                  <img
                    style={{
                      borderRadius: "50%",
                      border: "1px solid black"
                    }}
                    className="float-left mr-2"
                    height="30px"
                    width="30px"
                    onError={i => (i.target.src = `${DefaultProfile}`)}
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${
                      post.postedBy._id
                    }`}
                    alt={posterName}
                  />
                </Link>
                &nbsp;
                <span style={{ fontSize: 20 }}>{posterName}</span>
                <br />
                <br />
                <img
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${
                    post._id
                  }`}
                  alt={post.title}
                  onError={i => (i.target.src = `${DefaultPost}`)}
                  className="img-thunbnail mb-3"
                  style={{
                    height: "200px",
                    width: "100%",
                    objectFit: "contain"
                  }}
                />
                <h5 className="card-title text-center">{post.title}</h5>
                <p className="card-text text-center">
                  {post.body.length > 100
                    ? post.body.substring(0, 100) + "..."
                    : post.body.substring(0, 100)}
                </p>
                <p className="font-italic mark text-center">
                  on {new Date(post.created).toDateString()}
                </p>
                <div className="text-center">
                  <Link
                    to={`/post/${post._id}`}
                    className="btn btn-raised btn-primary btn-sm text-center"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts, page } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5 text-center">
          {!posts.length
            ? "No post yet!"
            : posts.length > 1
            ? "Recent Posts"
            : "Recent Post"}
        </h2>

        {this.renderPosts(posts)}

        {page > 1 ? (
          <button
            className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
            onClick={() => this.loadLess(1)}
          >
            Previous ({this.state.page - 1})
          </button>
        ) : (
          ""
        )}

        {posts.length ? (
          <div className="text-center">
            <button
              className="btn btn-raised btn-success mt-5 mb-5 text-center"
              onClick={() => this.loadMore(1)}
            >
              Next ({page + 1})
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Posts;

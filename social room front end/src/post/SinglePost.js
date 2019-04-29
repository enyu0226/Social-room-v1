import React, { Component, Fragment } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import DefaultPost from "../images/cutePig.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Comment from "./Comment";
import DefaultProfile from "../images/avatar.png";

const cardContentStyle = {
  marginLeft: 20,
  marginRight: 20
};

class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: []
  };

  checkLike = likes => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments
        });
      }
    });
  };

  updateComments = comments => {
    this.setState({ comments });
  };

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({ redirectToSignin: true });
      return false;
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;

    callApi(userId, token, postId).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length
        });
      }
    });
  };

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your post?");
    if (answer) {
      this.deletePost();
    }
  };

  renderUserImageAndNameLink = post => {
    const posterName = post.postedBy ? post.postedBy.name : " Unknown";
    return (
      <div style={cardContentStyle}>
        <Link to={`/user/${post.postedBy._id}`}>
          <img
            style={{
              borderRadius: "50%",
              border: "1px solid black"
            }}
            className="float-left mr-2"
            height="100px"
            width="100px"
            onError={i => (i.target.src = `${DefaultProfile}`)}
            src={`${process.env.REACT_APP_API_URL}/user/photo/${
              post.postedBy._id
            }`}
            alt={posterName}
          />
        </Link>
        &nbsp;
        <span style={{ fontSize: 50 }}>{posterName}</span>
        {/* <span
          style={cardContentStyle}
          style={{ fontSize: 25 }}
   
        >
          &nbsp; &nbsp; on {new Date(post.created).toDateString()} posted:
        </span> */}
      </div>
    );
  };
  renderPost = post => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " Unknown";

    const { like, likes } = this.state;

    return (
      <Fragment>
        <br />
        <div className="card">
          <div className="card-body">
            <br />
            <br />
            {this.renderUserImageAndNameLink(post)}

            <h4 className="display-4 mt-5 mb-5 text-center">{post.title}</h4>

            <img
              src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
              alt={post.title}
              onError={i => (i.target.src = `${DefaultPost}`)}
              className="img-thunbnail mb-3"
              style={{
                height: "300px",
                width: "100%",
                objectFit: "contain"
              }}
            />
            {like ? (
              <h3 onClick={this.likeToggle} style={cardContentStyle}>
                <i
                  className="fa fa-thumbs-up text-white bg-info"
                  style={{ padding: "10px", borderRadius: "50%" }}
                />{" "}
                {likes} Like
              </h3>
            ) : (
              <h3 onClick={this.likeToggle} style={cardContentStyle}>
                <i
                  className="fa fa-thumbs-up text-info bg-white"
                  style={{ padding: "10px", borderRadius: "50%" }}
                />{" "}
                {likes} Like
              </h3>
            )}
            <br />
            <p className="card-text" style={cardContentStyle}>
              {post.body}
            </p>
            <br />

            <div className="text-center">
              <Link
                to={`/`}
                className="btn btn-raised btn-primary btn-sm mr-5"
                style={{
                  borderRadius: 25,
                  paddingRight: 20,
                  paddingLeft: 20,
                  paddingTop: 10,
                  paddingBottom: 10,
                  margin: 20
                }}
              >
                Back to posts
              </Link>

              {isAuthenticated().user &&
                isAuthenticated().user._id === post.postedBy._id && (
                  <>
                    <Link
                      to={`/post/edit/${post._id}`}
                      className="btn btn-raised btn-warning btn-sm mr-5"
                      style={{
                        borderRadius: 25,
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingRight: 20,
                        paddingLeft: 20,
                        margin: 20
                      }}
                    >
                      Update Post
                    </Link>
                    <button
                      onClick={this.deleteConfirmed}
                      className="btn btn-raised btn-danger"
                      style={{
                        margin: 20
                      }}
                    >
                      Delete Post
                    </button>
                  </>
                )}

              <div>
                {isAuthenticated().user &&
                  isAuthenticated().user.role === "admin" && (
                    <div class="card mt-5">
                      <div className="card-body">
                        <h5 className="card-title">Admin</h5>
                        <p className="mb-2 text-danger">
                          Edit/Delete as an Admin
                        </p>
                        <Link
                          to={`/post/edit/${post._id}`}
                          className="btn btn-raised btn-warning btn-sm mr-5"
                        >
                          Update Post
                        </Link>
                        <button
                          onClick={this.deleteConfirmed}
                          className="btn btn-raised btn-danger"
                        >
                          Delete Post
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  render() {
    const { post, redirectToHome, redirectToSignin, comments } = this.state;

    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }

    return (
      <div className="container">
        {!post ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}

        <Comment
          postId={post._id}
          comments={comments.reverse()}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}

export default SinglePost;

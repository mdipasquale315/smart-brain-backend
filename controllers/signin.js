import React, { Component } from 'react';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  onSubmitSignIn = (e) => {
    e.preventDefault(); // prevent page reload
    fetch('https://smart-brain-backend-l6cv.onrender.com/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => { throw new Error(text) });
        }
        return res.json();
      })
      .then(user => {
        if (user.id) {
          this.props.loadUser(user);
          this.props.onRouteChange('home');
        }
      })
      .catch(err => alert('Sign-in failed: ' + err.message));
  };

  render() {
    return (
      <div style={{ maxWidth: '300px', margin: 'auto' }}>
        <h2>Sign In</h2>
        {/* Wrap inputs in a form */}
        <form onSubmit={this.onSubmitSignIn}>
          <input
            type="email"
            placeholder="Email"
            onChange={this.onEmailChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={this.onPasswordChange}
            required
          />
          <button type="submit">Sign In</button>
        </form>
      </div>
    );
  }
}

export default Signin;

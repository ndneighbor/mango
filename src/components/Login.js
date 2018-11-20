import React from "react";
import { Redirect } from "react-router";
import { Input, Button, Form, Label, FormGroup, Fade } from "reactstrap";

import Shell from "./shared/Shell";
import Card from "./shared/Card";

import { Mutation } from "react-apollo";
import { LOG_IN } from "../graphql/mutations";

import config from "../config";

const LOGIN_BUTTON = { background: config.EVENT_MAIN_COLOR };

const LOGO_NAME = config.EVENT_LOGO;
const LOGO_PATH = require(`../assets/images/${LOGO_NAME}`);

export default class Login extends React.Component {
  validatePassword = password => {
    if (password.length < 8)
      throw new Error("Password must be at least 8 characters long.");
  };

  submit = (e, logIn) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const email = data.get("email");
    const password = data.get("password");

    try {
      this.validatePassword(password);

      logIn({ variables: { email, password } });
    } catch (e) {
      alert(e.message);
    }
  };

  storeToken = ({ signUp: { token } }) => localStorage.setItem("JWT", token);

  form = logIn => (
    <Form onSubmit={e => this.submit(e, logIn)}>
      <FormGroup>
        <Label for="email">Email</Label>
        <Input
          name="email"
          type="email"
          placeholder="foo@bar.edu"
          autoComplete="off"
        />
      </FormGroup>

      <FormGroup>
        <Label for="password">Password</Label>
        <Input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="off"
        />
      </FormGroup>

      <Button style={LOGIN_BUTTON}>Log In</Button>
      <div className="access-forgot" />
      <hr />
      <div className="access-options">
        <a href="/forgot">Forgot Password?</a>
        <a href="/signup">
          Sign Up <i className="fa fa-caret-right" aria-hidden="true" />
        </a>
      </div>
    </Form>
  );

  render() {
    return (
      <Shell>
        <div className="access">
          <Fade>
            <Card image={LOGO_PATH}>
              <Mutation mutation={LOG_IN}>
                {(logIn, { loading, error, data }) => {
                  if (loading) console.log("loading..");
                  if (error) alert(error.message);
                  if (data) {
                    this.storeToken(data);
                    return <Redirect to="/dashboard" />;
                  }

                  return this.form(logIn);
                }}
              </Mutation>
            </Card>
          </Fade>
        </div>
      </Shell>
    );
  }
}

import React from "react";
import { useState } from "react";
import Validator from "../validator";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  function validate(e) {
    e.preventDefault();
    const validator = new Validator();

    if (
      !validator.isValid(
        {
          type: "string",
          minLength: 2,
        },
        firstName
      )
    ) {
      setErrors((errors) => ({
        ...errors,
        firstName: validator.Errors.shift(),
      }));
    } else {
      setErrors((errors) => ({ ...errors, firstName: undefined }));
    }
    if (
      !validator.isValid(
        {
          type: "string",
          minLength: 2,
        },
        lastName
      )
    ) {
      setErrors((errors) => ({
        ...errors,
        lastName: validator.Errors.shift(),
      }));
    } else {
      setErrors((errors) => ({ ...errors, lastName: undefined }));
    }
    if (
      !validator.isValid(
        {
          type: "string",
          format: "email",
        },
        email
      )
    ) {
      setErrors((errors) => ({ ...errors, email: validator.Errors.shift() }));
    } else {
      setErrors((errors) => ({ ...errors, email: undefined }));
    }
    if (
      !validator.isValid(
        {
          type: "string",
          minLength: 6,
        },
        email
      )
    ) {
      setErrors((errors) => ({
        ...errors,
        password: validator.Errors.shift(),
      }));
    } else {
      setErrors((errors) => ({ ...errors, password: undefined }));
    }
  }

  return (
    <form onSubmit={validate}>
      <h3>Sign Up</h3>

      <div className="form-group">
        <label>First name</label>
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        {errors.firstName === undefined ? null : (
          <div>
            <p>{errors.firstName}</p>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Last name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        {errors.lastName === undefined ? null : (
          <div>
            <p>{errors.lastName}</p>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Email address</label>
        <input
          className="form-control"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email === undefined ? null : (
          <div>
            <p>{errors.email}</p>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password === undefined ? null : (
          <div>
            <p>{errors.password}</p>
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary btn-block">
        Sign Up
      </button>
    </form>
  );
}

export default SignUp;

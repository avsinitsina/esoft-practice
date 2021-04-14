import React from "react";
import { useState } from "react";
import Validator from "../validator";

function Login() {
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
          format: "email",
        },
        email
      )
    ) {
      setErrors(errors=>({ ...errors, email: validator.Errors.shift() }));
    } else {
      setErrors(errors=>({ ...errors, email: undefined }));
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
      setErrors(errors => ({
        ...errors,
        password: validator.Errors.shift(),
      }));
    } else {
      setErrors(errors=>({ ...errors, password: undefined }));
    }
  }
  return (
    <form onSubmit={validate}>
      <h3>Sign In</h3>

      <div className="form-group">
        <label>Email address</label>
        <input
          className="form-control"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* контролируемый компонент */}
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
        Submit
      </button>
    </form>
  );
}

export default Login;

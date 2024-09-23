import { TextField } from "@mui/material";

function Login() {
    return (
      <div className="Login">
        <TextField fullWidth label="Email" id="fullWidth" />
        <TextField fullWidth label="Password" id="fullWidth" />


      </div>
    );
  }
  
  export default Login;
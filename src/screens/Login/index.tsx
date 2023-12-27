"use client";
import MainLayout from "@/components/mainLayout";
import { POST } from "@/services/methods";
import {
  Box,
  Checkbox,
  TextField,
  Button,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface FormDataType {
  email: string;
  password: string;
}

const useStyles = makeStyles({
  flexGrow: {
    flex: "1",
  },
  button: {
    backgroundColor: "#2BD17E !important",
    color: "#fff !important",
    "&:hover": {
      backgroundColor: "#29ba72 !important",
      color: "#FFF !important",
    },
  },
});

const Login = () => {
  const classes = useStyles();
  const [formError, setError] = useState({
    isOpen: false,
    message: "",
  });
  const navigate = useRouter();

  const handleLogin = (values: { email: string; password: string }) => {
    POST("auth/sign-in", values)
      .then((response) => {
        const { status, data } = response;
        if (status === 200) {
          localStorage.setItem("accessToken", data.accessToken);
          navigate.push("/movie-list");
        }
      })
      .catch((err) => {
        setError({ isOpen: true, message: err.data.message });
        setTimeout(() => {
          setError({ isOpen: false, message: "" });
        }, 5000);
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnBlur: true,
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Please enter valid email")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(4, "Password must be at least 4 character long"),
    }),
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  const { errors, touched } = formik;

  const isMobileView = useMediaQuery("(max-width:768px)");

  return (
    <MainLayout>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={formError.isOpen}
        autoHideDuration={5000}
      >
        <Alert
          onClose={() => {
            setError({ isOpen: false, message: "" });
          }}
          severity="error"
        >
          {formError.message}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          width: "100%",
          margin: "0 auto",
          minHeight: "100vh",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "22",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "300px",
            backgroundColor: "#093545",
          }}
        >
          <h1
            style={{
              fontFamily: "Montserrat",
              textAlign: "center",
              color: "#FFF",
              fontSize: isMobileView ? "48px" : "64px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "80px",
            }}
          >
            Sign in
          </h1>
          <div
            style={{
              width: "100%",
              marginTop: "40px",
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <TextField
                type="text"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.email}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                id="email"
                label="Email"
                size="small"
                name="email"
                inputProps={{
                  style: {
                    color: "#FFF",
                    backgroundColor: "#224957",
                    borderRadius: "10px",
                    outline: "none",
                    width: "100%",
                    padding: "11px 16px",
                    fontFamily: "Montserrat",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "24px",
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "#FFF",
                    fontFamily: "Montserrat",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "24px",
                  },
                }}
                sx={{
                  width: "100%",
                  outline: "none",
                  border: "none",
                  marginTop: "24px",
                }}
              />
              <TextField
                size="small"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.password}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                id="password"
                name="password"
                label="Password"
                type="password"
                inputProps={{
                  style: {
                    color: "#FFF",
                    backgroundColor: "#224957",
                    borderRadius: "10px",
                    outline: "none",
                    width: "100%",
                    padding: "11px 16px",
                    fontFamily: "Montserrat",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "24px",
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "#FFF",
                    fontFamily: "Montserrat",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "24px",
                  },
                }}
                sx={{
                  width: "100%",
                  outline: "none",
                  border: "none",
                  marginTop: "24px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "24px",
                }}
              >
                <Checkbox
                  size="small"
                  color="success"
                  inputProps={{
                    style: {
                      border: "none",
                      outline: "none",
                    },
                  }}
                />{" "}
                <span
                  style={{
                    color: "#FFF",
                    textAlign: "center",
                    fontFamily: "Montserrat",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "24px",
                  }}
                >
                  Remember me
                </span>
              </div>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                className={classes.button}
                sx={{
                  borderRadius: "10px",
                  background: "#2BD17E",
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "24px",
                  marginTop: "24px",
                  width: "100%",
                  padding: "15px",
                }}
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </Box>
    </MainLayout>
  );
};

export default Login;

"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Button, TextField, useMediaQuery } from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { GET, POST, PUT } from "@/services/methods";
import { useParams, useRouter } from "next/navigation";
import aws from "aws-sdk";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import PreviewFile from "@/components/PreviewFile";
import Image from "next/image";

interface FormDataType {
  title: string;
  publishingYear: number | null;
  poster: string;
}

const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
const region = process.env.NEXT_PUBLIC_AWS_REGION;
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY;

const useStyles = makeStyles({
  flexGrow: {
    flex: "1",
  },
  successButton: {
    backgroundColor: "#2BD17E !important",
    color: "#fff !important",
    "&:hover": {
      backgroundColor: "#29ba72 !important",
      color: "#FFF !important",
    },
  },
  cancelButton: {
    "&:hover": {
      backgroundColor: "#fff !important",
      color: "#000 !important",
    },
  },
});

const CreateMovie = () => {
  const [file, setFile] = useState<any>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const id = useParams();
  const classes = useStyles();
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    publishingYear: null,
    poster: "",
  });
  const navigate = useRouter();
  const fileTypes = ["JPEG", "PNG", "GIF"];

  const isMobileView = useMediaQuery("(max-width:768px)");

  const handleSubmit: any = async (values: {
    title: string;
    publishingYear: string;
  }) => {
    if (!formData.poster?.includes("http")) {
      const params = {
        Body: file,
        Bucket: bucketName,
        Key: file?.name,
      };

      const myBucket = new aws.S3({
        region: region,
        accessKeyId,
        secretAccessKey,
      });

      // @ts-ignore
      myBucket.upload(params, (err: any, data: any) => {
        if (err) {
          console.log("err", err);
        } else {
          const payload = {
            title: values.title,
            poster: data.Location,
            publishingYear: +(values?.publishingYear || 0),
          };
          if (id.id) {
            PUT(`movies/${id.id}`, payload).then((response) => {
              const { status, data } = response;
              navigate.push("/movie-list");
            });
          } else {
            POST("movies", payload).then((response) => {
              const { status, data } = response;
              navigate.push("/movie-list");
            });
          }
        }
      });
    } else {
      const payload = {
        title: values.title,
        poster: formData.poster,
        publishingYear: +(values?.publishingYear || 0),
      };
      PUT(`movies/${id.id}`, payload).then((response) => {
        const { status, data } = response;
        navigate.push("/movie-list");
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      publishingYear: "",
    },
    validateOnBlur: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      publishingYear: Yup.string()
        .required("Publishing Year is required")
        .matches(/^[1-2][0-9]{3}/, "Please enter valid year")
        .max(4, "Please enter valid year"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const { errors, touched, setValues } = formik;

  useEffect(() => {
    if (id.id) {
      setIsEdit(true);
      GET(`movies/${id.id}`).then((response) => {
        const { data } = response;
        setFormData(response.data);
        setValues(data);
      });
    } else {
      setIsEdit(false);
    }
  }, [id]);

  const handleChange = (file: any) => {
    setFormData({ ...formData, poster: file.target.files[0].name });
    setFile(file.target.files[0]);
  };

  const inputRef: any = useRef();
  return (
    <Box sx={{ padding: "120px 20px" }}>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            textAlign: isMobileView ? "center" : "",
            color: "#FFF",
            margin: isMobileView ? "" : "0 120px",
            fontFamily: "Montserrat",
            fontSize: isMobileView ? "32px" : "48px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "56px",
          }}
        >
          {!isEdit ? "Create a new movie" : "Edit"}
        </Box>

        <Box
          sx={{
            width: "100%",
            marginTop: isMobileView ? "50px" : "120px",
            display: "flex",
            alignItems: isMobileView ? "center" : "start",
            justifyContent: "center",
            gap: "127px",
            flexDirection: isMobileView ? "column-reverse" : "row",
          }}
        >
          <input
            type="file"
            onChange={handleChange}
            ref={inputRef as any}
            style={{
              visibility: "hidden",
              opacity: "0",
              width: "0",
            }}
          />
          {!isMobileView && (
            <Box
              sx={{
                width: "100%",
                maxWidth: "473px",
                height: "504px",
                borderRadius: "10px",
                border:
                  (isEdit && formData.poster) || formData.poster
                    ? "none"
                    : "2px dashed #FFF",
                background: "#224957",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                inputRef.current && inputRef.current.click();
              }}
            >
              {isEdit && (file || formData.poster) ? (
                file ? (
                  <PreviewFile file={file} />
                ) : (
                  <Image
                    src={file || formData.poster}
                    height={0}
                    width={0}
                    alt={formData.poster}
                    sizes="100vw"
                    style={{ width: "100%", height: "100%", borderRadius:"12px" }}
                  />
                )
              ) : formData.poster ? (
                <PreviewFile file={file} />
              ) : (
                <Box sx={{ textAlign: "center" }}>
                  <SaveAltIcon />
                  <Box
                    sx={{
                      color: "#FFF",
                      textAlign: "center",
                      fontFamily: "Montserrat",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                    }}
                  >
                    Drop an image here
                  </Box>
                </Box>
              )}
            </Box>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", flex: "auto" }}>
            <TextField
              variant="outlined"
              id="title"
              label="Title"
              size="small"
              onChange={formik.handleChange}
              value={formik.values.title}
              name="title"
              error={touched.title && !!errors.title}
              helperText={touched.title && errors.title}
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
                width: isMobileView ? "100%" : "362px",
                outline: "none",
                border: "none",
              }}
            />

            <TextField
              variant="outlined"
              id="publishingYear"
              name="publishingYear"
              label="Publishing year"
              error={touched.publishingYear && !!errors.publishingYear}
              helperText={touched.publishingYear && errors.publishingYear}
              onChange={formik.handleChange}
              value={formik.values.publishingYear}
              size="small"
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
                width: isMobileView ? "100%" : "216px",
                outline: "none",
                border: "none",
                marginTop: "24px",
              }}
            />

            {isMobileView && (
              <Box
                sx={{
                  margin: "20px 0",
                  width: "100%",
                  maxWidth: "473px",
                  height: "372px",
                  borderRadius: "10px",
                  border: "2px dashed #FFF",
                  background: "#224957",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  inputRef.current && inputRef.current.click();
                }}
              >
                {isEdit && (file || formData.poster) ? (
                  file ? (
                    <PreviewFile file={file} />
                  ) : (
                    <Image
                      src={file || formData.poster}
                      height={0}
                      width={0}
                      alt={formData.poster}
                      sizes="100vw"
                      style={{ width: "100%", height: "100%", borderRadius:"12px" }}
                    />
                  )
                ) : formData.poster ? (
                  <PreviewFile file={file} />
                ) : (
                  <Box sx={{ textAlign: "center" }}>
                    <SaveAltIcon />
                    <Box
                      sx={{
                        color: "#FFF",
                        textAlign: "center",
                        fontFamily: "Montserrat",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: "400",
                        lineHeight: "24px",
                      }}
                    >
                      Drop an image here
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: isMobileView ? "40px" : "64px",
              }}
            >
              <Button
                className={classes.cancelButton}
                color="inherit"
                variant="outlined"
                sx={{
                  borderRadius: "10px",
                  border: "1px solid #FFF",
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "700",
                  lineHeight: "24px",
                  padding: "10px 15px",
                  flexGrow: isMobileView ? 1 : 0,
                  display: "flex",
                  width: "167px",
                  height: "56px",
                  justifyContent: "center",
                  flexShrink: "0",
                  alignItems: "center",
                }}
                onClick={() => {
                  navigate.push("/movie-list");
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={classes.successButton}
                color="primary"
                variant="contained"
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
                  padding: "10px 15px",
                  flexGrow: isMobileView ? 1 : 0,
                  display: "flex",
                  width: "167px",
                  height: "56px",
                  justifyContent: "center",
                  flexShrink: "0",
                  alignItems: "center",
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default CreateMovie;

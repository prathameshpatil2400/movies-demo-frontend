"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  useMediaQuery,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { GET } from "@/services/methods";
import { movieDetails } from "@/types/movieTypes";
import { useRouter } from "next/navigation";
import usePagination from "@mui/material/usePagination";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { makeStyles } from "@mui/styles";

const List = styled("ul")({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
});

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

const MovieList = () => {
  const [pageNo, setPageNo] = React.useState(1);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [moviesList, setMoviesList] = useState<movieDetails[]>([]);
  const classes = useStyles();
  const router = useRouter();
  const { items } = usePagination({
    count: totalPages,
  });
  const isMobileView = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    GET(`movies?page=${pageNo}&limit=8`)
      .then((response) => {
        const { status, data } = response;
        if (status === 200) {
          setTotalPages(data.totalPages);
          setMoviesList(data.movies);
          setLoadingMovies(false);
        }
      })
      .catch(() => {
        setLoadingMovies(false);
      });
  }, [pageNo]);

  const handlePageChange = (page: number | null, type: string = "page") => {
    if (type === "previous") {
      setPageNo((prePageNo) => prePageNo - 1);
    } else if (type === "next") {
      setPageNo((prePageNo) => prePageNo + 1);
    } else if (type === "page") {
      setPageNo(() => page || 0);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          height: "100%",
          maxWidth: "1200px",
          margin:"0 auto",
          padding: isMobileView ? "80px 24px" : "120px",
          display:"flex",
          alignItems:"center",
          justifyContent:"center"
        }}
      >
        {loadingMovies ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </div>
        ) : moviesList.length ? (
          <Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Box
                  sx={{
                    color: "#FFF",
                    textAlign: "center",
                    fontFamily: "Montserrat",
                    fontSize: isMobileView ? "32px" : "48px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "56px",
                  }}
                >
                  My movies
                </Box>
                <AddCircleOutlineIcon
                  sx={{
                    width: isMobileView ? "24px" : "32px",
                    height: isMobileView ? "24px" : "32px",
                    marginTop: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    router.push("/create-movie");
                  }}
                />
              </Box>
              <Box
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  router.push("/");
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                }}
              >
                {!isMobileView && (
                  <Box
                    sx={{
                      color: "#FFF",
                      textAlign: "center",
                      fontFamily: "Montserrat",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: "700",
                      lineHeight: "24px",
                    }}
                  >
                    Logout
                  </Box>
                )}
                <LogoutIcon sx={{ width: "32px", height: "32px" }} />
              </Box>
            </Box>

            <div
              style={{
                marginTop: isMobileView ? "88px" : "120px",
              }}
            >
              <Grid container spacing={2}>
                {moviesList?.map((card: any) => (
                  <Grid key={card._id} item xs={6} sm={4} md={3}>
                    <Box
                      sx={{
                        borderRadius: "12px",
                        background: "#092C39",
                        backdropFilter: "100px",
                        padding: "8px 8px 16px",
                      }}
                      key={card._id}
                      onClick={() => {
                        router.push(`edit-movie/${card._id}`);
                      }}
                    >
                      <Box sx={{ maxWidth: "300px", height: "300px" }}>
                        <Image
                          src={card.poster}
                          alt="movie"
                          width={0}
                          height={0}
                          sizes="100vw"
                          style={{width:"100%", height:"100%"}}
                        />
                      </Box>
                      <Box
                        sx={{
                          color: "#FFF",
                          fontFamily: "Montserrat",
                          fontSize: "20px",
                          fontStyle: "normal",
                          fontWeight: "500",
                          lineHeight: "32px",
                          marginTop: "16px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {card?.title}
                      </Box>
                      <Box
                        sx={{
                          color: "#FFF",
                          fontFamily: "Montserrat",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "24px",
                          marginTop: "16px",
                        }}
                      >
                        {card.publishingYear}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "100px",
              }}
            >
              <nav>
                <List>
                  {items.map(({ page, type, selected, ...item }, index) => {
                    let children = null;

                    if (type === "start-ellipsis" || type === "end-ellipsis") {
                      children = "…";
                    } else if (type === "page") {
                      children = (
                        <button
                          type="button"
                          style={{
                            color: "white",
                            height: "32px",
                            width: "32px",
                            backgroundColor:
                              page === pageNo ? "#2BD17E" : "#092C39",
                            margin: "5px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontFamily: "Montserrat",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: "700",
                            lineHeight: "24px",
                          }}
                          {...item}
                          onClick={() => handlePageChange(page, type)}
                        >
                          {page}
                        </button>
                      );
                    } else {
                      const isDisabled =
                        (type === "previous" && pageNo === 1) ||
                        (type === "next" && pageNo === totalPages);
                      children = (
                        <button
                          type="button"
                          style={{
                            color: "white",
                            background: "transparent",
                            margin: "8px 5px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontFamily: "Montserrat",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: "700",
                            lineHeight: "24px",
                            textAlign: "center",
                          }}
                          onClick={() => {
                            handlePageChange(page, type);
                          }}
                          disabled={isDisabled}
                        >
                          {type[0].toUpperCase() + type.slice(1)}
                        </button>
                      );
                    }

                    return <li key={index}>{children}</li>;
                  })}
                </List>
              </nav>
            </div>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Montserrat",
                fontSize: isMobileView ? "32px" : "48px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "56px",
              }}
            >
              Your movie list is empty
            </Box>
            <Button
              className={classes.button}
              sx={{
                padding: isMobileView ? "16px 90px" : "16px 28px",
                borderRadius: "10px",
                background: "#2BD17E",
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Montserrat",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "700",
                lineHeight: "24px",
                marginTop: "40px",
              }}
              onClick={() => {
                router.push("/create-movie");
              }}
            >
              <span>Add a new movie</span>
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default MovieList;

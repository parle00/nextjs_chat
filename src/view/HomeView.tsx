"use client";

import { useRoomContext } from "@/app/context/RoomContext";
import Loading from "@/app/Loading";
import {
  Button,
  FormGroup,
  Stack,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import * as Yup from "yup";

interface FormValues {
  roomname: string;
  name: string;
}

const validationSchema = Yup.object({
  roomname: Yup.string().required("Oda adı zorunludur!"),
  name: Yup.string().required("Kullanıcı adı zorunludur!"),
});

const initialValues: FormValues = {
  roomname: "",
  name: "",
};

const HomeView = () => {
  const { push } = useRouter();
  const { isRoomDataLoading, setRoomValue } = useRoomContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setFieldValue(name, trimmedValue);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      setRoomValue({
        roomname: values.roomname,
        name: values.name,
      });

      push("/chat");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isRoomDataLoading) {
      setRoomValue(null);
    }
  }, [isRoomDataLoading]);

  return (
    <Stack
      flex={1}
      minHeight="100vh"
      bgcolor="#222222"
      justifyContent="center"
      alignItems="center"
      padding="20px"
    >
      {(isRoomDataLoading || isLoading) && <Loading />}
      <Stack
        maxWidth="450px"
        borderRadius="8px"
        paddingX={{ xs: "20px", sm: "35px", md: "50px" }}
        paddingY="25px"
        bgcolor="white"
        width="100%"
        gap="15px"
      >
        <Typography variant="h1" fontSize="24px" textAlign="center">
          NEXT-CHAT
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            setFieldValue,
            values,
            errors,
            touched,
            isValid,
            dirty,
          }) => (
            <Form>
              <Stack
                spacing={2}
                sx={{
                  "&& .MuiFormHelperText-root": {
                    marginLeft: "2px",
                  },
                }}
              >
                <FormGroup>
                  <TextField
                    label="Oda Adı *"
                    id="roomname"
                    size="small"
                    name="roomname"
                    value={values.roomname}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      handleInputChange(e, setFieldValue);
                    }}
                    error={touched.roomname && Boolean(errors.roomname)}
                  />
                  <FormHelperText error>
                    <ErrorMessage name="roomname" />
                  </FormHelperText>
                </FormGroup>

                <FormGroup>
                  <TextField
                    label="Adınız *"
                    size="small"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      handleInputChange(e, setFieldValue);
                    }}
                    error={touched.name && Boolean(errors.name)}
                  />
                  <FormHelperText error>
                    <ErrorMessage name="name" />
                  </FormHelperText>
                </FormGroup>

                <Button
                  size="medium"
                  variant="contained"
                  type="submit"
                  disabled={!isValid || !dirty || isLoading}
                >
                  Giriş
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </Stack>
  );
};

export default HomeView;

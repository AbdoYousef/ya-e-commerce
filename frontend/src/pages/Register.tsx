import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseUrl";

const Register = () => {
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onSubmit = async()=>{
        try{
        const firstName = firstNameRef.current?.value.trim();
        const lastName = lastNameRef.current?.value.trim();
        const email = emailRef.current?.value.trim();
        const password = passwordRef.current?.value;

        if (!firstName || !lastName || !email || !password) {
            setError("All fields are required");
            return;
        }

        //Make the call to the api to create the user
        const response = await fetch(`${BASE_URL}/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            firstName,
            lastName,
            email,
            password
            }),
        });
        const  data = await response.json();
        if (!response.ok) {
            // throw new Error(data.error || "Registration failed");
            setError("User already exists!");
            return;
        }
        setSuccess(true);
        setError(null);
        console.log("Registration successful:", data);
        // console.log(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
            setSuccess(false);
        }
        
    }
    return (
        <Container>
        <Box
            sx={{
            display: "flex",
            mt: 4,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            }}
        >
            <Typography variant="h6">Register New Account</Typography>
            {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error} + "caught it"</Alert>}
            {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>Registration successful!</Alert>}
            <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                border: 1,
                borderColor: "#f5f5f5",
                mt: 2,
                p: 2,
            }}
            >
                <TextField inputRef={firstNameRef} label="First Name" name="firstName" />
                <TextField inputRef={lastNameRef} label="Last Name" name="lastName" />
                <TextField inputRef={emailRef} label="Email" name="email" />
                <TextField inputRef={passwordRef} label="Password" name="password" type="password" />
                <Button onClick={onSubmit} variant="contained">Register</Button>
            </Box>
        </Box>
        </Container>
    );
};

export default Register;

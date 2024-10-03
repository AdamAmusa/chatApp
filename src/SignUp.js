import { FormControl, FormLabel, TextField, InputLabel, InputBase } from "@mui/material";
import Box from "@mui/material/Box";
import { styled,alpha } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import Button from '@mui/material/Button';

import { GoogleIcon, FacebookIcon} from './CustomIcons';

import { useEffect, useState } from "react";

import {signInGoogle, } from "./server";
import useFetch from "./server";

import { signUpUser } from "./server";



const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '325px',
    borderRadius: 10,
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
    
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 8,
        position: 'relative',
        backgroundColor: '#F3F6F9',
        border: '1px solid',
        borderColor: '#E0E3E7',
        fontSize: 16,
        width: '100%',
        padding: '10px 12px',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
        ...theme.applyStyles('dark', {
            backgroundColor: '#1A2027',
            borderColor: '#2D3843',
        }),
    },
}));

const ButtonS = styled(Button)(({ theme }) => ({
    borderRadius: 9,
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ] 
}));

const ButtonI = styled(Button)(({ theme }) => ({
    borderRadius: 100,
    fontSize: 11,
    color:"black",
    borderColor:"grey",
    width: '200px',
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ]
}));


function SignUp() {
    useFetch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() =>{
        if(password === confirmPassword && password != ""){
            setIsFormValid(true)
        } else{
            setIsFormValid(false);
        }
     }, [email, password, confirmPassword]);


     const Submit = () =>{
        console.log("Button Pressed!");
        if(isFormValid){
            console.log("Successfull sign up")
            signUpUser(email, password);
        }
        else{
            console.log("Error signing up");
        }
     }
    

    return (
        <div className="Login">
            <Card variant="" >

                <Box
                    component="form"
                    //onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <FormControl variant="standard">
                        <InputLabel shrink htmlFor="bootstrap-input">
                            Email
                        </InputLabel>
                        <BootstrapInput id="bootstrap-input"
                        
                        value ={email}
                        type="email"
                        required
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>


                    <FormControl variant="standard">
                        <InputLabel shrink htmlFor="bootstrap-input">
                            Password
                        </InputLabel>
                        <BootstrapInput id="bootstrap-input"
                        //value={password}
                        type = "password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>

                    <FormControl variant="standard">
                        <InputLabel shrink htmlFor="bootstrap-input">
                            Confirm Password
                        </InputLabel>
                        <BootstrapInput id="bootstrap-input"
                        value={confirmPassword}
                        type = "password"
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </FormControl>


                    <ButtonS
                        //type="submit"
                        fullWidth
                        variant="contained"
                        onClick={Submit}
                    //onClick={validateInputs}
                    >
                        Sign up
                    </ButtonS>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                    <ButtonI
                        type="submit"
                        fullWidth
                        variant="outlined"
                        onClick={signInGoogle}
                        startIcon={<GoogleIcon />}
                    >
                        Sign up with Google
                        
                    </ButtonI>
                    <ButtonI
                        type="submit"
                        fullWidth
                        variant="outlined"
                        onClick={() => alert('Sign in with Facebook')}
                        startIcon={<FacebookIcon />}
                    >
                        Sign up with Facebook
                    </ButtonI>

                </Box>
            </Card>

        </div>
    );
}

export default SignUp;
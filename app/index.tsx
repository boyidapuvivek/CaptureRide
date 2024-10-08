import React from 'react'
import SignUpScreen from './screens/signUpScreen'
import Home_Screen from './screens/homeScreen'
import { StatusBar } from 'expo-status-bar';


const indexScreen = ()=>{
    return (
        <><Home_Screen />
        <StatusBar style="light" hidden />
        </>
    );
}

export default indexScreen
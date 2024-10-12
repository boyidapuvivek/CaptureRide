import React from 'react'
import SignUpScreen from './screens/signUpScreen'
import Home_Screen from './screens/homeScreen'
import { StatusBar } from 'expo-status-bar';
import ProfileCam from './screens/camera';


const indexScreen = ()=>{
    return (
        <><ProfileCam />
        <StatusBar style="light" hidden />
        </>
    );
}

export default indexScreen
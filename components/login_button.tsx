import React from "react";
import {Text, View, Pressable, Dimensions, StyleSheet, Image} from "react-native"
import images from "@/constants/loginLogo";

const screenWidth = Dimensions.get('window').width

type loginbutton = {
    onPress : ()=>void,
    text : string,
    buttonColor : string,
    logo : any,
    textWidth : any,
    textColor : any,
}


export default function LoginButton({text , onPress , buttonColor , logo , textWidth , textColor} : loginbutton){
    
    
    return(
        <Pressable onPress={onPress} style={[styles.loginButton, {backgroundColor: buttonColor }]}>
            
            <View style={{width:screenWidth*0.25}}>
                <Image
                    source={logo}
                    style={styles.loginButtonLogo}
                />
            </View>

            <View style={{width: textWidth}}>
                <Text style={{color:textColor}}>
                    {text}
                </Text>
            </View>
        </Pressable> 
    )
}

const styles = StyleSheet.create({
    loginButton:{
        height:45,
        width:screenWidth*0.84,
        borderWidth:0.5,
        borderRadius:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginVertical:10,
        textAlign:'center',
        
    },
    loginButtonLogo:{
        height:35,
        width:35,
    },
    loginText:{
        width:screenWidth*0.55,
    }
})
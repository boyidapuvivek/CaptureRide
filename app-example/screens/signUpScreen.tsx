import { SafeAreaView, Text, TextInput, View , StyleSheet, Dimensions} from 'react-native'
import React, { Component } from 'react'
import LoginButton from '@/components/login_button'
import images from '@/constants/loginLogo'
import TextField from '@/components/login_text_input'
import { Link, router } from 'expo-router'
const screenWidth = Dimensions.get('window').width

function SignUp(){
    
}

export default function SignUpScreen(){
    return(
        <SafeAreaView>  
                <View style={styles.headTextContainer}>
                    <Text style={styles.headText}>
                        Create an account
                    </Text>
                </View>
                
                <TextField text={"Enter the username"}/>
                <TextField text={"Enter Your Email"}/>
                <TextField text={"Enter Your PhoneNumber"}/>
                <TextField text={"Enter Your Passoword"}/>
                
                <View style={{alignItems:'center',margin:5}}>
                    <LoginButton
                    onPress={
                        ()=>{
                            router.push('/screens/loginScreen')
                        }
                    }
                    text={'Sign Up'}
                    buttonColor={'#0E64D2'}
                    logo={undefined}
                    textWidth={screenWidth * 0.40} 
                    textColor={'#ffffff'}                    />
                </View>
                
                <View style={{alignItems:'center'}}>
                    <Text>
                            Or With
                    </Text>
                </View>


                <View style={{alignItems:'center',margin:5}}>
                    <LoginButton
                    onPress={() => {
                        console.log("pressed")
                    } }
                    text={'Signup with Facebook'}
                    buttonColor={'#1877F2'}
                    logo={images.facebook}
                    textWidth={screenWidth * 0.56} 
                    textColor={'#ffffff'}                    />
                </View>
                <View style={{alignItems:'center',margin:5}}>
                    <LoginButton
                    onPress={() => {
                        console.log("pressed")
                    } }
                    text={'Signup with Google'}
                    buttonColor={'#ffffff'}
                    logo={images.google}
                    textWidth={screenWidth * 0.56} 
                    textColor={'#000000'}                    />
                </View>
                <View style={styles.bottomText}>
                <Text>
                    Already have an account ? <Link style={{color:"#2F89FC"}} href={'/screens/loginScreen'} >Login</Link>
                </Text>
            </View>
        </SafeAreaView>
    )
}


const styles =StyleSheet.create({
    headTextContainer:{
        height:100,
        width:"100%",
        alignItems:'center',
        justifyContent:'center'
    },
    headText:{
        fontWeight:'700',
        fontSize:25,
    },
    bottomText:{
        alignItems:'center',
        justifyContent:'center',
    }
})
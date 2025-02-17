import { Dimensions, SafeAreaView, Text, View , StyleSheet } from 'react-native'
import React, { Component } from 'react'
import LoginButton from '@/components/login_button'
import TextField from '@/components/login_text_input'
import images from '@/constants/loginLogo'
import { Link } from 'expo-router'

const screenWidth = Dimensions.get('window').width

export default function LoginScreen(){
    return(
        <SafeAreaView>
            <View style={styles.headTextContainer}>
                <Text style={styles.headText}>
                    Hi, Welcome Back! 👋
                </Text>
            </View>

            
            <TextField text={'example.gmail.com'}/>
            <TextField text={'Enter Your Password'}/>
                
            <View style={styles.forgotPassword}>
                <Text>
                   Remember Me                            
                </Text>
                <Link style={{color:'#1877F2'}} href={'/'}>
                    Forgot Password?
                </Link>
            </View>

            <View style={{alignItems:'center',margin:5}}>
                <LoginButton
                    onPress={()=>{
                        console.log("ok");
                        
                    }}
                    text={'Login'}
                    buttonColor={'#0E64D2'}
                    logo={undefined}
                    textWidth={screenWidth*0.40}
                    textColor={'#ffffff'}
                />

            <View style={styles.midText}>
                    <Text>
                            Or With
                    </Text>
                </View>


                <View style={{alignItems:'center',margin:5}}>
                    <LoginButton
                    onPress={() => {
                        console.log("pressed")
                    } }
                    text={'Login with Facebook'}
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
                    text={'Login with Google'}
                    buttonColor={'#ffffff'}
                    logo={images.google}
                    textWidth={screenWidth * 0.56} 
                    textColor={'#000000'}                    />
                </View>
            </View>
            <View style={styles.bottomText}>
                <Text>
                    Don't have an account ? <Link style={{color:"#2F89FC"}} href={'/screens/signUpScreen'}>SignUp</Link>
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
    midText:{
        alignItems:'center',
        justifyContent:'center',
        height:50,
        width:"100%",
        marginTop:25
    },
    bottomText:{
        alignItems:'center',
        justifyContent:'center',
    },
    forgotPassword:{
        alignItems:'center',
        justifyContent:'space-around',
        flexDirection:'row',
    }
})
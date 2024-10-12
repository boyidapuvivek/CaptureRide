import { Text , View , Image , StyleSheet , Dimensions} from 'react-native'
import React, { Component } from 'react'
import HomeButton from '../../components/home_screen_button'
import { router } from 'expo-router'
import SignUpScreen from './signUpScreen'
import LoginScreen from './loginScreen'

const screenHeight = Dimensions.get('window').height

export default function Home_Screen(){
    return(
        <View
            style={{flex:1}}
        >       
                <Image
                    source={require('../../assets/images/bikes/promo3.webp')}
                    style={styles.homeImage}
                />
                
                <View>
                    <Text style={styles.homeText}>
                        Get Started!!!
                    </Text>
                    <Text style={styles.homeSubText}>
                        click on next to move on
                    </Text>
                    <View style={styles.homeScreenButton}>
                        <HomeButton 
                            text='Next' 
                            onPress={ () =>{
                                router.push('/screens/camera'); 
                            } } />
                    </View>
                </View>
        </View>
    )
}


const styles = StyleSheet.create({
    homeScreenButton : {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        marginTop:screenHeight*0.05,

    },
    homeImage : {
        height:'65%',
        width:'100%',
    },
    homeText:{
        fontSize:30,
        fontWeight:"bold",
        marginTop:"10%",
        marginLeft:"2%"
    },
    homeSubText:{
        fontSize:20,
        marginTop:"5%",
        marginLeft:"2%",
    }
})


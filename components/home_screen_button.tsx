import { Text, View ,Pressable ,StyleSheet, Dimensions} from 'react-native'
import React, { Component } from 'react'

type HomeButtonProps={
    text : string;
    onPress : () => void;
}

const screenWidth = Dimensions.get('window').width;

export default function HomeButton({ text , onPress } : HomeButtonProps){


    return(
        <Pressable onPress={onPress}>
        <View style={styles.button}>
            <Text style={styles.buttonText}>
                {text}
            </Text>
        </View>
    </Pressable>
    )

}

const styles = StyleSheet.create({
    button : {
        height:48,
        width: screenWidth*0.9,
        backgroundColor:"#006FFD",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:10,
    },
    buttonText : {
        color:"#ffffff",
        fontWeight : "bold"
    
    }
})
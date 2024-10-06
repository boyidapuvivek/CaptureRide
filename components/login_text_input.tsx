import React from "react";
import {View , Text, TextInput , StyleSheet, Dimensions } from "react-native"

const screenWidth = Dimensions.get('window').width

type TextFieldProps = {
    text : string;
}

export default function TextField( {text} : TextFieldProps ){
    return(
        <View style={styles.container}>
            <TextInput
                    style={styles.inputText}
                    placeholder={text}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    inputText : {
        height:45,
        width:screenWidth*0.84,
        borderWidth:0.5,
        padding:10,
        borderRadius:10,
        marginVertical:15,
     },
     container:{
        justifyContent:'center',
        alignItems:'center',
     }
})

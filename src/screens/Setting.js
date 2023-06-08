import React from 'react'
import { View, Text ,StyleSheet} from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

const Setting = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity>
            <View style={styles.btn}>
                <Text style={styles.btnTxt}>Change Password</Text>
            </View>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles =StyleSheet.create({
    container:{
        flex:1,
        padding:10
    },
    btn:{
        backgroundColor:'lightgray',
        alignItems:'center'
    },
    btnTxt:{
        fontSize:20,
        lineHeight:40,
        
    }
})

export default Setting

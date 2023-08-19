import React, { useState } from "react";
import {View, StyleSheet, Text, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { Entypo } from '@expo/vector-icons';

export default function Login({ navigation }){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onHandleLogin = () => {
        if(email !== "" && password !== ""){
            signInWithEmailAndPassword(auth, email, password)
            .then(() => console.log("Login success"))
            .catch((err) => Alert.alert("Login error", err.message));
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.back}>
                <Entypo name="back" size={24} color={'#FAFAFA'} />
            </TouchableOpacity>
            <View style={styles.whiteSheet}></View>
            <SafeAreaView style={styles.form}>
                <Text style={styles.title}>ログイン</Text>
                <TextInput style={styles.input} placeholder="メールアドレス" autoCapitalize="none" keyboardType="emailAddress" autoFocus={true} value={email} onChangeText={(text) => setEmail(text)}/>
                <TextInput style={styles.input} placeholder="パスワード" autoCapitalize="none" autoCorrect={false} secureTextEntry={true} textContentType="password" value={password} onChangeText={(text) => setPassword(text)}/>
                <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
                    <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>ログイン</Text>
                </TouchableOpacity>
                <View style={{ marginTop: 20, flexDirection: 'row', alignItems:'center', alignSelf: 'center' }}>
                    <Text style={{ color:'gray', fontWeight: '600', fontSize: 14 }}>アカウント持ってない？</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                        <Text style={{ color: '#40E0D0', fontWeight: '600', fontSize: 14 }}> 新規登録</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#40E0D0',
    },
    back: {
        marginTop: 40,
        marginLeft: 20
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: "#40E0D0",
        alignSelf: "center", 
        paddingBottom: 24,
    },
    input: {
        backgroundColor: "#F6F7FB",
        height: 58, 
        marginBottom: 20,
        fontSize:16,
        borderRadius: 10,
        padding: 12,
    },
    
    backImage: {
        width: "100%",
        height: 340,
        position: "absolute",
        top: 0,
        resizeMode: 'cover',
    },
    whiteSheet: {
        width: '100%',
        height: '75%',
        position: "absolute",
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 60,
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    button: {
        backgroundColor: "#40E0D0",
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    }
}
)
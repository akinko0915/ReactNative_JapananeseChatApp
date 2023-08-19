import React, { useState } from "react";
import { View, StyleSheet, Text, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { collection, Firestore, addDoc, doc } from "firebase/firestore";
import { Entypo } from '@expo/vector-icons';
import { Avatar } from "react-native-gifted-chat";

export default function Signup({ navigation }){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName ] = useState("");

    const onHandleSignup =async () => {
        if (email !== '' && password !== '' && name !== '' ){
            try{
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                const user = userCredential.user;

                if(user){
                    console.log('Signup success')
                    await updateProfile(user, {
                        displayName: name
                    });
                    await addUserToFirestore(user.uid, name, email);
                }
            } catch (error) {
                console.error('Signup error:', error);
                Alert.alert("Signup error", error.message);
            }
        } 
    }

    const addUserToFirestore = async (userId, displayName, email) => {
        const usersCollection = collection(database, "users");
        try {
            await addDoc(usersCollection, {
                userId,
                displayName,
                email,
            });
            console.log('User data added to Firestore collection');
        } catch (error) {
            console.error('Firestore error:', error);
        }
    }
    

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.back}>
                <Entypo name="back" size={24} color={'#FAFAFA'} />
            </TouchableOpacity>
            <View style={styles.whiteSheet}></View>
            <SafeAreaView style={styles.form}>
                <Text style={styles.title}>新規登録</Text>
                    <TextInput style={styles.input} placeholder="なまえ"  autoFocus={true} value={name} onChangeText={(text) => setName(text)}/>
                    <TextInput style={styles.input} placeholder="メールアドレス" autoCapitalize="none" keyboardType="emailAddress" value={email} onChangeText={(text) => setEmail(text)}/>
                    <TextInput style={styles.input} placeholder="パスワード" autoCapitalize="none" autoCorrect={false} secureTextEntry={true} textContentType="password" value={password} onChangeText={(text) => setPassword(text)}/>
                <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
                    <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>登録</Text>
                </TouchableOpacity>
                <View style={{ marginTop: 20, flexDirection: 'row', alignItems:'center', alignSelf: 'center' }}>
                    <Text style={{ color:'gray', fontWeight: '600', fontSize: 14 }}>既に登録済み</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={{ color: '#40E0D0', fontWeight: '600', fontSize: 14 }}> ログイン</Text>
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
        paddingTop: 30,
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
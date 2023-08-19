import React, {useEffect} from "react";
import {View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';


export default function Home ({ navigation }){
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={styles.headerLeft}>
                    <FontAwesome5 name="star" size={24} style={{ marginRight: 5, color: '#40E0D0' }}/>
                    <Text style={ styles.headerText }>にほんごチャット</Text>
                </View>
            ),
            headerRight: () => (
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
                        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 10 }}> ログイン</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Signup")}>
                        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 10 }}> 登録</Text>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.whiteSheet}>
                <Text style={styles.instructTitle}>{`「やさしい日本語」を使ったチャットアプリ`} </Text>
                <Text style={styles.instructText}> {`あなたが外国人の友だちに送ったその日本語は、難しすぎていませんか？このアプリが簡単な日本語に変換してくれます。外国人の方とスムーズに日本語でコミュニケーションをとりましょう！`}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#40E0D0',
        justifyContent: 'center',
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        color: "#fff"
    },
      headerText: {
        marginLeft: 5,
        color: '#808080',
    },
      headerRight: {
        flexDirection: "row",
    },
    button: {
        backgroundColor: "#40E0D0",
        height: 30,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        width: 90,
        marginLeft: 3,
    },
    chatButton: {
        backgroundColor: '#40E0D0',
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#40E0D0',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: .9,
        shadowRadius: 8,
        marginRight: 20,
        marginBottom: 50,
    },
    whiteSheet: {
        flex: 1,
        width: '70%',
        height: '40%',
        position: "absolute",
        backgroundColor: '#fff',
        borderRadius: 60,
        marginHorizontal: 60,
        // justifyContent: 'center',
        flexDirection: "column",
    },
    instructTitle: {
        marginLeft: 25,
        marginTop: 30,
        color: "#40E0D0",
        fontSize: 20,
        width: '80%', 
        height: 'auto',
        fontWeight: '600',
        textAlign: 'center',
    },
    instructText: {
        width: '80%', 
        textAlign: 'center',
        color: '#808080',
        fontSize: 15,
        fontWeight: 300,
        marginLeft: 25,
        marginTop: 30,
        lineHeight: 25,
    },
})
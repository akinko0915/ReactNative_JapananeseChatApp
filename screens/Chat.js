import React, { useState, useLayoutEffect, useCallback, useEffect } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { collection, addDoc, orderBy, query, onSnapshot, doc, setDoc } from "firebase/firestore";
import { EmailAuthCredential, signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useNavigation } from "@react-navigation/native";
import { openai } from "../config/openai";




export default function Chat(){
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");


    const onSignOut = () => {
        signOut(auth).catch(error => console.log(error));
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={onSignOut} style={styles.headerLeft}>
                    <FontAwesome5 name="arrow-left" size={24} color={'#40E0D0'}/>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#40E0D0', 
                    },
                    left: {
                        backgroundColor: '#808080'
                    },
                }}
                textStyle={{
                    right: {
                        color: 'white', // Change this to your desired font color
                    },
                    left: {
                        color: 'white',
                    },
                }}
            />
        );
    };

    const navigation = useNavigation();

    //1. create messages
    useEffect(() => {
        const collectionRef = collection(database, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            console.log('Received snapshot:', querySnapshot.docs);
            
            const chats = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                chats.push({
                    _id: data._id,
                    createdAt: data.createdAt.toDate(), 
                    text: data.text,
                    user: data.user,
                })
            });
            
            setMessages(chats);
        });
        return () => unsubscribe();
    }, []);


    

    // 3. define UI 
    const renderInputToolbar = () => {
        return (
            <View style={styles.inputContainer}>
                <TextInput placeholder="メッセージ" style={styles.input} multiline placeholderTextColor="#40E0D0" value={inputText}
                onChangeText={setInputText} keyboardType="email-address"/>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => onSend(inputText)}>
                        <FontAwesome5 name='paper-plane' style={styles.icon}  />
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => convertText(inputText)}>
                        <FontAwesome5 name='pen' style={styles.icon}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const convertText = async (text) => {
        try {
            const response = await openai.completions.create({
               model: "gpt-3.5-turbo",
               prompt:  `Translate the following Japanese text into a simplified version with fewer Kanji in formal style to tell a foreigner who is a beginner in Japanese: ${text}`,
               max_tokens: 150,
            });
            console.log(response.choices[0].text);

            if (response.choices && response.choices.length > 0){
                return response.choices[0].text;
            } else {
                console.error('No simplified text returned from OpenAI API')
                return text;
            }

        } catch (error) {
           if(error instanceof OpenAI.APIError){
               console.error(error.response.status); // e.g. 401
               console.error(error.message); // e.g. The authentication token you passed was invalid...
               console.error(error.code); // e.g. 'invalid_api_key'
               console.error(error.type); // e.g. 'invalid_request_error'
           }else{
               console.log(error);
           }
        }
    }

     // memorize the message
     const onSend = useCallback(async (text) => {
        if(text == ""){
            return;
        }

        const newMessage = {
            _id: new Date().getTime() + '_' + Math.floor(Math.random() * 1000),
            createdAt: new Date(),
            text: text,
            user: {
                _id: auth?.currentUser?.email,
                name: auth?.currentUser?.displayName,
            }
        }

        setMessages((prevMessages) => GiftedChat.append(prevMessages, [newMessage]));
        
        try {
            addDoc(collection(database, 'chats'), newMessage);
        } catch (error) {
            console.error('Error adding message to Firestore:', error);
        }
        // Clear the input text after sending
        setInputText(""); 
    }, []);
    
    
    // 2. render messages property to GiftedChat
    // 4. render the UI from renderInputToolbar
    return (
        <KeyboardAvoidingView style={styles.container} >
            <View style={styles.chatContainer}>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{ _id: auth?.currentUser?.email,
                            name: auth?.currentUser?.displayName }}
                    renderInputToolbar={renderInputToolbar}
                    renderBubble={renderBubble}
                />
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0.93,
        backgroundColor: '#E0FFFF',
    },
    chatContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    inputContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        height: 100,
        justifyContent: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    icon: {
        color: "#40E0D0",
        fontSize: 30,
        marginLeft: 15,
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
        color: '#40E0D0',
        // maxHeight: 100
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        color: "#fff"
    },
});
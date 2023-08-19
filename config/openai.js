import {Configuration, OpenAIApi} from 'openai';
import Constants  from "expo-constants";

const openaiConfig = new Configuration({
    apiKey: Constants.expoConfig.extra.openai_apiKey,
})

export const openai = new OpenAIApi(openaiConfig);




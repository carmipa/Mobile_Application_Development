
import { useState } from 'react';
import {StyleSheet, ImageBackground, FlatList, Dimensions, TouchableOpacity, View, Text, Keyboard} from 'react-native';
import { Image } from 'expo-image';


import API_KEY from '../API_KEY';
import axios from 'axios';
import Cabecalho from '../Components/Cabecalho';
import TextoInfo from '../Components/TextoInfo';
import Loading from '../Components/Loading';

const{width,height}=Dimensions.get("window")
const IMAGE_WIDTH = width


export default function TelaResultado({ route, navigation }) {
  const escolha = route.params.escolha
  const link = `http://api.giphy.com/v1/${escolha}/search`

  const [text, setText] = useState('')
  const [dados, setDados] = useState([])
  const [showMessage, setShowMessage] = useState(true)
  const [isLoading, setIsLoading] = useState(false)


  const solicitarDados = async (text) => {
    Keyboard.dismiss() // Fecha o teclado
    setIsLoading(true)
    try {
      const resultado = await axios.get(link, {
        params: {
          api_key: API_KEY,
          q: text
        }
      })
      setShowMessage(false)
      setIsLoading(false)
      setDados(resultado.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/BG.png')}
      style={styles.container}
    >
      <Cabecalho 
        navigation={navigation}
        text={text}
        setText={setText}
        solicitarDados={solicitarDados}
        setShowMessage={setShowMessage}
      />
    
     
      <FlatList
        data={dados}
        numColumns={2}
        ListHeaderComponent={
          <>
            <TextoInfo showMessage={showMessage}/>
            <Loading isLoading={isLoading}/>
          </>
        }
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={()=>navigation.navigate("TelaDetalhes",{item:item})}>
              <Image
                style={styles.image}
                source={{ uri: item.images.preview_gif.url }} />
            </TouchableOpacity>

          )
        }}
      />

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width: IMAGE_WIDTH/2,
    height: IMAGE_WIDTH/2,
    margin: IMAGE_WIDTH*0.03,
    borderRadius: 10
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30
  },
  textInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    paddingLeft: 10
  }
});

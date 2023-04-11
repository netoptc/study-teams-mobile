import { Routes } from "@routes/index";
import { ThemeProvider } from "styled-components/native";
import theme from "@theme/index";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Loading } from "@components/Loading";
import { StatusBar } from "react-native";

export default function App() {

  const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold});

  return (
    <ThemeProvider theme={theme}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      {(fontsLoaded) ? <Routes /> : <Loading />}
    </ThemeProvider>
  );
}

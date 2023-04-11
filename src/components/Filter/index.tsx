import { TouchableOpacityProps } from "react-native";

import { Container, Title, FilerStyleProps } from "./styles";

type Props =  TouchableOpacityProps & FilerStyleProps & {
    title: string;
}

export function Filter({title, isActive= false, ...rest}: Props) {
    return(
        <Container  
            isActive={isActive}
            {...rest}
        >
            <Title>
                {title}
            </Title>
        </Container>
    )
}
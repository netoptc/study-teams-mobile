import styled from 'styled-components/native'
import { SafeAreaView } from 'react-native-safe-area-context';

export const Container = styled(SafeAreaView)`
    background-color: ${({ theme }) => theme.COLORS.GRAY_600};
    height: 100%;
    padding: 20px;
`;

export const Title = styled.Text`
    color: #fff;
    font-size: 32px;
`;
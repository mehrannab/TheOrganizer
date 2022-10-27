import React from 'react';
import renderer, { act } from 'react-test-renderer'
import ForgotPasswordComponent from '../components/ForgotPassword/ForgotPasswordComponent';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Button, TextInput } from 'react-native-paper';
jest.useFakeTimers()
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

const mockGetAuth = jest.fn()

const mockSendPassword = jest.fn(() => {
    return Promise.resolve(true)
})

jest.mock('firebase/auth', () => {
    return {
        getAuth: () => mockGetAuth,
        sendPasswordResetEmail: () => mockSendPassword
    }
})



// Snapshot testing
test('renders forgotPasswordComponent correctly 1', () => {
    const tree = renderer.create(
    <NavigationContainer>
    <ForgotPasswordComponent/>
    </NavigationContainer>)
    .toJSON();
    expect(tree).toMatchSnapshot();
});



//Component rendering testing - Specific widgets
describe('forgotPasswordComponent', () => {
    test("renders default element", () => {
        const {getAllByText, getByPlaceholderText} = render(
        <NavigationContainer>
        <ForgotPasswordComponent/>
        </NavigationContainer>
        );
        
        expect(getAllByText('Forgot your password? No problem!').length).toBe(1);
        expect(getAllByText('Email:').length).toBe(1);
        getByPlaceholderText("Enter your email");
    });
});



//Testing buttons and inputfield
describe('Buttons and input on press working', () => {
    it('Go back onpress is called', () => {
        const onPress = jest.fn();
        const {getByText} = render(
            <Button onPress={onPress}>Go Back</Button>,
        );
        fireEvent.press(getByText('Go Back'));
        expect(onPress).toBeCalledTimes(1);
    });

    it('Reset onpress is called', () => {
        const onPress = jest.fn();
        const {getByText} = render(
            <Button onPress={onPress}>Reset password</Button>,
        )
        fireEvent.press(getByText('Reset password'));
        expect(onPress).toBeCalledTimes(1);
    })

    it('Email onChange is called', () => {
        const onChangeTextMock = jest.fn();
        const {getByPlaceholderText} = render(
            <TextInput placeholder="Enter your email" onChangeText={onChangeTextMock}/>
        );
        fireEvent.changeText(getByPlaceholderText("Enter your email"), "test@gmail.com");
        expect(onChangeTextMock).toBeCalled();
    })
});



//Testing that navigation is called when Go-Back button is pressed
describe("Navigation working", () => {
    it("calls useNavigation and navigates", () => {
        const mockedNavigate = jest.fn();
        jest.mock('@react-navigation/native', () => (
        { useNavigation: () => ({ navigate: mockedNavigate }) }));        

        const onPress = jest.fn(mockedNavigate);
        const {getByText} = render(
            <Button onPress={onPress}>Go Back</Button>,
        );

        fireEvent.press(getByText('Go Back'));
        expect(mockedNavigate).toBeCalledTimes(1);
    })
})



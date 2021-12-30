import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import EditProfileDialog from '../components/Dialogs/EditProfileDialog/EditProfileDialog.js'


test('It should allow to change First Name, Last Name, Biography fields', () => {
    const curProfileInfo = {
                            'first_name': 'Merve R.',
                            'last_name' : 'Barin',
                            'birthday'  : '1999-01-01',
                            'photo_url' : '',
                            'username'  : 'mervebarin',
                            'email'     : 'merve@email.com',
                            'biography' : 'Dont be ridiculous, I am mocking!'
                        }
    render(
            <EditProfileDialog 
                open={true} 
                onClose={() => {}} 
                curProfileInfo={curProfileInfo}/>
            )

    const firstNameInput = screen.getByLabelText('First Name')
    const lastNameInput = screen.getByLabelText('Last Name')
    const biographyInput = screen.getByLabelText('Biography')
    const birthdayInput = screen.getByLabelText('Birthday')

    expect(firstNameInput.value).toBe('Merve R.') 
    fireEvent.change(firstNameInput, {target: {value: 'Merve Rabia'}})
    expect(firstNameInput.value).toBe('Merve Rabia') 

    expect(lastNameInput.value).toBe('Barin') 
    fireEvent.change(lastNameInput, {target: {value: 'Bar'}})
    expect(lastNameInput.value).toBe('Bar') 

    expect(biographyInput.value).toBe('Dont be ridiculous, I am mocking!') 
    fireEvent.change(biographyInput, {target: {value: 'Dont be ridiculous, I am jocking!'}})
    expect(biographyInput.value).toBe('Dont be ridiculous, I am jocking!') 

    expect(birthdayInput.value).toBe('01/01/1999') 
    fireEvent.change(birthdayInput, {target: {value: '01/03/1999'}})
    expect(birthdayInput.value).toBe('01/03/1999') 

  
});

test('It should not allow to click Username and Email fields', () => {
    const curProfileInfo = {
                            'first_name': 'Merve R.',
                            'last_name' : 'Barin',
                            'birthday'  : '1999-01-01',
                            'photo_url' : '',
                            'username'  : 'mervebarin',
                            'email'     : 'merve@email.com',
                            'followers' : [],
                            'followings': [],
                            'biography' : 'Dont be ridiculous, I am mocking!'
                        }
    render(<EditProfileDialog 
                open={true} 
                onClose={() => {}} 
                curProfileInfo={curProfileInfo}/>
            )

    const usernameInput = screen.getByLabelText('Username')
    const emailInput = screen.getByLabelText('Email Address')

    expect(usernameInput.value).toBe('mervebarin') 
    expect(usernameInput).toHaveAttribute('disabled');

    expect(emailInput.value).toBe('merve@email.com') 
    expect(emailInput).toHaveAttribute('disabled');


  
});

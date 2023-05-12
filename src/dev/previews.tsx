import React, { useCallback } from 'react';
import { ComponentPreview, Previews } from '@react-buddy/ide-toolbox';
import PaletteTree from './palette';
import ConfirmSignUp from '../main/auth/ConfirmSignUp';
import PasswordField from '../main/components/PasswordField';
import SignIn from '../main/auth/SignIn';
import UserAvatar from '../main/components/UserAvatar';

function ComponentPreviews() {
  const onConfirmSignUpConfirm = useCallback(() => {}, []);
  const onSignInSignIn = useCallback(() => {}, []);
  const userNotConfirmed = useCallback(() => {}, []);

  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path="/ConfirmSignUp">
        <ConfirmSignUp onConfirm={onConfirmSignUpConfirm} />
      </ComponentPreview>
      <ComponentPreview path="/PasswordField">
        <PasswordField />
      </ComponentPreview>
      <ComponentPreview path="/SignIn">
        <SignIn onSignIn={onSignInSignIn} userNotConfirmed={userNotConfirmed} />
      </ComponentPreview>
      <ComponentPreview path="/UserAvatar">
        <UserAvatar name="David Johnston" />
      </ComponentPreview>
    </Previews>
  );
}

export default ComponentPreviews;

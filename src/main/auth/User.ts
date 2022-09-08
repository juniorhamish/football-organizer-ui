import { CognitoUser } from 'amazon-cognito-identity-js';

export type UserAttributes = {
  given_name: string;
  family_name: string;
};

export type User = CognitoUser & {
  attributes: UserAttributes;
};

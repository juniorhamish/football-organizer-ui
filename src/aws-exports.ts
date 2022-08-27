const awsConfig = {
  Auth: {
    region: 'eu-west-2',
    userPoolId: 'eu-west-2_AQejk3Z18',
    userPoolWebClientId: '5cfiuv2vlmnqu4mu1ng3dfkaar',
    signUpVerificationMethod: 'code',
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    mandatorySignIn: false,
    oauth: {
      domain: 'football-organizer.auth.eu-west-2.amazoncognito.com',
      scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
      redirectSignIn: 'http://localhost:3000/',
      redirectSignOut: 'http://localhost:3000/',
      responseType: 'code',
    },
  },
};

export default awsConfig;

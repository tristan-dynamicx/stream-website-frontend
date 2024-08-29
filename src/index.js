import { createAuth0Client } from '@auth0/auth0-spa-js';

// It should be loaded asynchronously so it doesn't affect page load times.
const init = async () => {
  const client = await createAuth0Client({
    clientId: 'XNF0xD0sAmM04mv0ua4eNSAXilVXIyaE', //cleintID from auth0
    domain: 'sportsx.eu.auth0.com',//domain from auth0
    authorizationParams: {
      redirect_uri: 'https://www.sportsx.app/', //Redirect URL after login
    },
  });


  const hidebtn = document.getElementById('hideLink') as HTMLAnchorElement; //query the button
//with the login action

  const url = new URLSearchParams(window.location.search);
  const code = url.get('code');

  if (code) {
    await client.handleRedirectCallback(); //handles redirect after successsful login
    history.replaceState({}, document.title, window.location.origin + window.location.pathname);
  }

  const logoutBtn = document.getElementById('logOutbtn');
  const loginUser = document.getElementById('authLogin');
  const signUpUser = document.getElementById('authSignUp');
  const accessDenied = document.querySelector('[Lf-element="deniedEl"]') as HTMLElement;
  const accessPage = document.querySelector('[Lf-element="mainPage"]');

  ////////////User authentication
  const isLoggedIn = await client.isAuthenticated(); //check if user is logged in or not

  const unregisteredUser = function () {
    if (!isLoggedIn) {
      hidebtn.href = ``;
      hidebtn.style.opacity = `50%`;
      accessDenied ? (accessDenied.style.display = `flex`) : '';
    }
  };


  const activeUser = function () {
    if (isLoggedIn) {
      hidebtn.href = '<URL that needs to be hidden>';
      hidebtn.classList.remove('disabled');
      accessDenied ? (accessDenied.style.display = `none`) : '';
      accessPage ? accessPage.classList.remove('hide') : '';
    }
  };


  unregisteredUser(); //unregistered member
  activeUser(); //authenticated user

  window.Webflow ||= [];
  window.Webflow.push(() => {

    if (!loginUser || !logoutBtn || !signUpUser) return;

    loginUser.addEventListener('click', async (e) => {
      (await client).loginWithRedirect(); //calling the auth0 login function on click
    });

	///logout button
    logoutBtn.addEventListener('click', async () => {
      (await client).logout();
    });
  });
};

init();

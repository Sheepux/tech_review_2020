<script>
  import NavBar from "./Navbar.svelte";
  import BrowseGeneric from "./browse/Generic.svelte";
  import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, concat } from '@apollo/client';
  import { setClient} from 'svelte-apollo';
  import { get } from 'svelte/store'

  import Posts from "./Posts.svelte";

  import {
    OidcContext,
    authError,
    idToken,
    accessToken,
    isAuthenticated,
    isLoading,
    login as oidclogin,
    logout as oidclogout ,
    refreshToken,
    userInfo,
  } from '@dopry/svelte-oidc';

  const httpLink = new HttpLink({
    uri: "http://localhost:8080/v1/graphql"
  });

  const authMiddleware = new ApolloLink(async (operation, forward) => {
    let access_token=null;
    if (get(isAuthenticated)){
      access_token=get(accessToken);
    }
    else if (get(isLoading)){
      access_token=JSON.parse(sessionStorage.getItem('oidc.user:http://localhost:8081/auth/realms/veilletechno2020:front_demo')).access_token;
    }
    operation.setContext({
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });
    return forward(operation);
  });

    refreshToken();
    const client = new ApolloClient({
      link: concat(authMiddleware, httpLink),
      cache: new InMemoryCache(),
    });
    setClient(client);

  let oidchidden = false;

</script>
<NavBar />


<div class="container">
  <OidcContext
    issuer="http://localhost:8081/auth/realms/veilletechno2020"
    redirect_uri="http://localhost:5000/"
    post_logout_redirect_uri="http://localhost:5000/?logout"
    client_id="front_demo"
  >
  
    <button class="btn" on:click|preventDefault='{() => oidclogin() }'>Login</button>
    <button class="btn" on:click|preventDefault='{() => oidclogout() }'>Logout</button>
    <button class="btn" on:click|preventDefault='{() => refreshToken() }'>refreshToken</button>
    <input type=checkbox bind:checked={oidchidden}> 
    {#if oidchidden}
      <table>
        <thead>
          <tr><th style="width: 20%;">store</th><th style="width: 80%;">value</th></tr>
        </thead>
        <tbody>
          <tr><td>isLoading</td><td>{$isLoading}</td></tr>
          <tr><td>isAuthenticated</td><td>{$isAuthenticated}</td></tr>
          <tr><td>accessToken</td><td style="word-break: break-all;">{$accessToken}</td></tr>
          <tr><td>idToken</td><td style="word-break: break-all;">{$idToken}</td></tr>
          <tr><td>userInfo</td><td>{JSON.stringify($userInfo, null, 2) || ''}</td></tr>
          <tr><td>authError</td><td>{$authError}</td></tr>
        </tbody>
      </table>
    {/if}
  </OidcContext>
</div>

<main>
  <section container>
    <h1>Tech-Review-2020 - powered by</h1>
    <h2>🦕 Deno, 🤖 SvelteJS and 📎 AttriCSS.</h2>
  </section>

  <section container>
    <h2>Posts</h2>
      <Posts user={$userInfo}/>
  </section>

</main>


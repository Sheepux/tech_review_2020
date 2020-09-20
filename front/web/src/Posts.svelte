<script>
  import { getClient, query, mutate } from 'svelte-apollo'; 
  import { gql } from 'apollo-boost';

  export let user;

  const client = getClient();
  const GET_POSTS = gql`
    {
      post {
        id
        title
        author
      }
    }
  `;
  
  let addpostTitle = "";
  let addpostAuthor = "";
  const ADD_POST = gql`
    mutation($addpostTitle: String!, $addpostAuthor: String!) {
      insert_post(objects : { title: $addpostTitle, author: $addpostAuthor }) {
        returning {
          id
          title
          author
        }
      }
    }
  `;

  const DEL_POST = gql`
    mutation($delpostid: Int!) {
      delete_post_by_pk(id: $delpostid) {
        id
        author
        title
      }
    }
  `;
  

  const posts = query(client, { query: GET_POSTS });

  async function addPost() {
    try {
      await mutate(client, {
        mutation: ADD_POST,
        variables: {
          addpostTitle,
          addpostAuthor
        }
      });
      addpostTitle = "";
      addpostAuthor = "";
      posts.refetch();
      }
      catch (e)
      {
        console.error("error: ", e);
      };
  }

  async function delPost(id) {
    try {
      await mutate(client, {
        mutation: DEL_POST,
        variables: {
          delpostid:id
        }
      });
      posts.refetch();
      }
      catch (e)
      {
        console.error("error: ", e);
      };
  }
  $: canModify = user !== {};
</script>
<form on:submit|preventDefault="{addPost}">
  <input placeholder="title" bind:value="{addpostTitle}" />
  <input placeholder="author" bind:value="{addpostAuthor}" />
  <button method="submit">+</button>
</form>
<ul>
  {#await $posts}
    <li>Loading...</li>
  {:then result}
    {#each result.data.post as post (post.id)}
      <li>{post.title} ({post.author}) 
        {#if canModify}<button secondary on:click={() => delPost(post.id)}>X</button>{/if}
      </li>
    {:else}
      <li>No posts found</li>
    {/each}
  {:catch error}
    <li>Error loading posts: {error}</li>
  {/await}
</ul>

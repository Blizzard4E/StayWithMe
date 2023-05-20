<script>
    import { onMount } from "svelte";
    import { transitionState } from "../../store";

    onMount(() => {
        transitionState.update(state => 0);
    })
</script>
<div class="container">
    <form action="">
        <h1><span>Create</span> A Hotel</h1>
        <h3>Name</h3>
        <div><input type="text" placeholder="Name"></div>
        <h3>Email</h3>
        <div><input type="text" placeholder="Email"></div>
        <h3>Password</h3>
        <div><input type="text" placeholder="Password"></div>
        <h3>Description</h3>
        <div><input type="text" placeholder="Description"></div>
        <h3>Location</h3>
        <div><input type="text" placeholder="Location"></div>
        <h3>Google Map Link</h3>
        <div><input type="text" placeholder="Google Map Link"></div>
        <h3>Cover Images</h3>
        <div><input type="file"></div>
        <h3>Images</h3>
        <div><input type="file"></div>
        <button>Create</button>
    </form>
</div>
<style lang="scss">
    .container {
        position: relative;
        z-index: 2;
        padding-top: 1rem;
        padding-bottom: 1rem;
        background-color: rgba(252, 247, 247, 0.7);
    }
    * {
        font-family: 'Poppins',sans-serif;
    }
    form {
        input {
            width: 400px;
            padding: 0.5rem 1rem;
            &:focus {
                outline: none;
                box-shadow: none;
            }
        }
        button {
            margin-top: 1rem;
            padding: 0.5rem .75rem;
            background-color: $pink2;
            color: white;
            font-weight: bold;
            border: none;
            font-size: 1rem;
            transition: 0.15s ease-in-out;
            &:hover {
                transform: scale(1.1);
            }
        }
    }
    h1 {
        span {
            color: $pink2;
        }
    }
</style>
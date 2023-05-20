<script>
    import { goto } from "$app/navigation";
    import { transitionState } from "../store";
    import BackgroundStarsPink from "./BackgroundStarsPink.svelte";
    import ThreeDBackgroundVertical from "./ThreeDBackgroundVertical.svelte";

    /**
     * @param {string | URL} path
     */
    function transition(path) {
        transitionState.update(state => 1);
        setTimeout(() => {
            goto(path);
        }, 1000);
    }
</script>
<div class="objects"><ThreeDBackgroundVertical/></div>
<BackgroundStarsPink/>
<div class="container">
    <nav>
        <div class="logo" on:click={() => {transition('/')}}>
            <h1>S<span>T</span>A<span>Y</span></h1>
            <h2>W<span class="medium">I</span><span class="small">TH</span><span class="medium">M</span>E</h2>
        </div>
        <div class="others">
            <div class="links">
                <a on:click={() => {transition('/login')}}>Login</a>
                <a on:click={() => {transition('/hotelManager')}}>Manage Hotel</a>
                <a on:click={() => {transition('/createHotel')}}>Create Hotel</a>
                <a on:click={() => {transition('/createUser')}}>Create Account</a>
            </div>
            <div class="bell">
                <img src="/svg/bell.svg" alt="notification bell">
            </div>
            <div class="profile">
                <h3><span>B</span>lizzard Einzbern</h3>
                <img src="/images/profile.webp" alt="">
            </div>
        </div>
    </nav>
</div>

<style lang="scss">
    .objects {
        position: relative;
        z-index: 0;
    }
    .others {
        display: flex;
        align-items: center;
    }
    .bell {
        cursor: pointer;
        margin-right: 2rem;
        transition: 0.15s ease-in-out;
        img {
            filter: invert(70%) sepia(89%) saturate(4718%) hue-rotate(301deg) brightness(100%) contrast(106%);
            width: 30px;
            height: auto;
        }
        &:hover {
            transform: scale(1.1);
        }
    }
    .hide {
        display: none;
    }
    .links {
        display: flex;
        align-items: center;
    }
    a {
        color: black;
        margin: 1rem;
        text-decoration: none;
        font-family: 'Poppins',sans-serif;
        cursor: pointer;
        transition: 0.1s ease-in-out;
        &:hover {
            transform: scale(1.1);
            color: $pink2;
        }
    }
    .profile {
        cursor: pointer;
        display: flex;
        align-items: center;
        &:hover {
            transition: 0.2s ease-in-out;
            transform: scale(1.1);
        }
        h3 {
            font-family: 'Poppins',sans-serif;
            font-size: 1.5rem;
            margin-right: 1rem;
            span {
                color: $pink2;
            }
        }
        img {
            border: 3px solid $pink2;
            width: 84px;
            height: 84px;
            object-fit: cover;
            border-radius: 50%;
        }
    }
    nav {
        background-color: rgba(252, 247, 247, 0.7);
        justify-content: space-between;
        position: relative;
        padding-top: 1rem;
        z-index: 2;
        display: flex;
    }
    .logo {
        cursor: pointer;
        display: grid;
        place-items: center;

        &:hover {
            transition: 0.15s ease-in-out;
            transform: scale(1.1);
        }

        h1,h2 {
            font-family: 'Yeseva One', cursive;
            font-weight: normal;    
            font-size: 4rem;
            color: $pink2;
            user-select: none;
            span {
                color: black;
            }
        }
        h2 {
            display: flex;
            align-items: center;
            letter-spacing: .2rem;
            font-family: 'Righteous',cursive;
            font-size: 1.5rem;
            color: black;
            margin-top: -.8rem;
            -webkit-text-stroke-width: 1px;
            .medium {
                font-size: 1.3rem;
            }
            .small {
                font-size: 1rem;
            }
        }
    }
</style>
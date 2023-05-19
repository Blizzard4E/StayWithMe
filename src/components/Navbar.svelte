<script>
    import { goto } from "$app/navigation";
    import { transitionState } from "../store";

    function home() {
        transitionState.update(state => 1);
        setTimeout(() => {
            goto('/');
        }, 1000);
    }
</script>
<div class="container">
    <nav>
        <div class="logo" on:click={home}>
            <h1>S<span>T</span>A<span>Y</span></h1>
            <h2>W<span class="medium">I</span><span class="small">TH</span><span class="medium">M</span>E</h2>
        </div>
        <div class="profile">
            <h3><span>B</span>lizzard Einzbern</h3>
            <img src="/images/profile.webp" alt="">
        </div>
    </nav>
</div>

<style lang="scss">
    .hide {
        display: none;
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
        justify-content: space-between;
        position: relative;
        padding-top: 1rem;
        z-index: 1;
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
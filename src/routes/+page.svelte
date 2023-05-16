<script>
    import BackgroundStars from "../components/BackgroundStars.svelte";
    import Navbar from "../components/Navbar.svelte";
    import ThreeDBackground from "../components/ThreeDBackground.svelte";

</script>

<div class="clickable"></div>
<BackgroundStars/>
<div class="logo">
    <h1>S<span>T</span>A<span>Y</span></h1>
    <h2>W<span class="medium">I</span><span class="small">TH</span><span class="medium">M</span>E</h2>
</div>
<div class="click">
    <p>Click to Continue</p>
</div>
<div class="background">
    <ThreeDBackground/>
</div>

<style lang="scss">
    .clickable {
        position: fixed;
        z-index: 5;
        width: 100%;
        height: 100vh;
    }
    .background {
        position: relative;
        z-index: 0;
        width: 100%;
        height: 100vh;
        background: $pink;
    }
    .logo {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 4;
        display: grid;
        place-items: center;
    }
    .click {
        position: fixed;
        bottom: 0%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 4;
        p {
            opacity: 1;
            letter-spacing: .35rem;
            font-family: 'Righteous',cursive;
            margin-bottom: 2rem;
            font-size: 1.5rem;
            color: white;
            animation: fadeInOut 2s ease-in infinite;
        }
    }
    h1,h2 {
        font-family: 'Yeseva One', cursive;
        font-weight: normal;    
        font-size: 25rem;
        color: white;
        opacity: .9;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #fc4573;
        user-select: none;
        span {
            color: black;
        }
    }
    h2 {
        display: flex;
        align-items: center;
        letter-spacing: 1rem;
        margin-top: -5rem;
        font-family: 'Righteous',cursive;
        font-size: 4rem;
        color: black;
        -webkit-text-stroke-width: 1px;
        .medium {
            font-size: 3.5rem;
        }
        .small {
            font-size: 3rem;
        }
    }
    @keyframes fadeInOut {
        0% { opacity: 1; }
        50% { opacity: 0;}
        100% { opacity: 1;}
    }
</style>

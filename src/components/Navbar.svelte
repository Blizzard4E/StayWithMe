<div class="container">
    <nav>
        <div class="logo">
            <h1>S<span>T</span>A<span>Y</span></h1>
            <h2>W<span class="medium">I</span><span class="small">TH</span><span class="medium">M</span>E</h2>
        </div>
    </nav>
</div>

<style lang="scss">
    nav {
        position: relative;
        padding-top: 1rem;
        z-index: 1;
        display: flex;
    }
    .logo {
        display: grid;
        place-items: center;
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
</style>
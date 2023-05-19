<script>
    import { onMount } from "svelte";

    class TwinkleStar {
        /**
         * @param {number} posX
         * @param {number} posY
         * @param {number} size
         */
        constructor(posX, posY, size) {
            this.posX = posX;
            this.posY = posY;
            this.size = size;
        }
        get x() {
            return this.posX;
        }
        get y() {
            return this.posY;
        }
    }

    /**
     * @type {HTMLDivElement}
     */
    let scene;
    const starCount = 30    ;
    const maxStarSize = 50;
    const minStarSize = 10;
    const maxBlinkSpeed = 0.7;
    const minBlinkSpeed = 0.5;
    /**
     * @type {Array.<TwinkleStar>}
     */
    let twinkleStars = []
    onMount(() => {
        do {
            let starType = Math.round(Math.random() * 1);
            let posX = Math.random() * 100;
            let posY = Math.random() * 100;
            let size = Math.random() * (maxStarSize - minStarSize) + minStarSize;
            let blinkSpeed = Math.random() * (maxBlinkSpeed - minBlinkSpeed) + minBlinkSpeed;
            let canPass = false;
            for (let i = 0; i < twinkleStars.length; i++) {
                if(Math.abs(posX - twinkleStars[i].x) >= 20) canPass = true;
                else if(Math.abs(posY - twinkleStars[i].y) >= 20) canPass = true;
                if(canPass) break;
            }
            if(!canPass && twinkleStars.length != 0) continue;
            let newStar = new TwinkleStar(posX,posY,size);
            twinkleStars.push(newStar);
            if(twinkleStars.length == 0) twinkleStars.push(new TwinkleStar(posX,posY,size));
            scene.innerHTML += `<img src='./svg/star_${starType}.svg' alt='Star in background' style='top:${posX}%;left:${posY}%;width:${size}px;position: fixed;
            filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(305deg) brightness(103%) contrast(101%);
            animation: starAnimation;
            animation-iteration-count: infinite;
            animation-duration:${blinkSpeed}s;
            animation-delay: 1s;
            '>`;
        } while(twinkleStars.length < starCount)
        console.log(twinkleStars);
    })
</script>

<div class="scene" bind:this={scene}>
    <!-- <div id="group-1">
        <img src="./svg/star_0.svg" alt="Star in background" style="top:1rem;left:1.5rem;width:80px;animation-duration:0.7s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:5rem;left:5rem;width:50px;animation-duration:0.5s;">
        <img src="./svg/star_0.svg" alt="Star in background" style="top:9rem;left:1.5rem;width:50px;animation-duration:2s;">
    </div>
    <div class="group-2">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:2rem;left:1.5rem;width:70px;animation-duration:0.8s;">
        <img src="./svg/star_0.svg" alt="Star in background" style="top:9rem;left:4.5rem;width:70px;animation-duration:0.5s;">
        <img src="./svg/star_0.svg" alt="Star in background" style="top:12rem;left:1rem;width:50px;animation-duration:0.2s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:15rem;left:4rem;width:30px;animation-duration:2s;">
    </div>
    <div class="group-3">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:2rem;left:.5rem;width:50px;animation-duration:0.7s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:5rem;left:4.5rem;width:70px;animation-duration:0.6s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:10rem;left:-.5rem;width:40px;animation-duration:2s;">
        <img src="./svg/star_0.svg" alt="Star in background" style="top:15rem;left:2.5rem;width:40px;animation-duration:0.2s;">
    </div>
    <div class="group-4">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:2rem;left:.5rem;width:50px;animation-duration:0.7s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:5rem;left:4.5rem;width:70px;animation-duration:0.6s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:10rem;left:-.5rem;width:40px;animation-duration:2s;">
        <img src="./svg/star_0.svg" alt="Star in background" style="top:15rem;left:2.5rem;width:40px;animation-duration:0.2s;">
    </div>
    <div class="group-5">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:2rem;left:.5rem;width:50px;animation-duration:0.7s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:5rem;left:4.5rem;width:70px;animation-duration:0.6s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:10rem;left:-.5rem;width:40px;animation-duration:2s;">
        <img src="./svg/star_0.svg" alt="Star in background" style="top:15rem;left:2.5rem;width:40px;animation-duration:0.2s;">
    </div> -->
</div>

<style lang="scss">
    .scene {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        user-select: none;

        img {
            
        }
        #group-1 {
            position: fixed;
            top: 8%;
            left: 2%;
        }
        .group-2 {
            position: fixed;
            top: 60%;
            left: 2%;
        }
        .group-3 {
            position: fixed;
            top: 3%;
            left: 90%;
        }
        .group-4 {
            position: fixed;
            top: 60%;
            left: 90%;
        }
        .group-5 {
            position: fixed;
            top: 50%;
            left: 50%;
        }
    }
    @keyframes starAnimation1 {
        0%   { transform: scale(1.2); }
        9%   { transform: scale(1.2); }
        10%   { transform: scale(1.1); }
        19%   { transform: scale(1.1); }
        20%  { transform: scale(1.3); }
        29%  { transform: scale(1.3); }
        30%   { transform: scale(1.2); }
        39% { transform: scale(1.2); }
        40%   { transform: scale(1.3); }
        45%   { transform: scale(1.3); }
        50%  { transform: scale(1.2); }
        55%  { transform: scale(1.2); }
        60% { transform: scale(1.2); }
        69% { transform: scale(1.2); }
        70% { transform: scale(1.1); }
        75% { transform: scale(1.1); }
        80% { transform: scale(1.2); }
        89% { transform: scale(1.2); }
        90% { transform: scale(1.3); }
        99% { transform: scale(1.3); }
    }
</style>
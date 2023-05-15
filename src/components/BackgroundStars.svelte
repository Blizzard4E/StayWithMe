<div class="scene">
    <div class="group-1">
        <img src="./svg/star_2.svg" alt="Star in background" style="top:1rem;left:1.5rem;width:80px;animation-duration:3s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:5rem;left:5rem;width:50px;animation-duration:2.5s;">
        <img src="./svg/star_2.svg" alt="Star in background" style="top:9rem;left:1.5rem;width:50px;animation-duration:2s;">
    </div>
    <div class="group-2">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:2rem;left:1.5rem;width:70px;animation-duration:2.8s;">
        <img src="./svg/star_2.svg" alt="Star in background" style="top:9rem;left:4.5rem;width:70px;animation-duration:2.5s;">
        <img src="./svg/star_2.svg" alt="Star in background" style="top:12rem;left:1rem;width:50px;animation-duration:2.2s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:15rem;left:4rem;width:30px;animation-duration:2s;">
    </div>
    <div class="group-3">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:2rem;left:.5rem;width:50px;animation-duration:2.7s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:5rem;left:4.5rem;width:70px;animation-duration:2.6s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:10rem;left:-.5rem;width:40px;animation-duration:2s;">
        <img src="./svg/star_2.svg" alt="Star in background" style="top:15rem;left:2.5rem;width:40px;animation-duration:2.2s;">
    </div>
    <div class="group-4">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:2rem;left:.5rem;width:50px;animation-duration:2.7s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:5rem;left:4.5rem;width:70px;animation-duration:2.6s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:10rem;left:-.5rem;width:40px;animation-duration:2s;">
        <img src="./svg/star_2.svg" alt="Star in background" style="top:15rem;left:2.5rem;width:40px;animation-duration:2.2s;">
    </div>
    <div class="group-5">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:2rem;left:.5rem;width:50px;animation-duration:2.7s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:5rem;left:4.5rem;width:70px;animation-duration:2.6s;">
        <img src="./svg/star_1.svg" alt="Star in background" style="top:10rem;left:-.5rem;width:40px;animation-duration:2s;">
        <img src="./svg/star_2.svg" alt="Star in background" style="top:15rem;left:2.5rem;width:40px;animation-duration:2.2s;">
    </div>
</div>

<style lang="scss">
    .scene {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;

        img {
            position: absolute;
            filter: invert(47%) sepia(84%) saturate(381%) hue-rotate(285deg) brightness(104%) contrast(93%);
            animation: starAnimation;
            animation-iteration-count: infinite;
        }
        .group-1 {
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
    @keyframes starAnimation {
        0%   { transform: scale(1.3); }
        9%   { transform: scale(1.3); }
        10%   { transform: scale(1.1); }
        19%   { transform: scale(1.1); }
        20%  { transform: scale(1.3); }
        29%  { transform: scale(1.3); }
        30%   { transform: scale(1.2); }
        39% { transform: scale(1.2); }
        40%   { transform: scale(1.3); }
        45%   { transform: scale(1.2); }
        50%  { transform: scale(1.0); }
        55%  { transform: scale(.9); }
        60% { transform: scale(1.2); }
        69% { transform: scale(1.2); }
        70% { transform: scale(1.1); }
        75% { transform: scale(1.0); }
        80% { transform: scale(1.2); }
        89% { transform: scale(1.2); }
        90% { transform: scale(1.3); }
        99% { transform: scale(1.3); }
    }
</style>
<script>
    import { onMount } from "svelte";
    // @ts-ignore
    import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
    // @ts-ignore
    import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
    // @ts-ignore
    import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
    // @ts-ignore
    import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
    //Modules below are regarded to shader
    // @ts-ignore
    import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
    // @ts-ignore
    import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

    const loader = new OBJLoader();

    const clock = new THREE.Clock();

    // @ts-ignore
    import * as THREE from "three";
    const objectCount = 20;
    /**
     * @type {Array.<FloatingObject>}
     */
    const bunnies = [];
    /**
     * @type {Array.<FloatingObject>}
     */
    const hearts = [];
    /**
     * @type {Array.<FloatingObject>}
     */
    const stars = [];
    const maxObjectSize = 1;
    const minObjectSize = 0.6;
    /**
     * @type {HTMLDivElement}
     */
    let threeJs;
    let bigHeart;

    class FloatingObject {
        time = Math.random() * 5;
        plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        rotateX = Math.random() * 0.01;
        rotateY = Math.random() * 0.01;
        rotateZ = Math.random() * 0.01;
        /**
         * @param {number} speedX
         * @param {number} speedY
         * @param {number} maxX
         * @param {number} maxY
         * @param {number} spawnX
         * @param {number} spawnY
         * @param {any} object
         * @param {number} zIndex
         */
        constructor(
            speedX,
            speedY,
            maxX,
            maxY,
            spawnX,
            spawnY,
            object,
            zIndex
        ) {
            this.size =
                Math.random() * (maxObjectSize - minObjectSize) + minObjectSize;
            this.speedY =
                Math.random() * (speedY - (speedY - 5)) + (speedY - 5);
            this.maxX = maxX;
            this.maxY = maxY;
            this.spawnX = spawnX;
            this.spawnY = spawnY;
            this.object = object;
            this.object.scale.set(this.size, this.size, this.size);
            this.object.position.x =
                Math.random() * (this.spawnX + this.spawnX) - this.spawnX;
            this.object.position.y =
                Math.random() * (this.spawnY - (this.spawnY - 30)) +
                (this.spawnY - 30);
            this.object.position.z = zIndex;
            this.object.rotation.x = Math.random() * 360;
            this.object.rotation.y = Math.random() * 360;
            this.object.rotation.z = Math.random() * 360;
            this.animate(300); //fast forward movement, no need to build up
        }
        /**
         * @param {number} timeAdd
         */
        animate(timeAdd) {
            if (this.object.position.y >= this.maxY) {
                this.object.position.x =
                    Math.random() * (this.spawnX + this.spawnX) - this.spawnX;
                this.object.position.y =
                    Math.random() * (this.spawnY - (this.spawnY - 30)) +
                    (this.spawnY - 30);
            }
            this.time += timeAdd;
            this.object.position.y += this.speedY * timeAdd;
            this.object.rotation.x += this.rotateX;
            this.object.rotation.y += this.rotateY;
            this.object.rotation.z += this.rotateZ;
        }
    }

    onMount(() => {
        // @ts-ignore
        const scene = new THREE.Scene();
        // @ts-ignore
        const camera = new THREE.OrthographicCamera(
            window.innerWidth / -50,
            window.innerWidth / 50,
            window.innerHeight / 50,
            window.innerHeight / -50,
            -500,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setClearColor(0xffffff, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        threeJs.appendChild(renderer.domElement);

        const blackMat = new THREE.MeshToonMaterial({ color: "#0F1018" });
        const greyMat = new THREE.MeshToonMaterial({ color: "#526477" });

        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        const outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            scene,
            camera
        );
        composer.addPass(outlinePass);

        outlinePass.edgeStrength = 3;
        outlinePass.edgeGlow = 0;
        outlinePass.edgeThickness = 1;
        outlinePass.pulsePeriod = 0;
        outlinePass.usePatternTexture = false; // patter texture for an object mesh
        outlinePass.visibleEdgeColor.set("white"); // set basic edge color
        outlinePass.hiddenEdgeColor.set("white"); // set edge color when it hidden by other objects

        const directionalLight = new THREE.DirectionalLight("white", 1);
        directionalLight.position.set(200, 300, 600);
        scene.add(directionalLight);

        /**
         * @type {any[]}
         */
        let selectedObjects = [];

        loader.load(
            "/models/bunny.obj",
            (/** @type {{ clone: () => any; }} */ model) => {
                for (let i = 0; i < objectCount; i++) {
                    let bunny = model.clone();
                    bunny.traverse(
                        (
                            /** @type {{ isMesh: any; material: any; }} */ child
                        ) => {
                            if (child.isMesh) {
                                let random = Math.floor(Math.random() * 2);
                                switch (random) {
                                    case 0:
                                        child.material = blackMat;
                                        break;
                                    case 1:
                                        child.material = greyMat;
                                        break;
                                }
                            }
                        }
                    );
                    bunnies[i] = new FloatingObject(
                        0.05,
                        6,
                        40,
                        20,
                        33,
                        -20,
                        bunny,
                        0 + i * 5
                    );
                    selectedObjects.push(bunny);
                    scene.add(bunny);
                }
                outlinePass.selectedObjects = selectedObjects;
            }
        );
        loader.load(
            "/models/heart.obj",
            (/** @type {{ clone: () => any; }} */ model) => {
                for (let i = 0; i < objectCount; i++) {
                    let heart = model.clone();
                    heart.traverse(
                        (
                            /** @type {{ isMesh: any; material: any; }} */ child
                        ) => {
                            if (child.isMesh) {
                                let random = Math.floor(Math.random() * 2);
                                switch (random) {
                                    case 0:
                                        child.material = blackMat;
                                        break;
                                    case 1:
                                        child.material = greyMat;
                                        break;
                                }
                            }
                        }
                    );
                    hearts[i] = new FloatingObject(
                        0.05,
                        6,
                        40,
                        20,
                        33,
                        -20,
                        heart,
                        100 + i * 5
                    );
                    selectedObjects.push(heart);
                    scene.add(heart);
                }
                outlinePass.selectedObjects = selectedObjects;
            }
        );
        loader.load(
            "/models/star.obj",
            (/** @type {{ clone: () => any; }} */ model) => {
                for (let i = 0; i < objectCount; i++) {
                    let star = model.clone();
                    star.traverse(
                        (
                            /** @type {{ isMesh: any; material: any; }} */ child
                        ) => {
                            if (child.isMesh) {
                                let random = Math.floor(Math.random() * 2);
                                switch (random) {
                                    case 0:
                                        child.material = blackMat;
                                        break;
                                    case 1:
                                        child.material = greyMat;
                                        break;
                                }
                            }
                        }
                    );
                    stars[i] = new FloatingObject(
                        0.05,
                        6,
                        40,
                        20,
                        33,
                        -20,
                        star,
                        200 + i * 5
                    );
                    selectedObjects.push(star);
                    scene.add(star);
                }
                outlinePass.selectedObjects = selectedObjects;
                animate();
            }
        );

        //shader
        const effectFXAA = new ShaderPass(FXAAShader);
        effectFXAA.uniforms["resolution"].value.set(
            1 / window.innerWidth,
            1 / window.innerHeight
        );
        effectFXAA.renderToScreen = true;
        composer.addPass(effectFXAA);

        function animate() {
            requestAnimationFrame(animate);
            let timeDelta = clock.getDelta();
            for (let i = 0; i < objectCount; i++) {
                bunnies[i].animate(timeDelta);
                hearts[i].animate(timeDelta);
                stars[i].animate(timeDelta);
                //bunnies[i].position.x += .00001;
                // bunnies[i].rotation.x += 0.002 * (i+1);
                // bunnies[i].rotation.y += 0.002 * (i+1);
                // bunnies[i].rotation.z += 0.002 * (i+1);
                // bunnies[i].position.y = Math.sin(0.75 * time) * 8;
                // bunnies[i].position.x += 0.08;
                //bunnies[i].position.x = 100/2 + 25 * Math.sin((time+(i+1))/2) - 50;
            }
            composer.render();
        }
    });
</script>

<div bind:this={threeJs} />

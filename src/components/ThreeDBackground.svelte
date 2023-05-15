<script>
    import { onMount } from 'svelte';
    // @ts-ignore
    import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
    // @ts-ignore
    import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
    // @ts-ignore
    import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
    // @ts-ignore
    import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
    //Modules below are regarded to shader
    // @ts-ignore
    import  { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
    // @ts-ignore
    import  { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

    const loader = new OBJLoader();

    // @ts-ignore
    import * as THREE from 'three';
    const bunniesAmount = 10;
    /**
     * @type {{ rotation: {x: number; y: number; z: number; }; position: {x: number; y: number; z: number; };}[]}
     */
    const bunnies = [];

    onMount(() => {
        // @ts-ignore
        const scene = new THREE.Scene();
        // @ts-ignore
        const camera = new THREE.OrthographicCamera( window.innerWidth / - 50, window.innerWidth / 50, window.innerHeight / 50, window.innerHeight / -50, - 500, 1000); 
        const renderer = new THREE.WebGLRenderer( { alpha: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement);

        const pinkMat = new THREE.MeshToonMaterial( { color: 'hotpink'} );
        const whiteMat = new THREE.MeshToonMaterial( { color: 'white'} );
        const cyanMat = new THREE.MeshToonMaterial( { color: 'rgb(0, 195, 255)'} );
        const yellowMat = new THREE.MeshToonMaterial( { color: 'yellow'} );
        let time = 0;

        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass( scene, camera );
        composer.addPass( renderPass );
        const outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
        composer.addPass( outlinePass );

        outlinePass.edgeStrength = 3;
        outlinePass.edgeGlow = 0;
        outlinePass.edgeThickness = 1;
        outlinePass.pulsePeriod = 0;
        outlinePass.usePatternTexture = false; // patter texture for an object mesh
        outlinePass.visibleEdgeColor.set("white"); // set basic edge color
        outlinePass.hiddenEdgeColor.set("white"); // set edge color when it hidden by other objects
        
        const directionalLight = new THREE.DirectionalLight('white', 1);
        directionalLight.position.set(200,300,600);
        scene.add( directionalLight );

        /**
         * @type {any[]}
         */
        let selectedObjects = [];

        loader.load('/models/star.obj', (/** @type {{ clone: () => any; }} */ model) => {
            for (let i = 0; i < bunniesAmount; i++) {
                let bunny = model.clone();
                bunny.traverse( (/** @type {{ isMesh: any; material: any; }} */ child) => {
                    if (child.isMesh){
                        let random = Math.floor(Math.random() * 4);
                        switch(random) {
                            case 0:
                                child.material = pinkMat;
                                break;
                            case 1:
                                child.material = whiteMat;
                                break;
                            case 2:
                                child.material = cyanMat;
                                break;
                            case 3:
                                child.material = yellowMat;
                                break;
                        }
                    }
                })
                bunnies[i] = bunny;
                bunnies[i].position.x = Math.floor(Math.random() * (34 + 34) - 34);
                selectedObjects.push(bunny);
                scene.add(bunnies[i]);
            }
            outlinePass.selectedObjects = selectedObjects;
        });
        //shader
        const effectFXAA = new ShaderPass(FXAAShader);
        effectFXAA.uniforms["resolution"].value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
        );
        effectFXAA.renderToScreen = true;
        composer.addPass(effectFXAA);

        function animate() {
            requestAnimationFrame( animate );
            time += 0.005;
            for (let i = 0; i < bunniesAmount; i++) {
                //bunnies[i].position.x += .00001;
                bunnies[i].rotation.x += 0.002 * (i+1);
                bunnies[i].rotation.y += 0.002 * (i+1);
                bunnies[i].rotation.z += 0.002 * (i+1);
                bunnies[i].position.y = (i+1)/2 + (i+1) * Math.sin((time+(i+1))/1) - 5;
                bunnies[i].position.x = 100/2 + 25 * Math.sin((time+(i+1))/2) - 50;
            }
            composer.render();
        }
        animate();
    })
</script>
<style>
    canvas {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
    }
</style>
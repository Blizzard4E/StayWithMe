<script>
    import { transitionState } from "../store";
    import { onMount } from "svelte";
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

    /**
     * @type {number}
     */
    let transitionStateValue;

	transitionState.subscribe(value => {
		transitionStateValue = value;
	});

    const loader = new OBJLoader();

    const clock = new THREE.Clock();
    /**
     * @type {HTMLDivElement}
     */
    let threeJs;
    // @ts-ignore
    import * as THREE from 'three';

    const maxX = 40;

    class Heart {
        /**
         * @param {any} object
         * @param {any} speed
         */
        constructor(object, speed, ) {
            this.object = object;
            this.speed = speed;
        }
        /**
         * @param {number} time
         */
        transitionOut(time) {
            threeJs.style.display = "block";
            if(this.object.scale.x <= 40){
                this.object.scale.set(this.object.scale.x + this.speed * time, this.object.scale.y + this.speed * time, this.object.scale.z + this.speed * time)
            }
        }
        /**
         * @param {number} time
         */
        transitionIn(time) {
            if(this.object.scale.x <= 0) {
                this.object.scale.set(0, 0, 0);
                threeJs.style.display = "none";
            }
            else if(this.object.scale.x > 0){
                this.object.scale.set(this.object.scale.x - this.speed * time, this.object.scale.y - this.speed * time, this.object.scale.z - this.speed * time);
            }
        }
    }

    /**
     * @type {Array.<Heart>}
     */
    let hearts = [];

    onMount(() => {
        // @ts-ignore
        const scene = new THREE.Scene();
        // @ts-ignore
        const camera = new THREE.OrthographicCamera( window.innerWidth / - 50, window.innerWidth / 50, window.innerHeight / 50, window.innerHeight / -50, - 500, 1000); 
        const renderer = new THREE.WebGLRenderer( { alpha: true } );
        renderer.setClearColor( 0xffffff, 0 );
        renderer.setSize( window.innerWidth, window.innerHeight );
        threeJs.appendChild( renderer.domElement);

        const pinkMat = new THREE.MeshToonMaterial( { color: '#ffa5d2'} );

        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass( scene, camera );
        composer.addPass( renderPass );
        const outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
        composer.addPass( outlinePass );

        outlinePass.edgeStrength = 5;
        outlinePass.edgeGlow = 0;
        outlinePass.edgeThickness = 2;
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
        const objectCount = 5;
        loader.load('/models/bigHeart.obj', (/** @type {{ clone: () => any; }} */ model) => {
            let heart = model.clone();
            heart.traverse( (/** @type {{ isMesh: any; material: any; }} */ child) => {
                if (child.isMesh){
                    child.material = pinkMat;
                }
            })
            heart.scale.set(40,40,40)
            hearts.push(new Heart(heart,30));
            selectedObjects.push(heart);
            scene.add(heart);
            outlinePass.selectedObjects = selectedObjects;
            animate();
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
            let timeDelta = clock.getDelta();
            if(transitionStateValue) {
                threeJs.style.display = "block";
                hearts[0].transitionOut(timeDelta);
            }
            else {
                hearts[0].transitionIn(timeDelta);
            }
            composer.render();
        }
    })

</script>
<div class="three" bind:this={threeJs}></div>
<style>
    .three {
    }
</style>
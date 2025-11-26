import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AppMode } from '../types';

interface ThreeBackgroundProps {
    mode: AppMode;
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ mode }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (!containerRef.current) return;

        // --- Config ---
        const config = {
            particleCount: 4000,
            gravityThreshold: 12,
            attractionStrength: 0.15,
            swirlStrength: 0.08,
            baseSpeed: 0.002
        };

        // --- Scene Setup ---
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x02040a, 0.035); // Void color match

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Enhance lighting realism
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        
        containerRef.current.appendChild(renderer.domElement);

        // --- Lights ---
        // Base Ambient
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);
        
        // Key Light
        const keyLight = new THREE.DirectionalLight(0xffffff, 1);
        keyLight.position.set(5, 5, 5);
        scene.add(keyLight);

        // NEW: Off-screen Gold Light (Top Right)
        const goldLight = new THREE.SpotLight(0xffaa00, 20, 100, 0.5, 0.5, 1);
        goldLight.position.set(15, 10, 10);
        scene.add(goldLight);

        // NEW: Off-screen Blue Light (Bottom Left)
        const blueLight = new THREE.PointLight(0x0044ff, 10, 50);
        blueLight.position.set(-10, -8, 5);
        scene.add(blueLight);

        // --- Object Group (The Artifact) ---
        const objectGroup = new THREE.Group();
        scene.add(objectGroup);

        const geometry = new THREE.TorusGeometry(1.8, 0.2, 4, 6); // Hex/Tech shape
        
        // Material Updated for Reflections
        const materialBody = new THREE.MeshPhysicalMaterial({
            color: 0x050817, // Dark Navy Base
            metalness: 0.9,
            roughness: 0.1, // Shiny
            clearcoat: 1.0, // Glass-like layer
            clearcoatRoughness: 0.1,
            emissive: 0x000000,
            flatShading: true,
            side: THREE.DoubleSide
        });
        const torusMesh = new THREE.Mesh(geometry, materialBody);
        objectGroup.add(torusMesh);

        const wireframeGeo = new THREE.WireframeGeometry(geometry);
        // Wireframe Updated to Gold
        const wireframeMat = new THREE.LineBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.3 });
        const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
        wireframe.scale.set(1.02, 1.02, 1.02);
        objectGroup.add(wireframe);

        // --- Particles ---
        const particlesGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(config.particleCount * 3);
        const originalPos: {r: number, a: number, y: number, z: number, speed: number}[] = [];
        
        for (let i = 0; i < config.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 8;
            const ySpread = (Math.random() - 0.5) * 2;

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * 0.5 + ySpread;
            const z = (Math.random() - 0.5) * 5;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            originalPos.push({
                r: radius, 
                a: angle, 
                y: y, 
                z: z, 
                speed: (Math.random() * 0.02) + 0.005
            });
        }
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particlesMat = new THREE.PointsMaterial({
            color: 0xff7a1a,
            size: 0.04,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        const particleSystem = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particleSystem);

        // --- Mouse Logic ---
        const mouse = new THREE.Vector2(-9999, -9999);
        const raycaster = new THREE.Raycaster();
        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const mouse3D = new THREE.Vector3();

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // --- Animation Loop ---
        const clock = new THREE.Clock();
        let frameId: number;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // Update Mouse 3D projection
            raycaster.setFromCamera(mouse, camera);
            raycaster.ray.intersectPlane(planeZ, mouse3D);

            // Animate Object
            objectGroup.rotation.x = time * 0.15;
            objectGroup.rotation.y = time * 0.2;
            objectGroup.position.y = Math.sin(time * 0.7) * 0.2; // Bobbing

            // Animate Particles
            const positionsArr = particleSystem.geometry.attributes.position.array as Float32Array;
            
            for(let i = 0; i < config.particleCount; i++) {
                const px = positionsArr[i*3];
                const py = positionsArr[i*3+1];
                const pz = positionsArr[i*3+2];

                const dx = mouse3D.x - px;
                const dy = mouse3D.y - py;
                const distSq = dx*dx + dy*dy;
                const dist = Math.sqrt(distSq);

                let vx = 0; 
                let vy = 0; 
                let vz = 0;

                const orig = originalPos[i];
                const angle = orig.a + time * orig.speed;
                const targetX = Math.cos(angle) * orig.r;
                const targetY = Math.sin(angle) * orig.r * 0.5 + orig.y;

                if (dist < config.gravityThreshold) {
                    // Vortex physics
                    const force = (1 / (dist + 0.1)) * config.attractionStrength;
                    vx += dx * force;
                    vy += dy * force;
                    
                    const swirl = (1 / (dist + 0.5)) * config.swirlStrength;
                    vx -= dy * swirl;
                    vy += dx * swirl;

                    positionsArr[i*3] += vx;
                    positionsArr[i*3+1] += vy;
                    positionsArr[i*3+2] += vz;
                } else {
                    // Orbit return
                    positionsArr[i*3] += (targetX - px) * 0.03;
                    positionsArr[i*3+1] += (targetY - py) * 0.03;
                    positionsArr[i*3+2] += (orig.z - pz) * 0.03;
                }
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
            particleSystem.rotation.z = time * 0.02;

            // Camera Parallax based on Scroll
            const scrollY = window.scrollY;
            camera.position.y = -scrollY * 0.005;

            renderer.render(scene, camera);
        };

        animate();

        // --- Cleanup ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
            if(containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="fixed inset-0 z-0 pointer-events-none"
            aria-hidden="true"
        />
    );
};

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface VercelSpinnerProps {
  size?: number;
  className?: string;
}

export const VercelSpinner: React.FC<VercelSpinnerProps> = ({ size = 80, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, logo: THREE.Mesh;
    let frameId: number;
    let startTime = Date.now();

    const init = () => {
      const width = size;
      const height = size;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
      camera.position.z = 50;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      containerRef.current?.appendChild(renderer.domElement);

      const shape = new THREE.Shape();
      shape.moveTo(0, 5);
      shape.lineTo(5.8, -5);
      shape.lineTo(-5.8, -5);
      shape.lineTo(0, 5);

      const extrudeSettings = {
        steps: 1,
        depth: 2.5,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.5,
        bevelOffset: 0,
        bevelSegments: 5
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.center();

      const material = new THREE.MeshStandardMaterial({
        color: 0x0070f3,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x0070f3,
        emissiveIntensity: 0.5
      });

      logo = new THREE.Mesh(geometry, material);
      scene.add(logo);

      // Studio Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));

      const p1 = new THREE.PointLight(0xffffff, 2);
      p1.position.set(20, 20, 40);
      scene.add(p1);

      const p2 = new THREE.PointLight(0x0070f3, 1.5);
      p2.position.set(-20, -10, 20);
      scene.add(p2);

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const elapsed = (Date.now() - startTime) * 0.001;

        // 1. High-energy rotation
        logo.rotation.y += 0.08;

        // 2. Dynamic Floating (Sine wave)
        logo.position.y = Math.sin(elapsed * 2.5) * 0.8;

        // 3. Subtle tilting oscillation
        logo.rotation.x = 0.25 + Math.cos(elapsed * 2) * 0.05;

        // 4. Pulsing Glow
        if (logo.material instanceof THREE.MeshStandardMaterial) {
          logo.material.emissiveIntensity = 0.4 + Math.sin(elapsed * 2.5) * 0.2;
        }

        renderer.render(scene, camera);
      };

      animate();
    };

    init();

    return () => {
      cancelAnimationFrame(frameId);
      if (renderer) {
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return <div ref={containerRef} className={className} style={{ width: size, height: size }} />;
};

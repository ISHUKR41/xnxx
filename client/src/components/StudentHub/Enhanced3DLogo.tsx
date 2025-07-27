import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface Enhanced3DLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export const Enhanced3DLogo: React.FC<Enhanced3DLogoProps> = ({ 
  size = 100, 
  className = '',
  animated = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);

    // Create animated "S" logo geometry
    const sGeometry = new THREE.RingGeometry(0.3, 0.5, 8, 1, 0, Math.PI);
    const hGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    const dotGeometry = new THREE.SphereGeometry(0.08, 16, 16);

    // Materials with animated colors
    const sMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.9,
      shininess: 100
    });
    
    const hMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.8,
      shininess: 100
    });

    const dotMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.9,
      shininess: 100
    });

    // Create meshes
    const sMesh = new THREE.Mesh(sGeometry, sMaterial);
    const hMesh1 = new THREE.Mesh(hGeometry, hMaterial);
    const hMesh2 = new THREE.Mesh(hGeometry, hMaterial);
    const hMesh3 = new THREE.Mesh(hGeometry, hMaterial); // horizontal bar
    const dotMesh = new THREE.Mesh(dotGeometry, dotMaterial);

    // Position the "StudentHub" logo elements
    sMesh.position.set(-0.8, 0.2, 0);
    sMesh.rotation.z = Math.PI;
    
    hMesh1.position.set(0.2, 0, 0);
    hMesh2.position.set(0.6, 0, 0);
    
    hMesh3.geometry = new THREE.BoxGeometry(0.4, 0.1, 0.1);
    hMesh3.position.set(0.4, 0, 0);
    
    dotMesh.position.set(0.8, 0.4, 0.2);

    // Create orbital elements around the logo
    const orbitElements: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const elementGeo = new THREE.SphereGeometry(0.03, 8, 8);
      const elementMat = new THREE.MeshPhongMaterial({ 
        color: [0x3b82f6, 0x22d3ee, 0xfbbf24, 0x10b981][i % 4],
        transparent: true,
        opacity: 0.7
      });
      const element = new THREE.Mesh(elementGeo, elementMat);
      orbitElements.push(element);
      scene.add(element);
    }
    hMesh3.position.set(0.4, 0, 0);
    
    dotMesh.position.set(0.9, 0.4, 0);

    // Group all elements
    const logoGroup = new THREE.Group();
    logoGroup.add(sMesh, hMesh1, hMesh2, hMesh3, dotMesh);
    scene.add(logoGroup);

    // Add floating particles around logo
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x4ade80,
      size: 0.02,
      transparent: true,
      opacity: 0.6
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    
    const pointLight = new THREE.PointLight(0x3b82f6, 0.8, 10);
    pointLight.position.set(0, 0, 2);
    
    scene.add(ambientLight, directionalLight, pointLight);

    camera.position.z = 3;

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;
      
      if (animated) {
        // Rotate the entire logo group
        logoGroup.rotation.y += 0.01;
        logoGroup.rotation.x = Math.sin(time * 0.5) * 0.1;
        
        // Individual element animations
        sMesh.rotation.z = Math.PI + Math.sin(time * 2) * 0.1;
        
        hMesh1.scale.y = 1 + Math.sin(time * 3) * 0.1;
        hMesh2.scale.y = 1 + Math.cos(time * 3) * 0.1;
        hMesh3.scale.x = 1 + Math.sin(time * 2) * 0.05;
        
        dotMesh.position.y = 0.4 + Math.sin(time * 4) * 0.1;
        dotMesh.rotation.y += 0.02;
        
        // Particle animation
        particles.rotation.y += 0.005;
        particles.rotation.x += 0.002;
        
        // Color animations
        const hue = (time * 50) % 360;
        sMaterial.color.setHSL(hue / 360, 0.7, 0.5);
        hMaterial.color.setHSL((hue + 120) / 360, 0.7, 0.6);
        dotMaterial.color.setHSL((hue + 240) / 360, 0.8, 0.6);
        
        // Hover effects
        if (isHovered) {
          logoGroup.scale.setScalar(1.1 + Math.sin(time * 5) * 0.05);
          pointLight.intensity = 1.2 + Math.sin(time * 4) * 0.3;
        } else {
          logoGroup.scale.setScalar(1);
          pointLight.intensity = 0.8;
        }
      }

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [size, animated, isHovered]);

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <canvas 
        ref={canvasRef}
        className="rounded-lg cursor-pointer"
        style={{ width: size, height: size }}
      />
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-yellow-500/20 blur-md -z-10"
        style={{ 
          animation: animated ? 'pulse 2s infinite' : 'none',
          width: size + 20, 
          height: size + 20, 
          left: -10, 
          top: -10 
        }}
      />
      
      {/* Text label */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        <span className="text-xs font-bold text-white whitespace-nowrap">
          StudentHub.com
        </span>
      </div>
    </motion.div>
  );
};

export default Enhanced3DLogo;
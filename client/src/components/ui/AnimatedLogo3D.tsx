import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GraduationCap, BookOpen, Star } from 'lucide-react';

interface AnimatedLogo3DProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AnimatedLogo3D: React.FC<AnimatedLogo3DProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  const sizes = {
    sm: { width: 40, height: 40 },
    md: { width: 60, height: 60 },
    lg: { width: 80, height: 80 }
  };

  const currentSize = sizes[size];

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true 
    });

    renderer.setSize(currentSize.width, currentSize.height);
    renderer.setClearColor(0x000000, 0);
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create 3D graduation cap
    const capGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 8);
    const capMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x3B82F6,
      shininess: 100 
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 0.3;

    // Create cap board
    const boardGeometry = new THREE.BoxGeometry(1.2, 0.05, 1.2);
    const boardMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1E40AF,
      shininess: 100 
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = 0.4;

    // Create tassel
    const tasselGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const tasselMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xF59E0B,
      shininess: 100 
    });
    const tassel = new THREE.Mesh(tasselGeometry, tasselMaterial);
    tassel.position.set(0.6, 0.45, 0.6);

    // Create floating particles
    const particleGeometry = new THREE.SphereGeometry(0.02, 4, 4);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x10B981,
      transparent: true,
      opacity: 0.8 
    });

    const particles: THREE.Mesh[] = [];
    for (let i = 0; i < 12; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
      particles.push(particle);
      scene.add(particle);
    }

    // Create ring glow effect
    const ringGeometry = new THREE.RingGeometry(1.2, 1.5, 16);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide 
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;

    // Add components to scene
    scene.add(cap);
    scene.add(board);
    scene.add(tassel);
    scene.add(ring);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x3B82F6, 0.8);
    pointLight.position.set(-2, 2, 2);
    scene.add(pointLight);

    camera.position.z = 3;

    // Animation
    const animate = () => {
      // Rotate graduation cap
      cap.rotation.y += 0.015;
      board.rotation.y += 0.015;
      tassel.rotation.y += 0.015;

      // Pulse ring effect
      ring.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.1);
      ring.material.opacity = 0.1 + Math.sin(Date.now() * 0.003) * 0.1;

      // Animate particles
      particles.forEach((particle, index) => {
        particle.position.y += Math.sin(Date.now() * 0.003 + index) * 0.005;
        particle.position.x += Math.cos(Date.now() * 0.002 + index) * 0.003;
        particle.rotation.x += 0.02;
        particle.rotation.y += 0.02;
      });

      // Slight camera movement
      camera.position.x = Math.sin(Date.now() * 0.001) * 0.1;
      camera.position.y = Math.cos(Date.now() * 0.0008) * 0.05;

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
  }, [currentSize.width, currentSize.height]);

  return (
    <div className={`relative group ${className}`}>
      {/* 3D Canvas */}
      <canvas 
        ref={canvasRef}
        className="rounded-lg group-hover:scale-110 transition-transform duration-300"
        style={{ 
          width: currentSize.width, 
          height: currentSize.height,
          filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))'
        }}
      />
      
      {/* Glow effect overlay */}
      <div 
        className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ 
          width: currentSize.width, 
          height: currentSize.height,
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
        }}
      />
    </div>
  );
};
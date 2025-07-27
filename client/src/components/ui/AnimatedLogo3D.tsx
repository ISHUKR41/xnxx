import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GraduationCap, BookOpen, Star } from 'lucide-react';

interface AnimatedLogo3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  interactive?: boolean;
}

export const AnimatedLogo3D: React.FC<AnimatedLogo3DProps> = ({ 
  size = 'md', 
  className = '',
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const sizes = {
    sm: { width: 40, height: 40 },
    md: { width: 60, height: 60 },
    lg: { width: 80, height: 80 },
    xl: { width: 120, height: 120 }
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

    // Create enhanced 3D graduation cap with better materials
    const capGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.12, 16);
    const capMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3B82F6,
      metalness: 0.3,
      roughness: 0.2,
      emissive: 0x001122,
      emissiveIntensity: 0.1
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 0.3;
    cap.castShadow = true;

    // Create enhanced cap board with beveled edges
    const boardGeometry = new THREE.BoxGeometry(1.4, 0.06, 1.4);
    const boardMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1E40AF,
      metalness: 0.4,
      roughness: 0.1,
      emissive: 0x000044,
      emissiveIntensity: 0.05
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.position.y = 0.42;
    board.castShadow = true;

    // Create enhanced tassel with chain
    const tasselGeometry = new THREE.SphereGeometry(0.1, 12, 12);
    const tasselMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xF59E0B,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x221100,
      emissiveIntensity: 0.1
    });
    const tassel = new THREE.Mesh(tasselGeometry, tasselMaterial);
    tassel.position.set(0.7, 0.48, 0.7);
    tassel.castShadow = true;

    // Create tassel chain
    const chainGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 8);
    const chainMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFD700,
      metalness: 0.9,
      roughness: 0.1
    });
    const chain = new THREE.Mesh(chainGeometry, chainMaterial);
    chain.position.set(0.7, 0.55, 0.7);

    // Create book stack
    const createBook = (y: number, color: number, width = 0.6) => {
      const bookGeometry = new THREE.BoxGeometry(width, 0.08, 0.4);
      const bookMaterial = new THREE.MeshStandardMaterial({ 
        color,
        metalness: 0.1,
        roughness: 0.8
      });
      const book = new THREE.Mesh(bookGeometry, bookMaterial);
      book.position.set(-0.8, y, 0);
      book.rotation.y = Math.random() * 0.3 - 0.15;
      return book;
    };

    const books = [
      createBook(-0.1, 0x10B981, 0.7),
      createBook(0.0, 0xEF4444, 0.65),
      createBook(0.1, 0x8B5CF6, 0.6)
    ];

    // Create enhanced floating particles with different shapes
    const particles: THREE.Mesh[] = [];
    const particleShapes = [
      new THREE.SphereGeometry(0.025, 8, 8),
      new THREE.OctahedronGeometry(0.03),
      new THREE.TetrahedronGeometry(0.035),
      new THREE.DodecahedronGeometry(0.02)
    ];
    
    const particleColors = [0x3B82F6, 0x10B981, 0xF59E0B, 0xEF4444, 0x8B5CF6, 0xEC4899];

    for (let i = 0; i < 20; i++) {
      const geometry = particleShapes[i % particleShapes.length];
      const material = new THREE.MeshStandardMaterial({ 
        color: particleColors[i % particleColors.length],
        transparent: true,
        opacity: 0.7,
        emissive: particleColors[i % particleColors.length],
        emissiveIntensity: 0.1
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 3
      );
      particles.push(particle);
      scene.add(particle);
    }

    // Create multiple ring glow effects
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.RingGeometry(1.2 + i * 0.3, 1.5 + i * 0.3, 24);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: [0x3B82F6, 0x10B981, 0x8B5CF6][i],
        transparent: true,
        opacity: 0.15 - i * 0.03,
        side: THREE.DoubleSide 
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      rings.push(ring);
      scene.add(ring);
    }

    // Create dynamic starfield
    const starGeometry = new THREE.SphereGeometry(0.008, 6, 6);
    const starMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.8
    });
    const stars: THREE.Mesh[] = [];

    for (let i = 0; i < 50; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      stars.push(star);
      scene.add(star);
    }

    // Add components to scene
    scene.add(cap);
    scene.add(board);
    scene.add(tassel);
    scene.add(chain);
    books.forEach(book => scene.add(book));

    // Enhanced lighting system
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(3, 3, 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Multiple colored point lights
    const pointLight1 = new THREE.PointLight(0x3B82F6, 0.6);
    pointLight1.position.set(-2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x10B981, 0.4);
    pointLight2.position.set(2, -1, 2);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xF59E0B, 0.3);
    pointLight3.position.set(0, 3, -2);
    scene.add(pointLight3);

    // Spotlight for dramatic effect
    const spotLight = new THREE.SpotLight(0xffffff, 0.8);
    spotLight.position.set(0, 4, 2);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.decay = 2;
    spotLight.distance = 8;
    scene.add(spotLight);

    // Enable shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    camera.position.z = 3;

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      }
    };

    if (interactive) {
      canvasRef.current.addEventListener('mousemove', handleMouseMove);
    }

    // Enhanced animation
    const animate = () => {
      const time = Date.now() * 0.001;
      
      // Rotate graduation cap system
      cap.rotation.y += 0.012;
      board.rotation.y += 0.012;
      tassel.rotation.y += 0.015;
      chain.rotation.z = Math.sin(time * 2) * 0.1;

      // Animate books
      books.forEach((book, index) => {
        book.rotation.y = Math.sin(time + index) * 0.1;
        book.position.y = -0.1 + index * 0.1 + Math.sin(time * 2 + index) * 0.02;
      });

      // Enhanced ring effects
      rings.forEach((ring, index) => {
        ring.rotation.z += 0.005 * (index + 1);
        ring.scale.setScalar(1 + Math.sin(time * 3 + index) * 0.1);
        if (ring.material instanceof THREE.MeshBasicMaterial) {
          ring.material.opacity = (0.15 - index * 0.03) + Math.sin(time * 2 + index) * 0.05;
        }
      });

      // Animate particles with improved physics
      particles.forEach((particle, index) => {
        const speed = 0.003 + (index % 3) * 0.001;
        particle.position.y += Math.sin(time * speed + index) * 0.008;
        particle.position.x += Math.cos(time * speed * 0.7 + index) * 0.005;
        particle.position.z += Math.sin(time * speed * 1.3 + index) * 0.004;
        
        particle.rotation.x += 0.015 + (index % 2) * 0.01;
        particle.rotation.y += 0.02 + (index % 3) * 0.005;
        particle.rotation.z += 0.01;

        // Boundary check - reset position if too far
        if (Math.abs(particle.position.x) > 2) particle.position.x *= -0.8;
        if (Math.abs(particle.position.y) > 1.5) particle.position.y *= -0.8;
        if (Math.abs(particle.position.z) > 2) particle.position.z *= -0.8;
      });

      // Animate stars
      stars.forEach((star, index) => {
        star.rotation.x += 0.01;
        star.rotation.y += 0.01;
        if (star.material instanceof THREE.MeshBasicMaterial) {
          star.material.opacity = 0.3 + Math.sin(time * 3 + index * 0.5) * 0.3;
        }
      });

      // Interactive camera movement
      if (interactive) {
        camera.position.x = Math.sin(time * 0.5) * 0.1 + mouseRef.current.x * 0.1;
        camera.position.y = Math.cos(time * 0.3) * 0.05 + mouseRef.current.y * 0.1;
        camera.lookAt(0, 0, 0);
      } else {
        camera.position.x = Math.sin(time * 0.5) * 0.1;
        camera.position.y = Math.cos(time * 0.3) * 0.05;
      }

      // Dynamic lighting
      pointLight1.intensity = 0.6 + Math.sin(time * 2) * 0.2;
      pointLight2.intensity = 0.4 + Math.cos(time * 1.5) * 0.2;
      pointLight3.intensity = 0.3 + Math.sin(time * 2.5) * 0.1;

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (interactive && canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [currentSize.width, currentSize.height, interactive]);

  return (
    <div className={`relative group ${className}`}>
      {/* 3D Canvas */}
      <canvas 
        ref={canvasRef}
        className="rounded-xl group-hover:scale-110 transition-all duration-500 cursor-pointer"
        style={{ 
          width: currentSize.width, 
          height: currentSize.height,
          filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 25px rgba(16, 185, 129, 0.2))'
        }}
      />
      
      {/* Enhanced glow effect overlay */}
      <div 
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/30 via-green-500/20 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none blur-sm"
        style={{ 
          width: currentSize.width, 
          height: currentSize.height,
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.6), 0 0 40px rgba(16, 185, 129, 0.4)'
        }}
      />
      
      {/* Pulsing ring indicator */}
      <div 
        className="absolute inset-0 rounded-xl border-2 border-blue-400/50 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ 
          width: currentSize.width, 
          height: currentSize.height,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
    </div>
  );
};
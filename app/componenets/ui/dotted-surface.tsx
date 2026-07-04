'use client';
import { cn } from '../lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef } from 'react';
// @ts-expect-error - three types not installed
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const { theme } = useTheme();
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		renderer: THREE.WebGLRenderer;
		animationId: number;
	} | null>(null);
	const countRef = useRef<number>(0);

	useEffect(() => {
		if (!containerRef.current) return;

		const SEPARATION = 150;
		const AMOUNTX = 40;
		const AMOUNTY = 60;

		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(
			60,
			containerRef.current.clientWidth / containerRef.current.clientHeight,
			1,
			10000,
		);
		camera.position.set(0, 355, 1220);
		camera.lookAt(0, 0, 0);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			powerPreference: 'low-power',
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);

		containerRef.current.appendChild(renderer.domElement);

		const count = AMOUNTX * AMOUNTY;
		const positions: Float32Array = new Float32Array(count * 3);
		const colors: Float32Array = new Float32Array(count * 3);

		let i = 0;
		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const idx = i * 3;
				positions[idx] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				positions[idx + 1] = 0;
				positions[idx + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

				if (theme === 'dark') {
					colors[idx] = 200 / 255;
					colors[idx + 1] = 200 / 255;
					colors[idx + 2] = 200 / 255;
				} else {
					colors[idx] = 0;
					colors[idx + 1] = 0;
					colors[idx + 2] = 0;
				}
				i++;
			}
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: 8,
			vertexColors: true,
			transparent: true,
			opacity: 0.6,
			sizeAttenuation: true,
		});

		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let animationId = 0;
		let animationCount = 0;

		const animate = () => {
			animationId = requestAnimationFrame(animate);

			const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
			const posArray = positionAttribute.array as Float32Array;

			let j = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					const idx = j * 3;
					posArray[idx + 1] =
						Math.sin((ix + animationCount) * 0.3) * 50 +
						Math.sin((iy + animationCount) * 0.5) * 50;
					j++;
				}
			}

			positionAttribute.needsUpdate = true;
			renderer.render(scene, camera);
			animationCount += 0.1;
		};

		const handleResize = () => {
			if (!containerRef.current) return;
			camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
		};

		window.addEventListener('resize', handleResize);
		animate();

		sceneRef.current = { renderer, animationId };
		countRef.current = animationCount;

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationId);

			geometry.dispose();
			material.dispose();
			renderer.dispose();

			if (containerRef.current && renderer.domElement) {
				containerRef.current.removeChild(renderer.domElement);
			}
		};
	}, [theme]);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none absolute inset-0 -z-10', className)}
			{...props}
		/>
	);
}
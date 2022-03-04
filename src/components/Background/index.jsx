import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, ScrollControls } from "@react-three/drei";
import { PerspectiveCamera } from "three";
function Ring() {
	const ref = useRef();
	useFrame((state, delta) => (ref.current.rotation.x += 0.001));
	useFrame((state, delta) => (ref.current.rotation.y += 0.001));
	return (
		<mesh ref={ref} position={[-10, -10, -30]}>
			<torusGeometry attach="geometry" args={[7, 3, 16, 100]} />
			<meshStandardMaterial attach="material" color={"lightgreen"} wireframe />
		</mesh>
	);
}

function Moon() {
	const ref = useRef();
	useFrame((state, delta) => (ref.current.rotation.x += 0.001));
	useFrame((state, delta) => (ref.current.rotation.y += 0.001));
	return (
		<mesh ref={ref} position={[50, 10, -30]}>
			<sphereGeometry attach="geometry" args={[5, 20, 20]} />
			<meshStandardMaterial attach="material" color={"lightblue"} wireframe />
		</mesh>
	);
}
function Camera(props) {
	const cameraRef = useRef();
	const set = useThree(({ set }) => set);
	const size = useThree(({ size }) => size);

	useLayoutEffect(() => {
		if (cameraRef.current) {
			cameraRef.current.aspect = size.width / size.height;
			cameraRef.current.position.y = props.x / 100;
			cameraRef.current.rotation.y = props.x / -900;

			cameraRef.current.updateProjectionMatrix();
		}
	}, [size, props, props.x]);

	useLayoutEffect(() => {
		set({ camera: cameraRef.current });
	}, []);

	return <perspectiveCamera ref={cameraRef} />;
}
export default function Background() {
	const [offset, setOffset] = React.useState(null);
	const setScroll = () => {
		setOffset(window.scrollY);
	};
	useEffect(() => {
		window.addEventListener("scroll", setScroll);
		return () => {
			window.removeEventListener("scroll", setScroll);
		};
	}, []);

	return (
		<Canvas style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}>
			<Stars />
			<Camera x={offset} position={[0, 0, 10]} />
			<ambientLight intensity={0.05} />
			<spotLight position={[10, 60, 10]} />
			<Ring />
			<Moon />
		</Canvas>
	);
}

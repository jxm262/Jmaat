(function() {
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(35, window.innerWidth
			/ window.innerHeight, 0.1, 1000);
	camera.position.x = 0;
	/*
	 * To make transparent background alpha: true set to color clear
	 */

	var renderer = new THREE.WebGLRenderer({
		alpha : true
	});
	renderer.setClearColor(0x000000, 0);

	var total = window.innerWidth + window.innerHeight;
	var widthProport = window.innerWidth / total;
	var heightProport = window.innerHeight / total;

	renderer.setSize(300 * widthProport, 300 * heightProport);
	window.j = renderer.domElement;
	document.getElementById("cube").appendChild(renderer.domElement);

	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshBasicMaterial({
		color : 0x00ff00
	});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	camera.position.z = 5;

	var render = function() {
		requestAnimationFrame(render);

		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;

		renderer.render(scene, camera);
	};

	render();
})();
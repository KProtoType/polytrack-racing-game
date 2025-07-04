class Track {
    constructor() {
        this.trackMesh = null;
        this.barrierMeshes = [];
        this.checkpoints = [];
        this.startFinishLine = null;
        
        // Track parameters
        this.trackWidth = 8;
        this.trackPoints = [];
        this.trackRadius = 40;
        this.checkpointsPassed = new Set();
        this.lapCount = 0;
        
        // Visual elements
        this.decorations = [];
        
        this.generateTrack();
        this.createTrackMesh();
        this.createBarriers();
        this.createCheckpoints();
        this.createDecorations();
    }
    
    generateTrack() {
        // Create a curved racing circuit with elevation changes
        const numPoints = 32;
        const centerX = 0;
        const centerZ = 0;
        
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            
            // Create an interesting track shape (not just a circle)
            let radius = this.trackRadius;
            
            // Add some variation to make it more interesting
            if (i >= 4 && i <= 8) {
                radius *= 1.3; // Wider turn
            } else if (i >= 12 && i <= 16) {
                radius *= 0.8; // Tighter turn
            } else if (i >= 20 && i <= 24) {
                radius *= 1.2; // Another wide section
            }
            
            // Add elevation changes
            let height = 0;
            if (i >= 6 && i <= 10) {
                height = Math.sin((i - 6) / 4 * Math.PI) * 3; // Hill
            } else if (i >= 18 && i <= 22) {
                height = -Math.sin((i - 18) / 4 * Math.PI) * 2; // Dip
            }
            
            const x = centerX + Math.cos(angle) * radius;
            const z = centerZ + Math.sin(angle) * radius;
            
            this.trackPoints.push({
                x: x,
                y: height,
                z: z,
                angle: angle
            });
        }
    }
    
    createTrackMesh() {
        const trackGroup = new THREE.Group();
        
        // Create track surface using segments
        for (let i = 0; i < this.trackPoints.length; i++) {
            const current = this.trackPoints[i];
            const next = this.trackPoints[(i + 1) % this.trackPoints.length];
            
            // Calculate track direction
            const direction = new THREE.Vector3(
                next.x - current.x,
                next.y - current.y,
                next.z - current.z
            ).normalize();
            
            // Calculate perpendicular vector for track width
            const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x);
            
            // Create track segment geometry
            const segmentGeometry = new THREE.PlaneGeometry(this.trackWidth, direction.length() * 20);
            const segmentMaterial = new THREE.MeshLambertMaterial({
                color: 0x333333,
                flatShading: true
            });
            
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segment.position.set(current.x, current.y, current.z);
            segment.lookAt(next.x, next.y, next.z);
            segment.rotation.x = -Math.PI / 2;
            segment.receiveShadow = true;
            
            trackGroup.add(segment);
            
            // Add track markings
            this.createTrackMarkings(trackGroup, current, next, perpendicular, i);
        }
        
        // Create ground plane
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({
            color: 0x2d5a27,
            flatShading: true
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        trackGroup.add(ground);
        
        this.trackMesh = trackGroup;
    }
    
    createTrackMarkings(trackGroup, current, next, perpendicular, index) {
        // Center line
        if (index % 4 === 0) {
            const lineGeometry = new THREE.BoxGeometry(0.2, 0.05, 2);
            const lineMaterial = new THREE.MeshLambertMaterial({
                color: 0xffff00,
                flatShading: true
            });
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.position.set(current.x, current.y + 0.02, current.z);
            trackGroup.add(line);
        }
        
        // Side lines
        const sideLineGeometry = new THREE.BoxGeometry(0.3, 0.05, 1);
        const sideLineMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            flatShading: true
        });
        
        // Left side line
        const leftLine = new THREE.Mesh(sideLineGeometry, sideLineMaterial);
        const leftPos = perpendicular.clone().multiplyScalar(this.trackWidth / 2 - 0.5);
        leftLine.position.set(
            current.x + leftPos.x,
            current.y + 0.02,
            current.z + leftPos.z
        );
        trackGroup.add(leftLine);
        
        // Right side line
        const rightLine = new THREE.Mesh(sideLineGeometry, sideLineMaterial);
        const rightPos = perpendicular.clone().multiplyScalar(-this.trackWidth / 2 + 0.5);
        rightLine.position.set(
            current.x + rightPos.x,
            current.y + 0.02,
            current.z + rightPos.z
        );
        trackGroup.add(rightLine);
    }
    
    createBarriers() {
        this.barrierMeshes = [];
        
        for (let i = 0; i < this.trackPoints.length; i++) {
            const current = this.trackPoints[i];
            const next = this.trackPoints[(i + 1) % this.trackPoints.length];
            
            // Calculate direction and perpendicular
            const direction = new THREE.Vector3(
                next.x - current.x,
                next.y - current.y,
                next.z - current.z
            ).normalize();
            const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x);
            
            // Create barriers on both sides
            this.createBarrierSegment(current, perpendicular, this.trackWidth / 2 + 2, 'outer');
            this.createBarrierSegment(current, perpendicular, -this.trackWidth / 2 - 2, 'inner');
        }
    }
    
    createBarrierSegment(point, perpendicular, offset, type) {
        const barrierGeometry = new THREE.BoxGeometry(1, 2, 1);
        const barrierMaterial = new THREE.MeshLambertMaterial({
            color: type === 'outer' ? 0xff4444 : 0x4444ff,
            flatShading: true
        });
        
        const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
        const barrierPos = perpendicular.clone().multiplyScalar(offset);
        barrier.position.set(
            point.x + barrierPos.x,
            point.y + 1,
            point.z + barrierPos.z
        );
        barrier.castShadow = true;
        barrier.userData = { type: 'barrier' };
        
        this.barrierMeshes.push(barrier);
    }
    
    createCheckpoints() {
        this.checkpoints = [];
        const numCheckpoints = 8;
        
        for (let i = 0; i < numCheckpoints; i++) {
            const pointIndex = Math.floor((i / numCheckpoints) * this.trackPoints.length);
            const point = this.trackPoints[pointIndex];
            
            const checkpoint = {
                position: new THREE.Vector3(point.x, point.y, point.z),
                index: i,
                passed: false
            };
            
            this.checkpoints.push(checkpoint);
            
            // Create visual checkpoint marker
            const checkpointGeometry = new THREE.RingGeometry(2, 3, 8);
            const checkpointMaterial = new THREE.MeshLambertMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.3,
                flatShading: true
            });
            
            const checkpointMesh = new THREE.Mesh(checkpointGeometry, checkpointMaterial);
            checkpointMesh.position.copy(checkpoint.position);
            checkpointMesh.position.y += 0.1;
            checkpointMesh.rotation.x = -Math.PI / 2;
            checkpointMesh.userData = { type: 'checkpoint', index: i };
            
            this.checkpoints[i].mesh = checkpointMesh;
        }
        
        // Create start/finish line
        const startPoint = this.trackPoints[0];
        const finishGeometry = new THREE.PlaneGeometry(this.trackWidth, 0.5);
        const finishMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            flatShading: true
        });
        
        this.startFinishLine = new THREE.Mesh(finishGeometry, finishMaterial);
        this.startFinishLine.position.set(startPoint.x, startPoint.y + 0.05, startPoint.z);
        this.startFinishLine.rotation.x = -Math.PI / 2;
        this.startFinishLine.userData = { type: 'finish' };
    }
    
    createDecorations() {
        this.decorations = [];
        
        // Add some trees and rocks around the track
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = this.trackRadius + 15 + Math.random() * 20;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            
            if (Math.random() > 0.5) {
                // Create tree
                this.createTree(x, 0, z);
            } else {
                // Create rock
                this.createRock(x, 0, z);
            }
        }
        
        // Add some speed boost pads on the track
        for (let i = 0; i < 4; i++) {
            const pointIndex = Math.floor(Math.random() * this.trackPoints.length);
            const point = this.trackPoints[pointIndex];
            this.createSpeedBoost(point.x, point.y, point.z);
        }
    }
    
    createTree(x, y, z) {
        const treeGroup = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3, 6);
        const trunkMaterial = new THREE.MeshLambertMaterial({
            color: 0x8B4513,
            flatShading: true
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        treeGroup.add(trunk);
        
        // Leaves
        const leavesGeometry = new THREE.ConeGeometry(2, 4, 8);
        const leavesMaterial = new THREE.MeshLambertMaterial({
            color: 0x228B22,
            flatShading: true
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 4;
        leaves.castShadow = true;
        treeGroup.add(leaves);
        
        treeGroup.position.set(x, y, z);
        this.decorations.push(treeGroup);
    }
    
    createRock(x, y, z) {
        const rockGeometry = new THREE.DodecahedronGeometry(Math.random() * 1 + 0.5, 0);
        const rockMaterial = new THREE.MeshLambertMaterial({
            color: 0x696969,
            flatShading: true
        });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(x, y + 0.5, z);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        this.decorations.push(rock);
    }
    
    createSpeedBoost(x, y, z) {
        const boostGeometry = new THREE.RingGeometry(1, 2, 6);
        const boostMaterial = new THREE.MeshLambertMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.7,
            flatShading: true
        });
        const boost = new THREE.Mesh(boostGeometry, boostMaterial);
        boost.position.set(x, y + 0.1, z);
        boost.rotation.x = -Math.PI / 2;
        boost.userData = { type: 'speedBoost' };
        this.decorations.push(boost);
    }
    
    addToScene(scene) {
        scene.add(this.trackMesh);
        
        this.barrierMeshes.forEach(barrier => {
            scene.add(barrier);
        });
        
        this.checkpoints.forEach(checkpoint => {
            scene.add(checkpoint.mesh);
        });
        
        scene.add(this.startFinishLine);
        
        this.decorations.forEach(decoration => {
            scene.add(decoration);
        });
    }
    
    removeFromScene(scene) {
        scene.remove(this.trackMesh);
        
        this.barrierMeshes.forEach(barrier => {
            scene.remove(barrier);
        });
        
        this.checkpoints.forEach(checkpoint => {
            scene.remove(checkpoint.mesh);
        });
        
        scene.remove(this.startFinishLine);
        
        this.decorations.forEach(decoration => {
            scene.remove(decoration);
        });
    }
    
    checkCollision(car) {
        const carPosition = car.getPosition();
        let hadCollision = false;
        
        // Check collision with barriers
        this.barrierMeshes.forEach(barrier => {
            const distance = carPosition.distanceTo(barrier.position);
            if (distance < 2) {
                // Calculate collision normal
                const normal = carPosition.clone().sub(barrier.position).normalize();
                car.handleCollision(normal);
                hadCollision = true;
            }
        });
        
        // Check for speed boosts
        this.decorations.forEach(decoration => {
            if (decoration.userData && decoration.userData.type === 'speedBoost') {
                const distance = carPosition.distanceTo(decoration.position);
                if (distance < 3) {
                    // Apply speed boost
                    const boost = new THREE.Vector3(0, 0, 1);
                    boost.applyEuler(car.getRotation());
                    boost.multiplyScalar(0.3);
                    car.velocity.add(boost);
                    
                    // Visual effect (make it glow)
                    decoration.material.emissive.setHex(0x442200);
                    setTimeout(() => {
                        decoration.material.emissive.setHex(0x000000);
                    }, 500);
                }
            }
        });
        
        return hadCollision;
    }
    
    checkLapCompletion(carPosition) {
        // Check checkpoint progression
        const currentCheckpoint = this.checkpoints.find(cp => {
            const distance = carPosition.distanceTo(cp.position);
            return distance < 5 && !cp.passed;
        });
        
        if (currentCheckpoint) {
            currentCheckpoint.passed = true;
            this.checkpointsPassed.add(currentCheckpoint.index);
            
            // Visual feedback
            currentCheckpoint.mesh.material.color.setHex(0x0000ff);
            setTimeout(() => {
                currentCheckpoint.mesh.material.color.setHex(0x00ff00);
            }, 1000);
        }
        
        // Check if car crossed finish line with all checkpoints passed
        const finishDistance = carPosition.distanceTo(this.startFinishLine.position);
        if (finishDistance < 5 && this.checkpointsPassed.size >= this.checkpoints.length) {
            // Lap completed
            this.resetCheckpoints();
            return true;
        }
        
        return false;
    }
    
    resetCheckpoints() {
        this.checkpointsPassed.clear();
        this.checkpoints.forEach(checkpoint => {
            checkpoint.passed = false;
            checkpoint.mesh.material.color.setHex(0x00ff00);
        });
    }
    
    getStartPosition() {
        const startPoint = this.trackPoints[0];
        return new THREE.Vector3(startPoint.x, startPoint.y + 1, startPoint.z);
    }
    
    getStartRotation() {
        const startPoint = this.trackPoints[0];
        const nextPoint = this.trackPoints[1];
        const direction = new THREE.Vector3(
            nextPoint.x - startPoint.x,
            0,
            nextPoint.z - startPoint.z
        ).normalize();
        
        return Math.atan2(direction.x, direction.z);
    }
}